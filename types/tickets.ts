import { TicketStatus } from './common';
import { User } from './auth';
import { Events, EventTicketResponse } from './events';

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  value: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketUserResponse {
  id: string;
  ticketType: string;
  purchaser: PurchaserResponse;
  event: EventTicketResponse;
  qrCode: QrCodeResponse;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaserResponse {
  id: string;
  username: string;
  email: string;
}

export interface TicketPageResponse {
  id: string;
  purchaser: PurchaserResponse;
  status: string;
  createdAt: string;
  qrCode: QRCode;
  eventId?: string;
  eventName?: string;
  ticketName?: string;
}

export interface QRCode {
  value: string;
}

export interface Attendee {
  user: User;
  ticketType: TicketType;
  ticket: Ticket;
}

export interface TicketType {
  id?: string;
  name: string;
  price: number;
  description: string;
  totalAvailable: number;
}

export interface QrCodeResponse {
  id: string;
  value: string; 
  status: string; 
}
