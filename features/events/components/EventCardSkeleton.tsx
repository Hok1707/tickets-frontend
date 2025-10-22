import React from 'react';

const EventCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4 animate-pulse"></div>
                
                <div className="flex items-center mb-2">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex items-center mb-4">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-1/4 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-1/5 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCardSkeleton;
