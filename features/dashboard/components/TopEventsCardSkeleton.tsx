import React from 'react';

const TopEventsCardSkeleton: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 animate-pulse">
      <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-1">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-grow h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEventsCardSkeleton;
