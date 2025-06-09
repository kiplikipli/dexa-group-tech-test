// lib/apiClient.ts
import axios from '@/lib/axiosClient';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@/services/authService';

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

axios.interceptors.request.use(
  (config) => {
    // Skip adding auth header for login/auth endpoints
    if (config.url?.includes('/login')) {
      return config;
    }

    // Get token from Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async (response) => {
    // Handle different response structures
    if (response.data?.data !== undefined) {
      return response.data;
    }
    return response.data.data; // Fallback for responses without nested data
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for login/auth endpoints
      if (
        originalRequest.url?.includes('/login') ||
        originalRequest.url?.includes('/auth')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push(() => {
            const token = useAuthStore.getState().token;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await authService.refreshToken();
        authStore.setToken(accessToken);

        failedQueue.forEach((cb) => cb());
        failedQueue = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        await authStore.logout();
        failedQueue = []; // Clear the queue on refresh failure
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
