import { ApiResponse, Payment } from "@/types";
import { API_ENDPOINTS, apiClient } from "./apiConfig";

export const paymentService = {
  bakongGenerate: async (
    orderId: string,
    amount: number
  ): Promise<ApiResponse<Payment>> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.PAYMENT}/bakong/generate`,
      { orderId, amount }
    );
    return response.data;
  },
  paymentStatus: async(orderId:string):Promise<ApiResponse<Payment>> =>{
    const response = await apiClient.get(`${API_ENDPOINTS.PAYMENT}/status/${orderId}`)
    return response.data
  }
};
