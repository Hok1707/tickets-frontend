import axios from "axios";
import { API_ENDPOINTS, apiClient } from "./apiConfig";
import { Events } from "@/types/events";
import { PaginatedResponse, ApiResponse } from "@/types/pagination";

export const eventService = {
  getEvents: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Events>> => {
    const res = await axios.get(
      `${API_ENDPOINTS.EVENT}/published?page=${page}&size=${size}`
    );
    return res.data;
  },

  getEventsAdmin: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Events>> => {
    const res = await apiClient.get(
      `${API_ENDPOINTS.EVENT}/all?page=${page}&size=${size}`
    );
    return res.data;
  },

  getEventsByOranizer: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Events>> => {
    const res = await apiClient.get(
      `${API_ENDPOINTS.EVENT}/organizer?page=${page}&size=${size}`
    );
    return res.data;
  },

  getEventById: async (id: string): Promise<ApiResponse<Events>> => {
    const res = await axios.get<ApiResponse<Events>>(
      `${API_ENDPOINTS.EVENT}/published/${id}`
    );
    return res.data;
  },

  createEvent: async (eventData: any): Promise<Events> => {
    const res = await apiClient.post(
      `${API_ENDPOINTS.EVENT}/create`,
      eventData
    );
    return res.data;
  },

  updateEvent: async (eventData: any): Promise<Events> => {
    const res = await apiClient.put(
      `${API_ENDPOINTS.EVENT}/${eventData.id}`,
      eventData
    );
    return res.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.EVENT}/${id}`);
  },

  cancelEvent: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.put(`${API_ENDPOINTS.EVENT}/${id}/cancel`);
    return res.data;
  },
};
