import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import FinancialCard from './FinancialCard';
import FinancialChart from './FinancialChart';
import AdminSidebar from './AdminSidebar';
import DateRangePicker from '@/components/common/DateRangePicker';
import StatCardSkeleton from './StatCardSkeleton';
import FinancialCardSkeleton from './FinancialCardSkeleton';
import {
  UsersIcon,
  CalendarDaysIcon,
  TicketIcon,
  ArrowRightIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  QrCodeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useDashboardStore } from '@/store/adminDashboardStore';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const {
    stats,
    financials,
    topSellingEvents,
    dateRange,
    orders,
    isLoading,
    fetchDashboardData,
    setDateRange
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData().catch(() =>
      toast.error('Failed to load dashboard data')
    );
  }, [dateRange.startDate, dateRange.endDate]);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2 space-y-8">
            <div>
              <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded mt-2 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <main className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard 👨‍💼
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Complete overview of system performance and statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<UsersIcon className="h-6 w-6 text-blue-500" />}
            title="Total Users"
            value={(stats?.users ?? 0).toLocaleString()}
          />

          <StatCard
            icon={<CalendarDaysIcon className="h-6 w-6 text-purple-500" />}
            title="Total Events"
            value={(stats?.events ?? 0).toLocaleString()}
          />

          <StatCard
            icon={<TicketIcon className="h-6 w-6 text-green-500" />}
            title="Tickets Sold"
            value={(stats?.tickets ?? 0).toLocaleString()}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-primary-500" />
                Financial Overview
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track revenue, expenses, and profitability
              </p>
            </div>

            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={setDateRange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <FinancialCard
              title="Total Income"
              value={orders?.totalIncome ?? 0}
              icon={
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              }
              colorClass="bg-green-100 dark:bg-green-900/50"
              change={financials?.incomeChange}
            />

            <FinancialCard
              title="Total Amount"
              value={orders?.totalIncome ?? 0}
              icon={
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              }
              colorClass="bg-red-100 dark:bg-red-900/50"
              change={financials?.expensesChange}
              invertChangeColor
            />

            <FinancialCard
              title="Net Profit"
              value={orders?.netProfit ?? 0}
              icon={
                <BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              }
              colorClass="bg-blue-100 dark:bg-blue-900/50"
              change={financials?.netProfitChange}
            />

            <FinancialCard
              title="Taxes (5%)" value={orders?.transactionFee ?? 0}
              icon={
                <ReceiptPercentIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              }
              colorClass="bg-yellow-100 dark:bg-yellow-900/50"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-primary-500" />
                Performance Over Time
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Income, expenses, and profit trends
              </p>
            </div>
          </div>

          {financials?.chartData?.length ? (
            <FinancialChart data={financials.chartData} />
          ) : (
            <div className="text-center py-16">
              <ChartBarIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No financial data available
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Select a date range to view financial trends
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Cog6ToothIcon className="h-6 w-6 text-primary-500" />
                Quick Actions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Common administrative tasks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/users"
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
              text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
              flex justify-between items-center group transform hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <UsersIcon className="h-5 w-5" />
                  <h3 className="font-bold text-lg">Manage Users</h3>
                </div>
                <p className="text-sm text-blue-100">
                  View, edit, and manage user roles and permissions
                </p>
              </div>

              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/manage-events"
              className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 
              text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
              flex justify-between items-center group transform hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <h3 className="font-bold text-lg">Manage Events</h3>
                </div>
                <p className="text-sm text-purple-100">
                  Create, edit, and manage all events in the system
                </p>
              </div>

              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/scan"
              className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 
              text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
              flex justify-between items-center md:col-span-2 group transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <QrCodeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Scan & Verify Tickets</h3>
                  <p className="text-sm text-green-100">
                    Quick access to ticket scanning and verification
                  </p>
                </div>
              </div>

              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary-500 p-3 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                System Status
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All systems operational.{' '}
                {stats?.users} users, {stats?.events} events, {stats?.tickets} tickets sold.
              </p>
            </div>
          </div>
        </div>
      </main>

      <AdminSidebar topSellingEvents={topSellingEvents} />
    </div>
  );
};

export default AdminDashboard;