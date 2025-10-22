import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { TicketIcon, CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { ticketService } from '@/services/ticketService';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket, Events, TicketType } from '@/types';
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
        const [ticketsData] = await Promise.all([
            ticketService.getMyTickets(user.id),
            eventService.getEvents(),
        ]);
        setMyTickets(ticketsData);

        // const myTicketedEventIds = new Set(ticketsData.map(t => t.event.id));

        // const eventSales = allEvents.map(event => {
        //     const sold = allTickets.filter(t => t.eventId === event.id).length;
        //     return { ...event, ticketsSold: sold };
        // });

        // const recommendations = eventSales
        //     .filter(e => !myTicketedEventIds.has(e.id))
        //     .sort((a, b) => b.ticketsSold - a.ticketsSold)
        //     .slice(0, 3);
        // setRecommendedEvents(recommendations);

      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const upcomingEventTicket = useMemo(() => {
    return myTickets
        .filter(t => new Date(t.event.start) > new Date())
        .sort((a, b) => new Date(a.event.start).getTime() - new Date(b.event.start).getTime())[0];
  }, [myTickets]);

  if (isLoading) {
    return (
       <div className="space-y-8">
        <header>
          <div className="h-9 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.username.split(' ')[0]}!</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Your personal event hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard icon={<TicketIcon className="h-6 w-6 text-primary-500" />} title="Your Tickets" value={myTickets.length} />
        <StatCard icon={<CalendarIcon className="h-6 w-6 text-primary-500" />} title="Upcoming Events" value={myTickets.filter(t => new Date(t.event.start) > new Date()).length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/events" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Browse Events</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Find your next experience.</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-gray-400" />
        </Link>
        <Link to="/my-tickets" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">View My Tickets</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Access your QR codes.</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-gray-400" />
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Next Event</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {upcomingEventTicket ? (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={upcomingEventTicket.event.imageUrl} alt={upcomingEventTicket.event.name} className="w-full sm:w-48 h-32 object-cover rounded-md" />
                    <div>
                        <p className="text-sm text-primary-500 font-semibold">{new Date(upcomingEventTicket.event.start).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{upcomingEventTicket.event.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{upcomingEventTicket.event.venue}</p>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">You have no upcoming events. Why not find one?</p>
            )}
        </div>
      </div>

      {recommendedEvents.length > 0 && (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Recommended For You</h2>
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