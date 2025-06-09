import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/useAuthStore';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasLoggedOut = useAuthStore((state) => state.hasLoggedOut);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't try to refresh token if user has explicitly logged out
    if (!token && !hasLoggedOut) {
      initializeAuth();
    } else if (hasLoggedOut) {
      setLoading(false); // Set loading to false if user has logged out
    }
  }, [token, hasLoggedOut]);

  const initializeAuth = async () => {
    try {
      const { accessToken: newToken } = await authService.refreshToken(); // sets cookie
      setToken(newToken);

      const me = await authService.getMe();
      setUser(me);
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const { accessToken } = await authService.login(credentials);
    setToken(accessToken);

    const me = await authService.getMe();
    setUser(me);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
