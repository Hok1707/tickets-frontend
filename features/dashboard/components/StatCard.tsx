import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-none hover:shadow-2xl transition-all duration-300 p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-inset ring-primary/20">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-card-foreground tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;