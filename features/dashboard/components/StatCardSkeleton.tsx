import React from 'react';

const StatCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none p-6 flex items-center gap-4">
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full animate-pulse">
                <div className="h-6 w-6 rounded-full"></div>
            </div>
            <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
            </div>
        </div>
    );
};

export default StatCardSkeleton;
