
import { ApiKHQRResponse, BakongCheckTxnResponse, BakongUpdateOrderStatusPayload } from "@/types/bakong";
import { QRpayload } from "@/types/orders";
import { API_ENDPOINTS, apiClient } from "./apiConfig";
import axios from "axios";

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

  checkTxnByMd5: async (md5: string): Promise<BakongCheckTxnResponse> => {
    const res = await axios.post(`${API_ENDPOINTS.PAYMENT}/bakong/check-md5`, {
      md5,
    });
    return res.data;
  },
  updateOrderStatus: async (orderId: string, updatePayload: BakongUpdateOrderStatusPayload): Promise<string> => {
    const res = await apiClient.put<{ message: string }>(
      `${API_ENDPOINTS.ORDER}/${orderId}/status`,
      updatePayload
    );
    return res.data.message;
  },
};
