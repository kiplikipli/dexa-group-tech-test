import apiClient from '@/lib/apiClient';
import type { LoginCredentials, User } from '@/types/auth';

interface LoginResponse {
  accessToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>(
      '/auth/login-admin',
      credentials
    );

    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async refreshToken(): Promise<RefreshResponse> {
    const res = await apiClient.post<RefreshResponse>('/auth/refresh-token');
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
};
