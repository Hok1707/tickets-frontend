import React from 'react';

const VerificationCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-10 w-full sm:w-36 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
        </div>
    );
};

export default VerificationCardSkeleton;
