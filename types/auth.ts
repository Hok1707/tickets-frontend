import { Role, AccountStatus } from './common';

export interface User {
  id: string | null;
  username: string;
  email: string;
  phoneNumber?: string | null;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User & { roleName?: string; role?: string };
  accessToken: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface ChangePasswordData {
  userId: string;
  currentPassword?: string;
  newPassword: string;
}