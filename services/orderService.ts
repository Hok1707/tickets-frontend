import { Order } from "@/types/orders";
import { ApiResponse } from "@/types/pagination";
import { API_ENDPOINTS, apiClient } from "./apiConfig";

export const orderService = {
  purchasedOrder: async (orderPayload: any): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ORDER}/checkout`,
      orderPayload
    );
    return response.data;
  },
  getOrderId: async (orderId: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`${API_ENDPOINTS.ORDER}/${orderId}`);
    return response.data;
  },

  // getAllOrders: async ( page: number, size: number): Promise<ApiResponse<{items: OrderPageResponse[]; totalPages: number; totalItems: number; currentPage: number;}>> => {
  //   const response = await apiClient.get(
  //     `${API_ENDPOINTS.ORDER}/all`,{
  //       params: {
  //         page,
  //         size
  //       }
  //     }
  //   );
  //   return response.data;
  // }

};
