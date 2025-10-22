import React, { useEffect } from "react";
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
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import { eventService } from "@/services/eventService";
import { financialService } from "@/services/financialService";
import { useOrganizerStore } from "@/store/organizerStore"; // Zustand store
import type { Events, TopEvent, Financials, DateRange } from "@/types";
import toast from "react-hot-toast";
import StatCard from "./StatCard";
import FinancialCard from "./FinancialCard";
import FinancialChart from "./FinancialChart";
import OrganizerSidebar from "./OrganizerSidebar";
import DateRangePicker from "@/components/common/DateRangePicker";

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
  }, [user, dateRange]);

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <main className="lg:col-span-2 space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.username}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your events, track tickets, and monitor your finances.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            icon={<CalendarDaysIcon className="h-6 w-6 text-primary-500" />}
            title="Your Events"
            value={myEvents.length}
          />
          <StatCard
            icon={<TicketIcon className="h-6 w-6 text-primary-500" />}
            title="Tickets Sold"
            value={ticketsSold}
          />
        </section>

        <section className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Financial Overview</h2>
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

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Over Time</h3>
          {financials && financials.chartData.length > 0 ? (
            <FinancialChart data={financials.chartData} />
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              No financial data for the selected period.
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/manage-events"
            className="text-center px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 transition flex items-center justify-center"
          >
            Manage My Events
          </Link>
          <Link
            to="/manage-events"
            className="text-center px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Event
          </Link>
          <Link
            to="/scan"
            className="text-center px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
          >
            <QrCodeIcon className="h-5 w-5" />
            Scan Tickets
          </Link>
        </section>
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