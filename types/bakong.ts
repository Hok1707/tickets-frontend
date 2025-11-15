export interface KHQRResponse {
  qr: string;
  md5: string;
}

export interface ApiKHQRResponse {
  data: KHQRResponse;
}

export interface BakongTransactionData {
  hash: string;
  fromAccountId?: string;
  amount: number;
  description?: string;
  currency: string;
  toAccountId: string;
  createdDateMs?: number;
  acknowledgedDateMs?: number;
}

export interface BakongCheckTxnResponse {
  responseCode: number;
  responseMessage: string;
  status: string;
  errorCode?: number;
  data: BakongTransactionData | null;
}

export interface BakongUpdateOrderStatusPayload {
  status: string;
  md5Hash: string;
}