import React from 'react';
import { Link } from 'react-router-dom';
import { ChartPieIcon, TicketIcon } from '@heroicons/react/24/solid';
import { Events } from '@/types/events';

export interface TopEvent extends Events {
  ticketsSold: number;
}

const TopEventsCard: React.FC<{ events: TopEvent[]; title: string; }> = ({ events, title }) => {
  return (
    <div className="bg-card rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none p-6 border border-border">
      <h3 className="text-xl font-bold text-card-foreground mb-4">{title}</h3>
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li key={event.id}>
              <Link to={`/events`} className="group/item block hover:bg-muted/50 p-2.5 rounded-xl border border-transparent hover:border-border transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground group-hover/item:bg-card group-hover/item:text-primary transition-colors border border-transparent group-hover/item:border-border">
                    {index + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-card-foreground truncate group-hover/item:text-primary transition-colors">{event.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary">
                    <TicketIcon className="h-3.5 w-3.5" />
                    <span>{event.ticketsSold.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <ChartPieIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">No ticket sales data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default TopEventsCard;