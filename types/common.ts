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

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}