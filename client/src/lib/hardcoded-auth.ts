// Hardcoded Authentication Service
// Frontend-only authentication with predefined credentials

import { User, UserRole, ApiResponse } from './types';

// Hardcoded credentials as specified
const HARDCODED_CREDENTIALS = {
  // Student/User credentials
  'user1@gmail.com': { password: 'User@12345', role: UserRole.STUDENT },
  'user2@gmail.com': { password: 'User@12345', role: UserRole.STUDENT },
  
  // Mentor credentials
  'mentor1@gmail.com': { password: 'Mentor@12345', role: UserRole.MENTOR },
  'mentor2@gmail.com': { password: 'Mentor@12345', role: UserRole.MENTOR },
  
  // Company credentials (treating as MENTOR role for now)
  'company1@gmail.com': { password: 'Company@12345', role: UserRole.MENTOR },
  'company2@gmail.com': { password: 'Company@12345', role: UserRole.MENTOR },
  
  // Admin credentials
  'admin@gmail.com': { password: 'Admin@12345', role: UserRole.ADMIN },
};

// Storage keys for localStorage
const AUTH_STORAGE_KEY = 'uimp_auth_user';
const AUTH_TOKEN_KEY = 'uimp_auth_token';

export class HardcodedAuthService {
  // Validate credentials against hardcoded list
  private validateCredentials(email: string, password: string): { isValid: boolean; role?: UserRole } {
    const credential = HARDCODED_CREDENTIALS[email as keyof typeof HARDCODED_CREDENTIALS];
    
    if (!credential) {
      return { isValid: false };
    }
    
    if (credential.password !== password) {
      return { isValid: false };
    }
    
    return { isValid: true, role: credential.role };
  }

  // Create user object from email and role
  private createUser(email: string, role: UserRole): User {
    const firstName = this.extractFirstName(email);
    const lastName = this.extractLastName(email, role);
    
    return {
      id: this.generateUserId(email),
      email,
      role,
      firstName,
      lastName,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }

  // Extract first name from email
  private extractFirstName(email: string): string {
    const localPart = email.split('@')[0];
    
    if (!localPart) return 'User';
    
    if (localPart.startsWith('user')) {
      return 'Student';
    } else if (localPart.startsWith('mentor')) {
      return 'Mentor';
    } else if (localPart.startsWith('company')) {
      return 'Company';
    } else if (localPart === 'admin') {
      return 'Admin';
    }
    
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  // Extract last name based on role
  private extractLastName(email: string, role: UserRole): string {
    const localPart = email.split('@')[0];
    
    if (!localPart) return 'User';
    
    if (localPart.startsWith('company')) {
      if (localPart.includes('1')) {
        return 'Corp';
      } else if (localPart.includes('2')) {
        return 'Ltd';
      }
      return 'Inc';
    }
    
    if (localPart.includes('1')) {
      return 'One';
    } else if (localPart.includes('2')) {
      return 'Two';
    }
    
    return role === UserRole.ADMIN ? 'User' : 'User';
  }

  // Generate consistent user ID from email
  private generateUserId(email: string): string {
    return btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  }

  // Store auth data in localStorage
  private storeAuthData(user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, `hardcoded_${user.id}_${Date.now()}`);
  }

  // Clear auth data from localStorage
  private clearAuthData(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  // Get stored user from localStorage
  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!storedUser || !storedToken) {
        return null;
      }
      
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error retrieving stored user:', error);
      this.clearAuthData();
      return null;
    }
  }

  // Login with hardcoded credentials
  async login(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const validation = this.validateCredentials(email, password);
    
    if (!validation.isValid || !validation.role) {
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials and try again.',
      };
    }
    
    const user = this.createUser(email, validation.role);
    this.storeAuthData(user);
    
    return {
      success: true,
      data: { user },
    };
  }

  // Get current user (from localStorage)
  async getCurrentUser(): Promise<ApiResponse<User>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = this.getStoredUser();
    
    if (!user) {
      return {
        success: false,
        error: 'No authenticated user found',
        silent: true,
      };
    }
    
    return {
      success: true,
      data: user,
    };
  }

  // Logout (clear localStorage)
  async logout(): Promise<ApiResponse<void>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.clearAuthData();
    
    return {
      success: true,
    };
  }

  // Signup (not implemented for hardcoded auth)
  async signup(): Promise<ApiResponse<void>> {
    return {
      success: false,
      error: 'Signup is not available in demo mode. Please use the provided test credentials.',
    };
  }
}

// Export singleton instance
export const hardcodedAuth = new HardcodedAuthService();