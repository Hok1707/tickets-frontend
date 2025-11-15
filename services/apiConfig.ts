import axios from "axios";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";


// export const API_BASE_URL = "http://localhost:8081/api/v1";
export const API_BASE_URL = "http://157.10.73.192/api/v1";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  USERS: `${API_BASE_URL}/user`,
  USERS_ROLE: `${API_BASE_URL}/user-role`,
  EVENT: `${API_BASE_URL}/events`,
  ORDER: `${API_BASE_URL}/orders`,
  PAYMENT: `${API_BASE_URL}/payments`,
  TICKET: `${API_BASE_URL}/tickets`,
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { logout, refreshToken, setToken } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        const res = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        setToken(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        toast.error("Session expired. Please log in again.");
        logout();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);