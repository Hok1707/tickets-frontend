import { create } from "zustand";
import { userService } from "@/services/userService";
import { eventService } from "@/services/eventService";
import { financialService } from "@/services/financialService";
import type { DateRange, Financials, TopEvent } from "@/types";
import { ticketService } from "@/services/ticketService";

interface DashboardState {
  stats: { users: number; events: number; tickets: number };
  financials: Financials | null;
  topSellingEvents: TopEvent[];
  dateRange: DateRange;
  isLoading: boolean;

  fetchDashboardData: () => Promise<void>;
  setDateRange: (range: DateRange) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: { users: 0, events: 0, tickets: 0 },
  financials: null,
  topSellingEvents: [],
  dateRange: { startDate: null, endDate: null },
  isLoading: true,

  setDateRange: (range) => set({ dateRange: range }),

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const { dateRange } = get();

      const [usersData, allEventsRes, allTicket] = await Promise.all([
        userService.getUsers(),
        eventService.getEvents(0, 100),
        ticketService.getAllTickets(),
      ]);
      const allEvents = allEventsRes.items;

      const ticketsSold = allTicket.totalItems;

      const stats = {
        users: usersData.length,
        events: allEvents.length,
        tickets: ticketsSold,
      };

      const topSellingEvents: TopEvent[] = allEvents
        .map((e) => ({ ...e, ticketsSold: Math.floor(Math.random() * 500) }))
        .sort((a, b) => b.ticketsSold - a.ticketsSold)
        .slice(0, 5);

      const financials = await financialService.getSystemWideFinancials();

      set({ stats, topSellingEvents, financials, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
}));
