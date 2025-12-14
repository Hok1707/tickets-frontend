import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { EventStatus, TicketStatus } from "@/types/common";
import { TicketUserResponse } from "@/types/tickets";
import { useTranslation } from "react-i18next";


const UserDashboard: React.FC = () => {
  const { user } = useAuth();

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
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { t } = useTranslation();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
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
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-purple-600 p-8 sm:p-12 text-white shadow-2xl shadow-primary-500/20"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3">
            {t('userDashboard.welcome')} {user?.username.split(" ")[0]}! <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl">
            {t('userDashboard.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TicketIcon className="h-6 w-6" />}
          title={t('userDashboard.totalTickets')}
          value={tickets.length}
        />
        <StatCard
          icon={<CalendarIcon className="h-6 w-6" />}
          title={t('userDashboard.upcomingEvents')}
          value={stats.upcomingCount}
        />
        <StatCard
          icon={<CheckCircleIcon className="h-6 w-6" />}
          title={t('userDashboard.validTickets')}
          value={stats.validCount}
        />
        <StatCard
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          title={t('userDashboard.totalSpent')}
          value={`$${stats.totalSpent.toFixed(2)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Ticket */}
          {upcomingTicket && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-foreground dark:text-primary-500" />
                Next Event
              </h2>
              <Link to={`/events/${upcomingTicket.event.id}`} className="group block relative bg-card rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
                <div className="absolute top-0 right-0 p-4 z-10">
                  <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    UPCOMING
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                    {upcomingTicket.event.imageUrl ? (
                      <img
                        src={upcomingTicket.event.imageUrl}
                        alt={upcomingTicket.event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <TicketIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r"></div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {upcomingTicket.event.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2">
                      {upcomingTicket.event.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-semibold text-card-foreground text-sm">
                            {formatDateTime(upcomingTicket.event.start).date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                          <ClockIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="font-semibold text-card-foreground text-sm">
                            {formatDateTime(upcomingTicket.event.start).time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 col-span-2">
                        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                          <MapPinIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Venue</p>
                          <p className="font-semibold text-card-foreground text-sm truncate">
                            {upcomingTicket.event.venue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Recent Tickets */}
          {recentTickets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('userDashboard.recentTickets')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTickets.map((ticket, idx) => {
                  const dt = formatDateTime(ticket.event.start);
                  return (
                    <Link
                      key={ticket.id}
                      to={`/events/${ticket.event.id}`}
                      className="group bg-card rounded-2xl p-4 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl transition-all border border-border hover:-translate-y-1"
                    >
                      <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                        {ticket.event.imageUrl ? (
                          <img
                            src={ticket.event.imageUrl}
                            alt={ticket.event.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md">
                          {ticket.ticketType}
                        </div>
                      </div>
                      <h4 className="font-bold text-card-foreground line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors">
                        {ticket.event.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{dt.date} • {dt.time}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Area (Recommendations) */}
        <div className="lg:col-span-1">
          {recommendedEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-foreground mb-4">
                {t('userDashboard.recommendedForYou')}
              </h2>
              <div className="space-y-4">
                {recommendedEvents.map(event => (
                  <RecommendedEventCard key={event.id} event={event} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;