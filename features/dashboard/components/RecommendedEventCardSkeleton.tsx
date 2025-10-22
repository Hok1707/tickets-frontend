import React from 'react';

const RecommendedEventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center gap-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0"></div>
      <div className="flex-grow space-y-2">
        <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default RecommendedEventCardSkeleton;
