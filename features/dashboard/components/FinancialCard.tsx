import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

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
    <span className={`ml-2 flex items-center text-xs font-bold ${colorClass} bg-opacity-10 px-2 py-1 rounded-full bg-current`}>
      <Icon className="h-3 w-3 mr-1" />
      {Math.abs(change).toFixed(1)}%
    </span>
  );
};

const FinancialCard: React.FC<FinancialCardProps> = ({ title, value, icon, colorClass, change, invertChangeColor = false }) => {
  const formattedValue = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const valueColorClass = value >= 0 ? 'text-card-foreground' : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-none hover:shadow-2xl transition-all duration-300 p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3.5 rounded-2xl ${colorClass} shadow-sm ring-1 ring-inset`}>
          {icon}
        </div>
        {typeof change === 'number' && (
          <ChangeIndicator change={change} invert={invertChangeColor} />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className={`text-3xl font-bold tracking-tight ${valueColorClass}`}>{formattedValue}</h3>
      </div>
    </motion.div>
  );
};

export default FinancialCard;
