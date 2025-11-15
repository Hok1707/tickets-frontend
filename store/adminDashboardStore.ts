import { create } from "zustand";
import { userService } from "@/services/userService";
import { eventService } from "@/services/eventService";
import { financialService } from "@/services/financialService";
import { ticketService } from "@/services/ticketService";
import { TopEvent } from "@/types/events";
import { Financials } from "@/types/financials";
import { DateRange } from "@/types/common";

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

      const [usersRes, eventsRes, ticketsRes, financials] = await Promise.all([
        userService.getUsers(),
        eventService.getEvents(0, 100),
        ticketService.getAllTickets(0, 100),
        financialService.getSystemWideFinancials(),
      ]);

      const allEvents = eventsRes.items ?? [];
      const ticketsSold = ticketsRes?.totalItems ?? 0;
console.log('ticket res ',ticketsRes);

      const stats = {
        users: usersRes?.length ?? 0,
        events: allEvents.length,
        tickets: ticketsSold,
      };

      const topSellingEvents: TopEvent[] = allEvents
        .map((event) => ({
          ...event,
          ticketsSold: Math.floor(Math.random() * 500),
        }))
        .sort((a, b) => b.ticketsSold - a.ticketsSold)
        .slice(0, 5);

      set({
        stats,
        topSellingEvents,
        financials,
        isLoading: false,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      set({ isLoading: false });
    }
  },
}));