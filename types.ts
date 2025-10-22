export enum Role {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  STAFF = "STAFF",
  USER = "USER",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  BLOCKED = "BLOCKED",
}
export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum TicketStatus {
  VALID = "valid",
  USED = "used",
}

export interface User {
  id: string | null;
  username: string;
  email: string;
  phoneNumber?: string | null;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id?: string;
  name: string;
  price: number;
  description: string;
  totalAvailable: number;
}

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

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  purchaseDate: string;
  qrCodeValue: string;
  status: TicketStatus;
}

export interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  status: string;
}

export interface Payment{
  status: string;
  orderId: string,
  amount: number,
  qrImage: string
}

export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface TopEvent extends Events {
  ticketsSold: number;
  revenue?: number;
}

export interface Attendee {
  user: User;
  ticketType: TicketType;
  ticket: Ticket;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface Financials {
  totalIncome: number;
  incomeChange: number | null;
  totalExpenses: number;
  expensesChange: number | null;
  netProfit: number;
  netProfitChange: number | null;
  taxes: number;
  chartData: ChartDataPoint[];
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

export type RedeemFailureReason =
  | "ALREADY_USED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export type RedeemTicketResponse =
  | {
      success: true;
      message: string;
      data: {
        ticket: Ticket;
        event: Event;
        user: User;
        ticketType: TicketType;
      };
    }
  | { success: false; message: string; reason: RedeemFailureReason };
