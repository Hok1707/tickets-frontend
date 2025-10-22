import { create } from "zustand";
import type { Events, TopEvent, Financials, DateRange } from "@/types";

interface OrganizerStoreState {
  myEvents: Events[];
  ticketsSold: number;
  topSellingEvents: TopEvent[];
  upcomingEvents: Events[];
  financials: Financials | null;
  dateRange: DateRange;
  isLoading: boolean;

  // Computed / derived values
  totalTicketsAvailable: number;
  nextUpcomingEvent: Events | null;
  topRevenueEvent: TopEvent | null;

  setMyEvents: (events: Events[]) => void;
  setTicketsSold: (count: number) => void;
  setTopSellingEvents: (events: TopEvent[]) => void;
  setUpcomingEvents: (events: Events[]) => void;
  setFinancials: (data: Financials) => void;
  setDateRange: (range: DateRange) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useOrganizerStore = create<OrganizerStoreState>((set, get) => ({
  myEvents: [],
  ticketsSold: 0,
  topSellingEvents: [],
  upcomingEvents: [],
  financials: null,
  dateRange: { startDate: null, endDate: null },
  isLoading: true,

  // Computed values
  get totalTicketsAvailable() {
    return get().myEvents.reduce((total, event) => {
      const tickets = event.ticketTypes?.reduce((sum, t) => sum + (t.totalAvailable ?? 0), 0) ?? 0;
      return total + tickets;
    }, 0);
  },

  get nextUpcomingEvent() {
    const upcoming = get().upcomingEvents;
    return upcoming.length > 0 ? upcoming[0] : null;
  },

  get topRevenueEvent() {
    const topEvents = get().topSellingEvents;
    if (topEvents.length === 0) return null;
    return topEvents.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev));
  },

  setMyEvents: (events) => set({ myEvents: events }),
  setTicketsSold: (count) => set({ ticketsSold: count }),
  setTopSellingEvents: (events) => set({ topSellingEvents: events }),
  setUpcomingEvents: (events) => set({ upcomingEvents: events }),
  setFinancials: (data) => set({ financials: data }),
  setDateRange: (range) => set({ dateRange: range }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
