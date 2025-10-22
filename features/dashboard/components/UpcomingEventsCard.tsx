import React from 'react';
import { Link } from 'react-router-dom';
import type { Events } from '@/types';
import { CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/solid';

const UpcomingEventsCard: React.FC<{ events: Events[] }> = ({ events }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
       {events.length > 0 ? (
        <ul className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <li key={event.id}>
              <Link to={`/manage-events`} className="block hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-md -m-2">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{event.name}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <CalendarDaysIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
                  <span>{formatDate(event.start)}</span>
                  <span className="mx-2">|</span>
                   <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0"/>
                  <span className="truncate">{event.venue}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">You have no upcoming events.</p>
            <Link to="/manage-events" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-500">Create an Event</Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsCard;
