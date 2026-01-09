// TypeScript type definitions for UIMP Frontend
// Generated from Prisma schema analysis for Day 3 deliverable

// ============================================
// ENUMS (matching Prisma schema)
// ============================================

export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED'
}

export enum ApplicationPlatform {
  LINKEDIN = 'LINKEDIN',
  COMPANY_WEBSITE = 'COMPANY_WEBSITE',
  REFERRAL = 'REFERRAL',
  JOB_BOARD = 'JOB_BOARD',
  CAREER_FAIR = 'CAREER_FAIR',
  OTHER = 'OTHER'
}

export enum FeedbackTag {
  RESUME = 'RESUME',
  DSA = 'DSA',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  COMMUNICATION = 'COMMUNICATION'
}

export enum FeedbackPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum NotificationType {
  FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED',
  APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED',
  MENTOR_ASSIGNED = 'MENTOR_ASSIGNED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

// ============================================
// BASE ENTITY TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Application {
  id: string;
  userId: string;
  company: string;
  role: string;
  platform: ApplicationPlatform;
  status: ApplicationStatus;
  resumeUrl?: string;
  notes?: string;
  deadline?: string;
  appliedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  applicationId: string;
  mentorId: string;
  content: string;
  tags: FeedbackTag[];
  priority: FeedbackPriority;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface MentorAssignment {
  id: string;
  mentorId: string;
  studentId: string;
  isActive: boolean;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// EXTENDED TYPES WITH RELATIONS
// ============================================

export interface ApplicationWithUser extends Application {
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}

export interface ApplicationWithFeedback extends Application {
  feedback: (Feedback & {
    mentor: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  })[];
}

export interface ApplicationWithAll extends Application {
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  feedback: (Feedback & {
    mentor: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  })[];
}

export interface FeedbackWithRelations extends Feedback {
  application: ApplicationWithUser;
  mentor: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}

export interface MentorAssignmentWithUsers extends MentorAssignment {
  mentor: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
  student: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ApplicationFormData {
  company: string;
  role: string;
  platform: ApplicationPlatform;
  status: ApplicationStatus;
  notes?: string;
  deadline?: string;
  appliedDate?: string;
  resumeFile?: File;
}

export interface FeedbackFormData {
  applicationId: string;
  content: string;
  tags: FeedbackTag[];
  priority: FeedbackPriority;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token?: string; // If using JWT tokens
}

// ============================================
// DASHBOARD DATA TYPES
// ============================================

export interface StudentDashboardData {
  user: User;
  applications: {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    recent: ApplicationWithFeedback[];
  };
  feedback: {
    total: number;
    recent: FeedbackWithRelations[];
  };
  mentors: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>[];
}

export interface MentorDashboardData {
  user: User;
  students: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>[];
  applications: {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    recent: ApplicationWithUser[];
  };
  feedback: {
    total: number;
    recent: FeedbackWithRelations[];
  };
}

// ============================================
// FILTER AND SEARCH TYPES
// ============================================

export interface ApplicationFilters {
  status?: ApplicationStatus[];
  platform?: ApplicationPlatform[];
  company?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface FeedbackFilters {
  tags?: FeedbackTag[];
  priority?: FeedbackPriority[];
  mentorId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// ============================================
// UI STATE TYPES
// ============================================

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'create' | 'edit' | 'delete' | 'view';
  data?: any;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Status display configurations
export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, {
  label: string;
  color: 'gray' | 'blue' | 'yellow' | 'green' | 'red';
  description: string;
}> = {
  [ApplicationStatus.DRAFT]: {
    label: 'Draft',
    color: 'gray',
    description: 'Application not yet submitted'
  },
  [ApplicationStatus.APPLIED]: {
    label: 'Applied',
    color: 'blue',
    description: 'Application submitted'
  },
  [ApplicationStatus.SHORTLISTED]: {
    label: 'Shortlisted',
    color: 'yellow',
    description: 'Application shortlisted'
  },
  [ApplicationStatus.INTERVIEW]: {
    label: 'Interview',
    color: 'yellow',
    description: 'Interview scheduled/in progress'
  },
  [ApplicationStatus.OFFER]: {
    label: 'Offer',
    color: 'green',
    description: 'Offer received'
  },
  [ApplicationStatus.REJECTED]: {
    label: 'Rejected',
    color: 'red',
    description: 'Application rejected'
  }
};

export const FEEDBACK_PRIORITY_CONFIG: Record<FeedbackPriority, {
  label: string;
  color: 'green' | 'yellow' | 'red';
}> = {
  [FeedbackPriority.LOW]: {
    label: 'Low Priority',
    color: 'green'
  },
  [FeedbackPriority.MEDIUM]: {
    label: 'Medium Priority',
    color: 'yellow'
  },
  [FeedbackPriority.HIGH]: {
    label: 'High Priority',
    color: 'red'
  }
};

export const FEEDBACK_TAG_CONFIG: Record<FeedbackTag, {
  label: string;
  color: string;
}> = {
  [FeedbackTag.RESUME]: {
    label: 'Resume',
    color: 'blue'
  },
  [FeedbackTag.DSA]: {
    label: 'DSA',
    color: 'purple'
  },
  [FeedbackTag.SYSTEM_DESIGN]: {
    label: 'System Design',
    color: 'indigo'
  },
  [FeedbackTag.COMMUNICATION]: {
    label: 'Communication',
    color: 'green'
  }
};