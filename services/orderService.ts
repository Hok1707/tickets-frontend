import { Order } from "@/types";
import { API_ENDPOINTS, apiClient } from "./apiConfig";
import { ApiResponse } from "../types";

export const orderService = {
  purchasedOrder: async (orderPayload: any): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(`${API_ENDPOINTS.ORDER}/checkout`, orderPayload);
    return response.data;
  },
  getOrderId: async (orderId:string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.ORDER}/${orderId}`)
    return response.data
  }
};
