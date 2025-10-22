import { create } from "zustand";
import { Events, TicketType, EventStatus } from "@/types";

interface EventStoreState {
  selectedEvent: Events | null;
  setSelectedEvent: (event: Events) => void;
  updateEventField: <K extends keyof Events>(field: K, value: Events[K]) => void;
  addTicketType: () => void;
  updateTicketType: (index: number, field: keyof TicketType, value: any) => void;
  removeTicketType: (index: number) => void;
  resetSelectedEvent: () => void;
}

export const useEventStore = create<EventStoreState>((set, get) => ({
  selectedEvent: null,

  setSelectedEvent: (event: Events) => set({ selectedEvent: event }),

  resetSelectedEvent: () => set({ selectedEvent: null }),

  updateEventField: (field, value) =>
    set((state) => {
      if (!state.selectedEvent) return {};
      return {
        selectedEvent: {
          ...state.selectedEvent,
          [field]: value,
        },
      };
    }),

  addTicketType: () =>
    set((state) => {
      if (!state.selectedEvent) return {};
      const newTicket: TicketType = {
        id: "",
        name: "",
        description: "",
        price: 0,
        totalAvailable: 0,
      };
      return {
        selectedEvent: {
          ...state.selectedEvent,
          ticketTypes: [...(state.selectedEvent.ticketTypes || []), newTicket],
        },
      };
    }),

  updateTicketType: (index, field, value) =>
    set((state) => {
      if (!state.selectedEvent) return {};
      const updatedTickets = [...(state.selectedEvent.ticketTypes || [])];
      updatedTickets[index] = { ...updatedTickets[index], [field]: value };
      return {
        selectedEvent: {
          ...state.selectedEvent,
          ticketTypes: updatedTickets,
        },
      };
    }),

  removeTicketType: (index) =>
    set((state) => {
      if (!state.selectedEvent) return {};
      const updatedTickets = [...(state.selectedEvent.ticketTypes || [])];
      updatedTickets.splice(index, 1);
      return {
        selectedEvent: {
          ...state.selectedEvent,
          ticketTypes: updatedTickets,
        },
      };
    }),
}));