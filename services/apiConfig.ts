import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const API_BASE_URL = 'http://localhost:8081/api/v1';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  USERS: `${API_BASE_URL}/user`,
  USERS_ROLE: `${API_BASE_URL}/user-role`,
  EVENT: `${API_BASE_URL}/events`,
  ORDER: `${API_BASE_URL}/orders`,
  PAYMENT: `${API_BASE_URL}/payments`,
  TICKET: `${API_BASE_URL}/tickets`
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    if (
      response?.status === 401 &&
      response.data?.error === 'Token Expired'
    ) {
      toast.error(response.data.message || 'Your session has expired. Please login again.');

      useAuthStore.getState().logout();

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);