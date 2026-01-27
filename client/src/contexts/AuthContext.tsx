// Authentication Context - Client Component
// Manages user authentication state and provides auth methods

'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { User } from '@/lib/types';
import { hardcodedAuth } from '@/lib/hardcoded-auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const response = await hardcodedAuth.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Only log errors that aren't marked as silent
        if (response.error && !response.silent && typeof response.error === 'string' && !response.error.includes('401') && !response.error.includes('UNAUTHORIZED')) {
          console.error('Auth initialization failed:', response.error);
        }
        setUser(null);
      }
    } catch (error) {
      // Only log unexpected errors, not authentication failures
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('401') && !errorMessage.includes('UNAUTHORIZED')) {
        console.error('Auth initialization failed:', error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await hardcodedAuth.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Redirect based on user role and email
        const userRole = response.data.user.role;
        const userEmail = response.data.user.email;
        
        // Check if it's a company user (has company email)
        const isCompanyUser = userEmail.startsWith('company');
        
        switch (userRole) {
          case 'STUDENT':
            router.push('/dashboard/user');
            break;
          case 'MENTOR':
            // If it's a company email, redirect to company dashboard
            if (isCompanyUser) {
              router.push('/dashboard/company');
            } else {
              router.push('/dashboard/mentor');
            }
            break;
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/');
        }
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Login failed. Please try again.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await hardcodedAuth.signup();
      
      if (response.success) {
        // Don't auto-login after signup, redirect to login
        router.push('/login?message=Account created successfully! Please sign in.');
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Signup failed. Please try again.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await hardcodedAuth.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout on client side even if API call fails
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await hardcodedAuth.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Only log errors that aren't marked as silent
        if (response.error && !response.silent && typeof response.error === 'string' && !response.error.includes('401') && !response.error.includes('UNAUTHORIZED')) {
          console.error('User refresh failed:', response.error);
        }
        setUser(null);
      }
    } catch (error) {
      // Only log unexpected errors, not authentication failures
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('401') && !errorMessage.includes('UNAUTHORIZED')) {
        console.error('User refresh failed:', error);
      }
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}