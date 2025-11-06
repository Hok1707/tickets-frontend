import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { 
  TicketIcon, 
  CalendarIcon, 
  ArrowRightIcon, 
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ticketService } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket, Events, TicketType } from '@/types';
import { EventStatus } from '@/types';
import toast from 'react-hot-toast';
import StatCardSkeleton from './StatCardSkeleton';
import { eventService } from '@/services/eventService';
import RecommendedEventCard from './RecommendedEventCard';
import RecommendedEventCardSkeleton from './RecommendedEventCardSkeleton';

type DetailedTicket = {
    ticket: Ticket;
    event: Events;
    ticketType: TicketType;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState<DetailedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState<Events[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ticketsData, eventsResponse] = await Promise.all([
            ticketService.getMyTickets(user.id),
            eventService.getEvents(0, 50),
        ]);
        
        // Ensure ticketsData is always an array
        // Handle cases where API might return null, undefined, or wrapped data
        let tickets: DetailedTicket[] = [];
        if (Array.isArray(ticketsData)) {
          tickets = ticketsData;
        } else if (ticketsData && typeof ticketsData === 'object') {
          // Handle nested data structure
          const dataObj = ticketsData as { data?: DetailedTicket[]; items?: DetailedTicket[] };
          if (Array.isArray(dataObj.data)) {
            tickets = dataObj.data;
          } else if (Array.isArray(dataObj.items)) {
            tickets = dataObj.items;
          }
        }
        
        setMyTickets(tickets);

        // Calculate recommended events based on popularity
        const myTicketedEventIds = new Set(tickets.map(t => t.event.id));
        
        // Get all published events and filter out events user already has tickets for
        const availableEvents = eventsResponse.items.filter(
          e => !myTicketedEventIds.has(e.id) && 
          new Date(e.start) > new Date() &&
          e.status === EventStatus.PUBLISHED
        );
        
        // Sort by capacity (popularity indicator) and date proximity
        const recommendations = availableEvents
          .sort((a, b) => {
            // Prioritize events with higher capacity (more popular)
            if (Math.abs(a.capacity - b.capacity) > 50) {
              return b.capacity - a.capacity;
            }
            // Then by date proximity
            return new Date(a.start).getTime() - new Date(b.start).getTime();
          })
          .slice(0, 3);
        
        setRecommendedEvents(recommendations);

      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Calculate upcoming event ticket
  const upcomingEventTicket = useMemo(() => {
    if (!Array.isArray(myTickets) || myTickets.length === 0) return undefined;
    const now = new Date();
    const upcoming = myTickets
      .filter(t => new Date(t.event.start) > now)
      .sort((a, b) => new Date(a.event.start).getTime() - new Date(b.event.start).getTime())[0];
    return upcoming;
  }, [myTickets]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!Array.isArray(myTickets)) {
      return {
        upcomingCount: 0,
        pastCount: 0,
        validCount: 0,
        usedCount: 0,
        totalSpent: 0,
      };
    }
    const now = new Date();
    const upcomingCount = myTickets.filter(t => new Date(t.event.start) > now).length;
    const pastCount = myTickets.filter(t => new Date(t.event.end) < now).length;
    const validCount = myTickets.filter(t => t.ticket.status === 'valid').length;
    const usedCount = myTickets.filter(t => t.ticket.status === 'used').length;
    const totalSpent = myTickets.reduce((sum, t) => sum + t.ticketType.price, 0);
    
    return {
      upcomingCount,
      pastCount,
      validCount,
      usedCount,
      totalSpent,
    };
  }, [myTickets]);

  // Get recent tickets (last 3)
  const recentTickets = useMemo(() => {
    if (!Array.isArray(myTickets) || myTickets.length === 0) return [];
    return [...myTickets]
      .sort((a, b) => new Date(b.ticket.createdAt).getTime() - new Date(a.ticket.createdAt).getTime())
      .slice(0, 3);
  }, [myTickets]);

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (isLoading) {
    return (
       <div className="space-y-8">
        <header>
          <div className="h-9 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-24 animate-pulse"></div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-24 animate-pulse"></div>
        </section>

        <section>
          <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="flex-1 space-y-3 w-full">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="h-7 w-52 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 gap-4">
            <RecommendedEventCardSkeleton />
            <RecommendedEventCardSkeleton />
            <RecommendedEventCardSkeleton />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.username.split(' ')[0]}! 👋</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Your personal event hub and ticket management center.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<TicketIcon className="h-6 w-6 text-primary-500" />} 
          title="Total Tickets" 
          value={Array.isArray(myTickets) ? myTickets.length : 0} 
        />
        <StatCard 
          icon={<CalendarIcon className="h-6 w-6 text-blue-500" />} 
          title="Upcoming Events" 
          value={stats.upcomingCount} 
        />
        <StatCard 
          icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />} 
          title="Valid Tickets" 
          value={stats.validCount} 
        />
        <StatCard 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-purple-500" />} 
          title="Total Spent" 
          value={`$${stats.totalSpent.toFixed(2)}`} 
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/events" 
          className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-between items-center group"
        >
          <div>
            <h3 className="font-bold text-lg">Browse Events</h3>
            <p className="text-sm text-primary-100">Discover exciting events near you</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          to="/my-tickets" 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">View My Tickets</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Access your QR codes and ticket details</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-gray-400" />
        </Link>
      </div>

      {/* Next Upcoming Event */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Next Event</h2>
          {upcomingEventTicket && (
            <Link 
              to={`/events/${upcomingEventTicket.event.id}`}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              View Details
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {upcomingEventTicket ? (
            <Link to={`/events/${upcomingEventTicket.event.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-6 p-6">
                <img 
                  src={upcomingEventTicket.event.imageUrl} 
                  alt={upcomingEventTicket.event.name} 
                  className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-lg shadow-sm" 
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          upcomingEventTicket.ticket.status === 'valid' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {upcomingEventTicket.ticket.status === 'valid' ? 'Valid' : 'Used'}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {upcomingEventTicket.ticketType.name}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {upcomingEventTicket.event.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {upcomingEventTicket.event.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatDateTime(upcomingEventTicket.event.start).date}</p>
                        <p className="text-xs">{formatDateTime(upcomingEventTicket.event.start).time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="h-5 w-5 text-primary-500" />
                      <span className="truncate">{upcomingEventTicket.event.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="p-12 text-center">
              <CalendarIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No upcoming events</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Why not explore what's happening?</p>
              <Link 
                to="/events"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Browse Events
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Tickets */}
      {recentTickets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recent Tickets</h2>
            <Link 
              to="/my-tickets"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTickets.map((ticket) => {
              const dateTime = formatDateTime(ticket.event.start);
              return (
                <Link
                  key={ticket.ticket.id}
                  to={`/events/${ticket.event.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <img 
                    src={ticket.event.imageUrl} 
                    alt={ticket.event.name} 
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200" 
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.ticket.status === 'valid' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {ticket.ticket.status === 'valid' ? 'Valid' : 'Used'}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                      {ticket.event.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {ticket.ticketType.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-3 w-3" />
                      <span>{dateTime.date}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Events */}
      {recommendedEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recommended For You</h2>
            <Link 
              to="/events"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
            >
              See More
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {recommendedEvents.map(event => (
              <RecommendedEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;