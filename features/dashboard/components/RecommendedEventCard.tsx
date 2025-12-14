import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { Events } from '@/types/events';

const RecommendedEventCard: React.FC<{ event: Events }> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/events`} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-xl transition-all duration-300 flex items-center p-4 gap-4 border border-gray-100 dark:border-gray-700">
      <img src={event.imageUrl} alt={event.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">{event.name}</h4>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-400 mt-1">
          <CalendarIcon className="h-4 w-4 mr-1.5" />
          <span>{formatDate(event.start)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-400 mt-1">
          <MapPinIcon className="h-4 w-4 mr-1.5" />
          <span className="truncate">{event.venue}</span>
        </div>
      </div>
    </Link>
  );
};

export default RecommendedEventCard;
