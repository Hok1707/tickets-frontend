import axios from "axios";
import { API_ENDPOINTS } from "./apiConfig";
import {
  LoginResponse,
  User,
  RegisterData,
  RegisterResponse,
  ChangePasswordData,
} from "@/types/auth";
import { Role } from "@/types/common";
import { ApiResponse } from "@/types/pagination";

export const normalizeRole = (roleStr?: string | null): Role => {
  if (!roleStr) return Role.USER;
  const upper = roleStr.toUpperCase();
  return Object.values(Role).includes(upper as Role)
    ? (upper as Role)
    : Role.USER;
};

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.LOGIN,
        {
          email,
          password,
        }
      );
      const rawData = response.data.data;
      const accessToken = rawData.accessToken;
      const role = normalizeRole(rawData.user.roleName);
      const user: User = {
        ...rawData.user,
        role,
      };
      return { user, accessToken };
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await axios.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.REGISTER,
        data
      );

      return response.data.data;
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  },

  async changePassword({
    userId,
    currentPassword,
    newPassword,
  }: ChangePasswordData): Promise<{ success: boolean }> {
    try {
      const response = await axios.post<ApiResponse<{ success: boolean }>>(
        `${API_ENDPOINTS.CHANGE_PASSWORD}/${userId}`,
        {
          currentPassword,
          newPassword,
        }
      );

      return response.data.data;
    } catch (error: any) {
      console.error("Password change failed:", error);
      throw new Error(
        error.response?.data?.message || "Unable to change password."
      );
    }
  },
  forgotPassword: async (email: string) => {
    const res = await axios.post(`${API_ENDPOINTS.FORGOT_PASSWORD}`, {
      email,
    });
    return res.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const res = await axios.post(`${API_ENDPOINTS.RESET_PASSWORD}`, {
      token,
      newPassword,
    });
    return res.data;
  },
  verifyEmail: async (verifyToken: string) => {
    const res = await axios.post(`${API_ENDPOINTS.VERIFY_EMAIL}`, {
      verifyToken,
    });
    return res.data;
  },
};
