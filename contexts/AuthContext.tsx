import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, User, setAuthToken, clearAuthData, setUserData, getUserData, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  preferred_language?: 'ar' | 'en';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have a token
      const token = await getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to get user data from storage first
      const storedUser = await getUserData();
      if (storedUser) {
        setUser(storedUser);
      }

      // Verify token with server and get fresh user data
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        await setUserData(userData);
      } else {
        // Token is invalid, clear auth data
        await clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      await clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store auth data
        await setAuthToken(token);
        await setUserData(userData);
        setUser(userData);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let message = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        message = firstError[0] || message;
      }
      
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        
        // Store auth data
        await setAuthToken(token);
        await setUserData(newUser);
        setUser(newUser);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed. Please try again.' 
        };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let message = 'Registration failed. Please try again.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        message = firstError[0] || message;
      }
      
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Try to logout from server
      try {
        await authAPI.logout();
      } catch (error) {
        // Even if server logout fails, we should clear local data
        console.error('Server logout failed:', error);
      }
      
      // Clear local auth data
      await clearAuthData();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.updateProfile(userData);
      
      if (response.success && response.data) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        await setUserData(updatedUser);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Profile update failed. Please try again.' 
        };
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      let message = 'Profile update failed. Please try again.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string[];
        message = firstError[0] || message;
      }
      
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
