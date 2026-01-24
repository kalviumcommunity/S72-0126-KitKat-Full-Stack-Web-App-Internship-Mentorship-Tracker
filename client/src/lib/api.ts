// API client functions for UIMP Frontend
// Based on Prisma schema analysis and backend API contracts

import { 
  User, 
  Application, 
  Feedback, 
  Notification, 
  MentorAssignment,
  ApplicationWithFeedback,
  ApplicationWithUser,
  FeedbackWithRelations,
  MentorAssignmentWithUsers,
  StudentDashboardData,
  MentorDashboardData,
  ApiResponse,
  PaginatedResponse,
  AuthResponse,
  ApplicationFilters,
  FeedbackFilters,
  LoginFormData,
  SignupFormData,
  ApplicationFormData,
  FeedbackFormData
} from './types';

// ============================================
// API CONFIGURATION
// ============================================

// Environment variable validation
function validateEnvironment(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is required in production');
    }
    console.warn('NEXT_PUBLIC_API_URL not set, using default localhost URL');
    return 'http://localhost:3001/api';
  }
  
  // Validate URL format
  try {
    new URL(apiUrl);
    return apiUrl;
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_API_URL format: ${apiUrl}`);
  }
}

const API_BASE_URL = validateEnvironment();

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  private async uploadFile(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<ApiResponse<{ url: string }>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // ============================================
  // AUTHENTICATION ENDPOINTS
  // ============================================

  async login(credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupFormData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  // ============================================
  // USER ENDPOINTS
  // ============================================

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return this.request<void>('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async uploadProfileImage(file: File): Promise<ApiResponse<{ url: string }>> {
    return this.uploadFile('/users/profile-image', file);
  }

  // ============================================
  // APPLICATION ENDPOINTS
  // ============================================

  async getApplications(
    filters?: ApplicationFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<ApplicationWithFeedback>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.status?.length) {
        params.append('status', filters.status.join(','));
      }
      if (filters.platform?.length) {
        params.append('platform', filters.platform.join(','));
      }
      if (filters.company) {
        params.append('company', filters.company);
      }
      if (filters.dateRange?.start) {
        params.append('startDate', filters.dateRange.start);
      }
      if (filters.dateRange?.end) {
        params.append('endDate', filters.dateRange.end);
      }
    }

    return this.request<PaginatedResponse<ApplicationWithFeedback>>(
      `/applications?${params.toString()}`
    );
  }

  async getApplication(id: string): Promise<ApiResponse<ApplicationWithFeedback>> {
    return this.request<ApplicationWithFeedback>(`/applications/${id}`);
  }

  async createApplication(applicationData: ApplicationFormData): Promise<ApiResponse<Application>> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplication(
    id: string,
    applicationData: Partial<ApplicationFormData>
  ): Promise<ApiResponse<Application>> {
    return this.request<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  }

  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadResume(applicationId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    return this.uploadFile('/upload/resume', file, { applicationId });
  }

  // ============================================
  // FEEDBACK ENDPOINTS
  // ============================================

  async getFeedback(
    filters?: FeedbackFilters,
    page: number = 1,
    limit: number = 15
  ): Promise<ApiResponse<PaginatedResponse<FeedbackWithRelations>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.tags?.length) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters.priority?.length) {
        params.append('priority', filters.priority.join(','));
      }
      if (filters.mentorId) {
        params.append('mentorId', filters.mentorId);
      }
      if (filters.dateRange?.start) {
        params.append('startDate', filters.dateRange.start);
      }
      if (filters.dateRange?.end) {
        params.append('endDate', filters.dateRange.end);
      }
    }

    return this.request<PaginatedResponse<FeedbackWithRelations>>(
      `/feedback?${params.toString()}`
    );
  }

  async getFeedbackById(id: string): Promise<ApiResponse<FeedbackWithRelations>> {
    return this.request<FeedbackWithRelations>(`/feedback/${id}`);
  }

  async createFeedback(feedbackData: FeedbackFormData): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async updateFeedback(
    id: string,
    feedbackData: Partial<FeedbackFormData>
  ): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>(`/feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteFeedback(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // NOTIFICATION ENDPOINTS
  // ============================================

  async getNotifications(
    page: number = 1,
    limit: number = 50
  ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request<PaginatedResponse<Notification>>(
      `/notifications?${params.toString()}`
    );
  }

  async getUnreadNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request<Notification[]>('/notifications/unread');
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // DASHBOARD ENDPOINTS
  // ============================================

  async getStudentDashboard(): Promise<ApiResponse<StudentDashboardData>> {
    return this.request<StudentDashboardData>('/dashboard/student');
  }

  async getMentorDashboard(): Promise<ApiResponse<MentorDashboardData>> {
    return this.request<MentorDashboardData>('/dashboard/mentor');
  }

  // ============================================
  // MENTOR ASSIGNMENT ENDPOINTS (Admin/Mentor)
  // ============================================

  async getMentorAssignments(): Promise<ApiResponse<MentorAssignmentWithUsers[]>> {
    return this.request<MentorAssignmentWithUsers[]>('/mentor-assignments');
  }

  async getAssignedStudents(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/mentor-assignments/students');
  }

  async getAssignedMentors(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/mentor-assignments/mentors');
  }

  async createMentorAssignment(assignmentData: {
    mentorId: string;
    studentId: string;
  }): Promise<ApiResponse<MentorAssignment>> {
    return this.request<MentorAssignment>('/mentor-assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateMentorAssignment(
    id: string,
    assignmentData: { isActive: boolean }
  ): Promise<ApiResponse<MentorAssignment>> {
    return this.request<MentorAssignment>(`/mentor-assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteMentorAssignment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/mentor-assignments/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    role?: string
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (role) {
      params.append('role', role);
    }

    return this.request<PaginatedResponse<User>>(`/admin/users?${params.toString()}`);
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deactivateUser(userId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${userId}/deactivate`, {
      method: 'PUT',
    });
  }

  async activateUser(userId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${userId}/activate`, {
      method: 'PUT',
    });
  }

  // ============================================
  // SEARCH ENDPOINTS
  // ============================================

  async searchApplications(query: string): Promise<ApiResponse<ApplicationWithUser[]>> {
    const params = new URLSearchParams({ q: query });
    return this.request<ApplicationWithUser[]>(`/search/applications?${params.toString()}`);
  }

  async searchUsers(query: string, role?: string): Promise<ApiResponse<User[]>> {
    const params = new URLSearchParams({ q: query });
    if (role) {
      params.append('role', role);
    }
    return this.request<User[]>(`/search/users?${params.toString()}`);
  }

  // ============================================
  // STATISTICS ENDPOINTS
  // ============================================

  async getApplicationStats(): Promise<ApiResponse<{
    total: number;
    byStatus: Record<string, number>;
    byPlatform: Record<string, number>;
    recentActivity: Array<{ date: string; count: number }>;
  }>> {
    return this.request('/stats/applications');
  }

  async getFeedbackStats(): Promise<ApiResponse<{
    total: number;
    byPriority: Record<string, number>;
    byTag: Record<string, number>;
    averageResponseTime: number;
  }>> {
    return this.request('/stats/feedback');
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const apiClient = new ApiClient();

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export const auth = {
  login: (credentials: LoginFormData) => apiClient.login(credentials),
  signup: (userData: SignupFormData) => apiClient.signup(userData),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  refreshToken: () => apiClient.refreshToken(),
};

export const applications = {
  getAll: (filters?: ApplicationFilters, page?: number, limit?: number) => 
    apiClient.getApplications(filters, page, limit),
  getById: (id: string) => apiClient.getApplication(id),
  create: (data: ApplicationFormData) => apiClient.createApplication(data),
  update: (id: string, data: Partial<ApplicationFormData>) => 
    apiClient.updateApplication(id, data),
  delete: (id: string) => apiClient.deleteApplication(id),
  uploadResume: (applicationId: string, file: File) => 
    apiClient.uploadResume(applicationId, file),
};

export const feedback = {
  getAll: (filters?: FeedbackFilters, page?: number, limit?: number) => 
    apiClient.getFeedback(filters, page, limit),
  getById: (id: string) => apiClient.getFeedbackById(id),
  create: (data: FeedbackFormData) => apiClient.createFeedback(data),
  update: (id: string, data: Partial<FeedbackFormData>) => 
    apiClient.updateFeedback(id, data),
  delete: (id: string) => apiClient.deleteFeedback(id),
};

export const notifications = {
  getAll: (page?: number, limit?: number) => 
    apiClient.getNotifications(page, limit),
  getUnread: () => apiClient.getUnreadNotifications(),
  markAsRead: (id: string) => apiClient.markNotificationAsRead(id),
  markAllAsRead: () => apiClient.markAllNotificationsAsRead(),
  delete: (id: string) => apiClient.deleteNotification(id),
};

export const dashboard = {
  getStudentData: () => apiClient.getStudentDashboard(),
  getMentorData: () => apiClient.getMentorDashboard(),
};

export default apiClient;