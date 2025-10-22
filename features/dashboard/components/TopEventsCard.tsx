import React from 'react';
import { Link } from 'react-router-dom';
import type { Events } from '@/types';
import { ChartPieIcon, TicketIcon } from '@heroicons/react/24/solid';

export interface TopEvent extends Events {
    ticketsSold: number;
}

const TopEventsCard: React.FC<{ events: TopEvent[]; title: string; }> = ({ events, title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li key={event.id}>
              <Link to={`/manage-events`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-md -m-3 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-gray-400 dark:text-gray-500">{index + 1}</div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{event.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-primary-500 flex-shrink-0">
                    <TicketIcon className="h-4 w-4" />
                    <span>{event.ticketsSold.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
            <ChartPieIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No ticket sales data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default TopEventsCard;