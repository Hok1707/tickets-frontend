import { API_ENDPOINTS, apiClient } from "./apiConfig";
import type { Ticket, TicketType, Events, User, Attendee, RedeemTicketResponse, TicketUserResponse, PaginatedResponse } from "../types";

export const ticketService = {
  getMyTickets: async (userId: string): Promise<TicketUserResponse[]> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/user/${userId}`);
    return res.data.data;
  },

  purchaseTickets: async (
    orderId: string,
    purchaserId: string,
  ): Promise<Ticket[]> => {
    const payload = { orderId, purchaserId };
    const res = await apiClient.post(`${API_ENDPOINTS.TICKET}/purchase`, payload);
    return res.data;
  },

  getAllTickets: async (): Promise<PaginatedResponse<Ticket[]>> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/all`);
    return res.data.data;
  },

  getTicketByQrCode: async (
    qrCodeValue: string
  ): Promise<{ ticket: Ticket; event: Events; ticketType: TicketType; user: User } | null> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/qrcode/${qrCodeValue}`);
    return res.data;
  },

  redeemTicket: async (qrCodeValue: string): Promise<RedeemTicketResponse> => {
    const res = await apiClient.put(`${API_ENDPOINTS.TICKET}/redeem/${qrCodeValue}`);
    return res.data;
  },

  replaceTicket: async (ticketId: string): Promise<{ success: boolean; newTicket: Ticket }> => {
    const res = await apiClient.put(`${API_ENDPOINTS.TICKET}/replace/${ticketId}`);
    return res.data;
  },

  getAttendeesForEvent: async (orderId: string): Promise<Attendee[]> => {
    const res = await apiClient.get(`${API_ENDPOINTS.TICKET}/event/${orderId}/attendees`);
    return res.data;
  },
};