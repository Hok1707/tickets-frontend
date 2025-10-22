
import React from 'react';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
    </div>
  );
};

export default FullScreenLoader;