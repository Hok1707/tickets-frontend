import { ApiResponse, Payment,QRpayload,ApiKHQRResponse } from "@/types";
import { API_ENDPOINTS, apiClient } from "./apiConfig";

export const paymentService = {
  generateKHQR: async (
    orderId: string,
    qrPayload: QRpayload
  ): Promise<{
    data: ApiKHQRResponse;  
}> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.PAYMENT}/bakong/qr/${orderId}`,
      qrPayload
    );
    return response;
  },

  paymentStatus: async (orderId: string): Promise<ApiResponse<Payment>> => {
    const { data } = await apiClient.get<ApiResponse<Payment>>(
      `${API_ENDPOINTS.PAYMENT}/status/${orderId}`
    );
    return data;
  },
};
