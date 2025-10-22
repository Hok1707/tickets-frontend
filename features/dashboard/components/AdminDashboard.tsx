import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import FinancialCard from './FinancialCard';
import FinancialChart from './FinancialChart';
import AdminSidebar from './AdminSidebar';
import DateRangePicker from '@/components/common/DateRangePicker';
import { 
    UsersIcon, CalendarDaysIcon, TicketIcon, ArrowRightIcon, BanknotesIcon, 
    ReceiptPercentIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, QrCodeIcon
} from '@heroicons/react/24/outline';
import { useDashboardStore } from '@/store/adminDashboardStore';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
    const {
        stats, financials, topSellingEvents, dateRange, isLoading,
        fetchDashboardData, setDateRange
    } = useDashboardStore();

    useEffect(() => {
        fetchDashboardData().catch(() => toast.error('Failed to load dashboard data'));
    }, [dateRange]);

    if (isLoading) return <div className="animate-pulse p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <main className="lg:col-span-2 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Overview of the entire system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={<UsersIcon className="h-6 w-6 text-primary-500" />} title="Total Users" value={stats.users} />
                    <StatCard icon={<CalendarDaysIcon className="h-6 w-6 text-primary-500" />} title="Total Events" value={stats.events} />
                    <StatCard icon={<TicketIcon className="h-6 w-6 text-primary-500" />} title="Tickets Sold" value={stats.tickets} />
                </div>

                <div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Financial Overview</h2>
                        <DateRangePicker startDate={dateRange.startDate} endDate={dateRange.endDate} onChange={setDateRange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                        <FinancialCard title="Total Income" value={financials?.totalIncome ?? 0} icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />} colorClass="bg-green-100 dark:bg-green-900/50" change={financials?.incomeChange} />
                        <FinancialCard title="Total Expenses" value={financials?.totalExpenses ?? 0} icon={<ArrowTrendingDownIcon className="h-6 w-6 text-red-600 dark:text-red-400" />} colorClass="bg-red-100 dark:bg-red-900/50" change={financials?.expensesChange} invertChangeColor />
                        <FinancialCard title="Net Profit" value={financials?.netProfit ?? 0} icon={<BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />} colorClass="bg-blue-100 dark:bg-blue-900/50" change={financials?.netProfitChange} />
                        <FinancialCard title="Taxes (20%)" value={financials?.taxes ?? 0} icon={<ReceiptPercentIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />} colorClass="bg-yellow-100 dark:bg-yellow-900/50" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Over Time</h3>
                    {financials?.chartData?.length ? (
                        <FinancialChart data={financials.chartData} />
                    ) : (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">No financial data for the selected period.</div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/admin/users" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Manage Users</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">View, edit, and manage user roles.</p>
                            </div>
                            <ArrowRightIcon className="h-6 w-6 text-gray-400" />
                        </Link>
                        <Link to="/manage-events" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Manage All Events</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit, and delete any event.</p>
                            </div>
                            <ArrowRightIcon className="h-6 w-6 text-gray-400" />
                        </Link>
                        <Link to="/scan" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center md:col-span-2">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Scan Tickets</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Verify and check-in attendees.</p>
                            </div>
                            <QrCodeIcon className="h-8 w-8 text-gray-400" />
                        </Link>
                    </div>
                </div>
            </main>

            <AdminSidebar topSellingEvents={topSellingEvents} />
        </div>
    );
};

export default AdminDashboard;