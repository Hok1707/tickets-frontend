import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import StatCard from "./StatCard";
import StatCardSkeleton from "./StatCardSkeleton";
import RecommendedEventCard from "./RecommendedEventCard";
import RecommendedEventCardSkeleton from "./RecommendedEventCardSkeleton";

import { useAuth } from "@/hooks/useAuth";
import { ticketService } from "@/services/ticketService";
import { eventService } from "@/services/eventService";


import {
  TicketIcon,
  CalendarIcon,
  ArrowRightIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { EventStatus, TicketStatus } from "@/types/common";
import { TicketUserResponse } from "@/types/tickets";


const UserDashboard: React.FC = () => {
  const { user, role } = useAuth();

  const [tickets, setTickets] = useState<TicketUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ticketData, eventData] = await Promise.all([
          ticketService.getMyTickets(user.id),
          eventService.getEvents(0, 50),
        ]);

        setTickets(ticketData || []);

        const myEventIds = new Set(ticketData.map(t => t.event.id));

        const availableEvents = eventData.items.filter(
          e =>
            !myEventIds.has(e.id) &&
            new Date(e.start) > new Date() &&
            e.status === EventStatus.PUBLISHED
        );

        const recommendations = availableEvents
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 3);

        setRecommendedEvents(recommendations);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const upcomingTicket = useMemo(() => {
    const now = new Date();
    return tickets
      .filter(t => new Date(t.event.start) > now)
      .sort((a, b) => new Date(a.event.start).getTime() - new Date(b.event.start).getTime())[0];
  }, [tickets]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      upcomingCount: tickets.filter(t => new Date(t.event.start) > now).length,
      pastCount: tickets.filter(t => new Date(t.event.end) < now).length,
      validCount: tickets.filter(t => t.status === TicketStatus.VALID).length,
      usedCount: tickets.filter(t => t.status === TicketStatus.USED).length,
      totalSpent: tickets.reduce((sum, t) => sum + (t.price || 0), 0),
    };
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [tickets]);

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return { date: "-", time: "-" };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-9 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </section>
        <section className="grid grid-cols-1 gap-4">
          <RecommendedEventCardSkeleton />
          <RecommendedEventCardSkeleton />
          <RecommendedEventCardSkeleton />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.username.split(" ")[0]}! 👋
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Your personal event hub and ticket management center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TicketIcon className="h-6 w-6 text-primary-500" />}
          title="Total Tickets"
          value={tickets.length}
        />
        <StatCard
          icon={<CalendarIcon className="h-6 w-6 text-blue-500" />}
          title="Upcoming Events"
          value={stats.upcomingCount}
        />
        <StatCard
          icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          title="Valid Tickets"
          value={tickets.length}
        />
        <StatCard
          icon={<CurrencyDollarIcon className="h-6 w-6 text-purple-500" />}
          title="Total Spent"
          value={`$${stats.totalSpent.toFixed(2)}`}
        />
      </div>

      {upcomingTicket && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <Link to={`/events/${upcomingTicket.event.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex flex-col sm:flex-row gap-6 p-6">
              {upcomingTicket.event.imageUrl && (
                <img
                  src={upcomingTicket.event.imageUrl}
                  alt={upcomingTicket.event.name}
                  className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-lg shadow-sm"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {upcomingTicket.event.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {upcomingTicket.event.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-5 w-5 text-primary-500" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDateTime(upcomingTicket.event.start).date}
                      </p>
                      <p className="text-xs">
                        {formatDateTime(upcomingTicket.event.start).time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-5 w-5 text-primary-500" />
                    <span className="truncate">{upcomingTicket.event.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {recentTickets.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Recent Tickets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTickets.map(ticket => {
              const dt = formatDateTime(ticket.event.start);
              return (
                <Link
                  key={ticket.id}
                  to={`/events/${ticket.event.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  {ticket.event.imageUrl && (
                    <img
                      src={ticket.event.imageUrl}
                      alt={ticket.event.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                      {ticket.event.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {ticket.ticketType}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-3 w-3" />
                      <span>{dt.date}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {recommendedEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Recommended For You
          </h2>
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