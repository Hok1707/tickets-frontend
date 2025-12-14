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
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
  const { t } = useTranslation();

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

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </main>

          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            {t('dashboard.adminTitle')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('dashboard.adminSubtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <StatCard
            icon={<UsersIcon className="h-6 w-6" />}
            title={t('dashboard.totalUsers')}
            value={(stats?.users ?? 0).toLocaleString()}
          />

          <StatCard
            icon={<CalendarDaysIcon className="h-6 w-6" />}
            title={t('dashboard.totalEvents')}
            value={(stats?.events ?? 0).toLocaleString()}
          />

          <StatCard
            icon={<TicketIcon className="h-6 w-6" />}
            title={t('dashboard.ticketsSold')}
            value={(stats?.tickets ?? 0).toLocaleString()}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-border p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-foreground dark:text-primary-500" />
                {t('dashboard.financialOverview')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboard.financialSubtitle')}
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
              title={t('dashboard.totalIncome')}
              value={orders?.totalIncome ?? 0}
              icon={
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              }
              colorClass="bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20"
              change={financials?.incomeChange}
            />

            <FinancialCard
              title={t('dashboard.totalAmount')}
              value={orders?.totalIncome ?? 0}
              icon={
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              }
              colorClass="bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20"
              change={financials?.expensesChange}
              invertChangeColor
            />

            <FinancialCard
              title={t('dashboard.netProfit')}
              value={orders?.netProfit ?? 0}
              icon={
                <BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              }
              colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20"
              change={financials?.netProfitChange}
            />

            <FinancialCard
              title={t('dashboard.taxes')} value={orders?.transactionFee ?? 0}
              icon={
                <ReceiptPercentIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              }
              colorClass="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-yellow-500/20"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-foreground dark:text-primary-500" />
                {t('dashboard.performance')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboard.performanceSubtitle')}
              </p>
            </div>
          </div>

          {financials?.chartData?.length ? (
            <FinancialChart data={financials.chartData} />
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 dark:border-none dark:bg-gray-900/50 rounded-xl">
              <ChartBarIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-card-foreground font-medium">
                No financial data available
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Select a date range to view financial trends
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Cog6ToothIcon className="h-6 w-6 text-foreground dark:text-primary-500" />
                {t('dashboard.quickActions')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('dashboard.quickActionsSubtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/users"
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
              text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
              flex justify-between items-center group transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">{t('dashboard.manageUsers')}</h3>
                </div>
                <p className="text-sm text-blue-100">
                  {t('dashboard.manageUsersDesc')}
                </p>
              </div>

              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/manage-events"
              className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 
              text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
              flex justify-between items-center group transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CalendarDaysIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg">{t('dashboard.manageEvents')}</h3>
                </div>
                <p className="text-sm text-purple-100">
                  {t('dashboard.manageEventsDesc')}
                </p>
              </div>

              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/scan"
              className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 
              text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
              flex justify-between items-center md:col-span-2 group transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <QrCodeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{t('dashboard.scanVerify')}</h3>
                  <p className="text-sm text-green-100">
                    {t('dashboard.scanVerifyDesc')}
                  </p>
                </div>
              </div>

              <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary-500 p-3 rounded-xl shadow-lg shadow-primary-500/30">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">
                {t('dashboard.systemStatus')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.systemOperational')} <span className="font-semibold text-primary-600 dark:text-primary-400">{stats?.users}</span> users, <span className="font-semibold text-primary-600 dark:text-primary-400">{stats?.events}</span> events, <span className="font-semibold text-primary-600 dark:text-primary-400">{stats?.tickets}</span> tickets sold.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <AdminSidebar topSellingEvents={topSellingEvents} />
    </div >
  );
};

export default AdminDashboard;