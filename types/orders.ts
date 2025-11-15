import { Events } from "./events";
import { PurchaserResponse, QRCode, TicketType } from "./tickets";

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


export interface CartItem {
  event: Events;
  ticketType: TicketType;
  quantity: number;
}

export interface OrderPageResponse {
  id: string;
  userId: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  transactionFee: number;
  totalAmount: number;
  billNumber: string;
  createdAt: string;
  updatedAt: string;
}
