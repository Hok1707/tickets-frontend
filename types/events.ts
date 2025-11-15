import { EventStatus } from './common';
import { TicketType } from './tickets';

export interface Events {
  id: string;
  name: string;
  description: string;
  venue: string;
  start: string;
  end: string;
  imageUrl: string;
  organizerId: string;
  capacity: number;
  status: EventStatus;
  ticketTypes: TicketType[];
  expenses?: number;
  category?: string;
}

export interface EventTicketResponse {
  id: string;
  name: string;
  description: string;
  status: string;
  organizerName: string;
  start: string;
  end: string;
  imageUrl: string;
  venue: string;
}

export interface TopEvent extends Events {
  ticketsSold: number;
  revenue?: number;
}
