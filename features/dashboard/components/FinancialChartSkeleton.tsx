import React from 'react';

const FinancialChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[400px] bg-white dark:bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    </div>
  );
};

export default FinancialChartSkeleton;
