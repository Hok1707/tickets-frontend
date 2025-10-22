import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface FinancialCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  change?: number | null;
  invertChangeColor?: boolean;
}

const ChangeIndicator: React.FC<{ change: number; invert: boolean }> = ({ change, invert }) => {
    const isPositive = change >= 0;
    let colorClass = '';

    if (isPositive) {
        colorClass = invert ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
    } else {
        colorClass = invert ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }

    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

    return (
        <span className={`ml-2 flex items-center text-sm font-semibold ${colorClass}`}>
            <Icon className="h-4 w-4" />
            {Math.abs(change).toFixed(1)}%
        </span>
    );
};

const FinancialCard: React.FC<FinancialCardProps> = ({ title, value, icon, colorClass, change, invertChangeColor = false }) => {
  const formattedValue = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const valueColorClass = value >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className={`text-xl font-bold ${valueColorClass}`}>{formattedValue}</p>
        {typeof change === 'number' && (
            <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <ChangeIndicator change={change} invert={invertChangeColor} />
                <span>vs prev. period</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default FinancialCard;
