import { Events } from './events';
import { PurchaserResponse, QRCode, TicketType } from './tickets';

export interface Order {
  orderId: string;
  totalAmount: number;
  paymentMethod?: string;
  status?: string;
  billNumber: string;
}

export interface QRpayload {
  amount: number;
  currency: string;
  billNumber: string;
  qr?: string;
}

export interface Payment {
  billNumber: string;
  currency: string;
  amount: number;
  qr?: string;
}

export interface OrderPageResponse {
  id: string;
  purchaser: PurchaserResponse;
  status: string;
  createdAt: string;
  qrCode: QRCode;
  eventId: string;
}

export interface CartItem {
  event: Events;
  ticketType: TicketType;
  quantity: number;
}