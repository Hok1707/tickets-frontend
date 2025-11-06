import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  TicketIcon,
  PlusIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  QrCodeIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { eventService } from "@/services/eventService";
import { financialService } from "@/services/financialService";
import { useOrganizerStore } from "@/store/organizerStore";
import type { Events, TopEvent, Financials, DateRange } from "@/types";
import { EventStatus } from "@/types";
import toast from "react-hot-toast";
import StatCard from "./StatCard";
import FinancialCard from "./FinancialCard";
import FinancialChart from "./FinancialChart";
import OrganizerSidebar from "./OrganizerSidebar";
import DateRangePicker from "@/components/common/DateRangePicker";
import StatCardSkeleton from "./StatCardSkeleton";
import FinancialCardSkeleton from "./FinancialCardSkeleton";

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    myEvents,
    setMyEvents,
    ticketsSold,
    setTicketsSold,
    topSellingEvents,
    setTopSellingEvents,
    upcomingEvents,
    setUpcomingEvents,
    financials,
    setFinancials,
    dateRange,
    setDateRange,
    isLoading,
    setIsLoading,
  } = useOrganizerStore();

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const eventsRes = await eventService.getEventsByOranizer();
        const events = eventsRes.items;
        setMyEvents(events);

        const ticketsSoldCount = events.reduce((acc, ev) => acc + (ev.ticketTypes?.reduce((tAcc, t) => tAcc + (t.totalAvailable || 0), 0) || 0), 0);
        setTicketsSold(ticketsSoldCount);

        const topEvents: TopEvent[] = [...events]
          .map(ev => ({
            ...ev,
            ticketsSold: Math.floor(Math.random() * 500),
          }))
          .sort((a, b) => b.ticketsSold - a.ticketsSold)
          .slice(0, 5);
        setTopSellingEvents(topEvents);

        const upcoming = [...events]
          .filter(ev => new Date(ev.start) > new Date())
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        setUpcomingEvents(upcoming);

        // Financials
        const financialData: Financials = await financialService.getSystemWideFinancials(dateRange);
        setFinancials(financialData);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dateRange]);

  // Calculate additional statistics
  const stats = useMemo(() => {
    const publishedEvents = myEvents.filter(e => e.status === EventStatus.PUBLISHED).length;
    const draftEvents = myEvents.filter(e => e.status === EventStatus.DRAFT).length;
    const completedEvents = myEvents.filter(e => e.status === EventStatus.COMPLETED).length;
    const totalCapacity = myEvents.reduce((sum, e) => sum + (e.capacity || 0), 0);
    
    return {
      publishedEvents,
      draftEvents,
      completedEvents,
      totalCapacity,
    };
  }, [myEvents]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <main className="lg:col-span-2 space-y-8">
          <div>
            <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div>
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FinancialCardSkeleton />
              <FinancialCardSkeleton />
              <FinancialCardSkeleton />
              <FinancialCardSkeleton />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </main>
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <main className="lg:col-span-2 space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome, {user.username.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your events, track ticket sales, and monitor your financial performance.
          </p>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<CalendarDaysIcon className="h-6 w-6 text-blue-500" />}
            title="Total Events"
            value={myEvents.length.toLocaleString()}
          />
          <StatCard
            icon={<TicketIcon className="h-6 w-6 text-green-500" />}
            title="Tickets Sold"
            value={ticketsSold.toLocaleString()}
          />
          <StatCard
            icon={<SparklesIcon className="h-6 w-6 text-purple-500" />}
            title="Published"
            value={stats.publishedEvents.toLocaleString()}
          />
          <StatCard
            icon={<UsersIcon className="h-6 w-6 text-orange-500" />}
            title="Total Capacity"
            value={stats.totalCapacity.toLocaleString()}
          />
        </section>

        {/* Financial Overview */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-primary-500" />
                Financial Overview
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track revenue, expenses, and profitability</p>
            </div>
            <DateRangePicker startDate={dateRange.startDate} endDate={dateRange.endDate} onChange={setDateRange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialCard
              title="Total Income"
              value={financials?.totalIncome ?? 0}
              icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />}
              colorClass="bg-green-100 dark:bg-green-900/50"
              change={financials?.incomeChange}
            />
            <FinancialCard
              title="Total Expenses"
              value={financials?.totalExpenses ?? 0}
              icon={<ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />}
              colorClass="bg-red-100 dark:bg-red-900/50"
              change={financials?.expensesChange}
              invertChangeColor
            />
            <FinancialCard
              title="Net Profit"
              value={financials?.netProfit ?? 0}
              icon={<BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              colorClass="bg-blue-100 dark:bg-blue-900/50"
              change={financials?.netProfitChange}
            />
            <FinancialCard
              title="Est. Taxes (20%)"
              value={financials?.taxes ?? 0}
              icon={<ReceiptPercentIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
              colorClass="bg-yellow-100 dark:bg-yellow-900/50"
            />
          </div>
        </section>

        {/* Performance Chart */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-primary-500" />
                Performance Over Time
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Income, expenses, and profit trends</p>
            </div>
          </div>
          {financials && financials.chartData.length > 0 ? (
            <FinancialChart data={financials.chartData} />
          ) : (
            <div className="text-center py-16">
              <ChartBarIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No financial data available</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Select a date range to view financial trends</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Cog6ToothIcon className="h-6 w-6 text-primary-500" />
                Quick Actions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Common tasks for event management</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/manage-events"
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-between items-center group transform hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <h3 className="font-bold text-lg">Manage Events</h3>
                </div>
                <p className="text-sm text-blue-100">View, edit, and manage all your events</p>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/manage-events"
              className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-between items-center group transform hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PlusIcon className="h-5 w-5" />
                  <h3 className="font-bold text-lg">Create Event</h3>
                </div>
                <p className="text-sm text-purple-100">Create a new event and start selling tickets</p>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/scan"
              className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-between items-center md:col-span-2 group transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <QrCodeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Scan & Verify Tickets</h3>
                  <p className="text-sm text-green-100">Quick access to ticket scanning and verification</p>
                </div>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Event Status Summary */}
        {myEvents.length > 0 && (
          <section className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-500 p-3 rounded-lg">
                <CalendarDaysIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Event Status Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publishedEvents}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Published</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draftEvents}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Draft</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.completedEvents}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Completed</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{myEvents.length}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <OrganizerSidebar
        topSellingEvents={topSellingEvents}
        upcomingEvents={upcomingEvents}
        organizerId={user.id}
      />
    </div>
  );
};

export default OrganizerDashboard;