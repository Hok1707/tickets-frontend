import React from 'react';

const FinancialCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none p-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="mt-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
            </div>
        </div>
    );
};

export default FinancialCardSkeleton;
