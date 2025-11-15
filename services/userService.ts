import { User } from '@/types/auth';
import { Role, AccountStatus } from '@/types/common';
import { API_ENDPOINTS, apiClient } from './apiConfig';
import { normalizeUser } from '@/utils/ApiUserResponse';

export const userService = {

  getUsers: async (): Promise<User[]> => {
    try {
    const response = await apiClient.get<{ data: User[] }>(`${API_ENDPOINTS.USERS}/list-all`);     
      return response.data.data.map((u: any) => normalizeUser(u));
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch users');
    }
  },

  updateUserRole: async (userId: string, newRole: Role): Promise<User> => {
    try {
      const response = await apiClient.put<{ data: User }>(
        `${API_ENDPOINTS.USERS_ROLE}/update-role/${userId}`,
        { newRoleName: newRole }
      );
      return normalizeUser(response.data.data);
    } catch (error: any) {
      console.error('Failed to update user role:', error);
      throw new Error(error?.response?.data?.message || 'Failed to update user role');
    }
  },


  updateUserProfile: async (
    userId: string,
    updates: Partial<{ username: string; phoneNumber: string }>
  ): Promise<User> => {
    try {
      const response = await apiClient.put<{ data: User }>(
        `${API_ENDPOINTS.USERS}/update/${userId}`,
        updates
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to update user profile:', error);
      throw new Error(error?.response?.data?.message || 'Failed to update user profile');
    }
  },


  updateUserStatus: async (userId: string, newStatus: AccountStatus): Promise<User> => {
    try {
      const response = await apiClient.put<{ data: User }>(
        `${API_ENDPOINTS.USERS}/update-status/${userId}`,
        { status: newStatus }
      );
      return normalizeUser(response.data.data);
    } catch (error: any) {
      console.error('Failed to update user status:', error);
      throw new Error(error?.response?.data?.message || 'Failed to update user status');
    }
  },
};