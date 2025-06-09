// stores/useAuthStore.ts
import { create } from 'zustand';
import type { User } from '../types/auth';
import { authService } from '@/services/authService';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  hasLoggedOut: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasLoggedOut: false,
      setToken: (token) => set({ token, hasLoggedOut: false }),
      setUser: (user) => set({ user }),
      logout: async () => {
        try {
          await authService.logout();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          set({ token: null, user: null, hasLoggedOut: true });
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ hasLoggedOut: state.hasLoggedOut }), // only persist hasLoggedOut
    }
  )
);
