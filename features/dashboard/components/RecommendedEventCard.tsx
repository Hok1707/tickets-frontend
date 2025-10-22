import React from 'react';
import { Link } from 'react-router-dom';
import type { Events } from '@/types';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/solid';

const RecommendedEventCard: React.FC<{ event: Events }> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/events`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center p-4 gap-4">
      <img src={event.imageUrl} alt={event.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">{event.name}</h4>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          <CalendarIcon className="h-4 w-4 mr-1.5" />
          <span>{formatDate(event.start)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
          <MapPinIcon className="h-4 w-4 mr-1.5" />
          <span className="truncate">{event.venue}</span>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedEventCard;
