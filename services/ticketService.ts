import axios from "axios";
import { API_ENDPOINTS, apiClient } from "./apiConfig";
import type { Ticket, TicketType, Events, User, Attendee, RedeemTicketResponse } from "../types";

export const ticketService = {
  // 🧾 Get all tickets belonging to a user
  getMyTickets: async (userId: string): Promise<
    { ticket: Ticket; event: Events; ticketType: TicketType; organizer: User }[]
  > => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/user/${userId}`);
    return res.data;
  },

  // 🛒 Purchase tickets
  purchaseTickets: async (
    userId: string,
    eventId: string,
    ticketTypeId: string,
    quantity: number
  ): Promise<Ticket[]> => {
    const payload = { userId, eventId, ticketTypeId, quantity };
    const res = await apiClient.post(`${API_ENDPOINTS.TICKET}/purchase`, payload);
    return res.data;
  },

  // 🎟️ Get all tickets (for admin or event organizer)
  getAllTickets: async (): Promise<Ticket[]> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/all`);
    return res.data;
  },

  // 🔍 Get a ticket by its QR Code
  getTicketByQrCode: async (
    qrCodeValue: string
  ): Promise<{ ticket: Ticket; event: Events; ticketType: TicketType; user: User } | null> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/qrcode/${qrCodeValue}`);
    return res.data;
  },

  // ✅ Redeem ticket (check-in)
  redeemTicket: async (qrCodeValue: string): Promise<RedeemTicketResponse> => {
    const res = await apiClient.put(`${API_ENDPOINTS.TICKET}/redeem/${qrCodeValue}`);
    return res.data;
  },

  // 🔁 Replace ticket (lost ticket, etc.)
  replaceTicket: async (ticketId: string): Promise<{ success: boolean; newTicket: Ticket }> => {
    const res = await apiClient.put(`${API_ENDPOINTS.TICKET}/replace/${ticketId}`);
    return res.data;
  },

  // 👥 Get all attendees for an event
  getAttendeesForEvent: async (eventId: string): Promise<Attendee[]> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/event/${eventId}/attendees`);
    return res.data;
  },
};