import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  shipping_address?: string;
  billing_address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const userData = await apiClient.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      
      // For development/testing: provide a mock user when API is not available
      if (token === 'mock-token') {
        const mockUser: User = {
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
          first_name: 'Test',
          last_name: 'User'
        };
        setUser(mockUser);
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.login(credentials);
      const { token: newToken, user: userData } = response;
      
      setToken(newToken);
      setUser(userData);
      apiClient.setToken(newToken);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await apiClient.signup(userData);
      const { token: newToken, user: newUser } = response;
      
      setToken(newToken);
      setUser(newUser);
      apiClient.setToken(newToken);
      
      return { success: true };
    } catch (error: any) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
