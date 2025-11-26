import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { QrCodeIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

const StaffDashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('staffDashboard.welcome')} {user?.username.split(' ')[0]}!</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{t('staffDashboard.subtitle')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <QrCodeIcon className="mx-auto h-16 w-16 text-primary-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{t('staffDashboard.ticketScanner')}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {t('staffDashboard.description')}
                </p>
                <div className="mt-6">
                    <Link
                        to="/scan"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                    >
                        {t('staffDashboard.startScanning')}
                        <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
