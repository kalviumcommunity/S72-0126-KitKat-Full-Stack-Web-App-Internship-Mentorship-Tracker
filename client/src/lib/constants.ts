// Application constants for UIMP Frontend
// Based on Prisma schema analysis and business requirements

import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';

// ============================================
// APPLICATION CONSTANTS
// ============================================

export const APPLICATION_STATUS_OPTIONS = [
  { value: ApplicationStatus.DRAFT, label: 'Draft' },
  { value: ApplicationStatus.APPLIED, label: 'Applied' },
  { value: ApplicationStatus.SHORTLISTED, label: 'Shortlisted' },
  { value: ApplicationStatus.INTERVIEW, label: 'Interview' },
  { value: ApplicationStatus.OFFER, label: 'Offer' },
  { value: ApplicationStatus.REJECTED, label: 'Rejected' },
];

export const APPLICATION_PLATFORM_OPTIONS = [
  { value: ApplicationPlatform.LINKEDIN, label: 'LinkedIn' },
  { value: ApplicationPlatform.COMPANY_WEBSITE, label: 'Company Website' },
  { value: ApplicationPlatform.REFERRAL, label: 'Referral' },
  { value: ApplicationPlatform.JOB_BOARD, label: 'Job Board' },
  { value: ApplicationPlatform.CAREER_FAIR, label: 'Career Fair' },
  { value: ApplicationPlatform.OTHER, label: 'Other' },
];

export const FEEDBACK_TAG_OPTIONS = [
  { value: FeedbackTag.RESUME, label: 'Resume' },
  { value: FeedbackTag.DSA, label: 'DSA' },
  { value: FeedbackTag.SYSTEM_DESIGN, label: 'System Design' },
  { value: FeedbackTag.COMMUNICATION, label: 'Communication' },
];

export const FEEDBACK_PRIORITY_OPTIONS = [
  { value: FeedbackPriority.LOW, label: 'Low Priority' },
  { value: FeedbackPriority.MEDIUM, label: 'Medium Priority' },
  { value: FeedbackPriority.HIGH, label: 'High Priority' },
];

export const USER_ROLE_OPTIONS = [
  { value: UserRole.STUDENT, label: 'Student' },
  { value: UserRole.MENTOR, label: 'Mentor' },
  { value: UserRole.ADMIN, label: 'Admin' },
];

// ============================================
// UI CONFIGURATION
// ============================================

export const PAGINATION_LIMITS = {
  APPLICATIONS: 20,
  FEEDBACK: 15,
  NOTIFICATIONS: 50,
  USERS: 20,
} as const;

export const FILE_UPLOAD_LIMITS = {
  RESUME: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
  },
  PROFILE_IMAGE: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  },
} as const;

export const FORM_VALIDATION_LIMITS = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  COMPANY_MIN_LENGTH: 2,
  COMPANY_MAX_LENGTH: 100,
  ROLE_MIN_LENGTH: 2,
  ROLE_MAX_LENGTH: 100,
  NOTES_MAX_LENGTH: 1000,
  FEEDBACK_MIN_LENGTH: 10,
  FEEDBACK_MAX_LENGTH: 2000,
  FILENAME_MAX_LENGTH: 100,
} as const;

// ============================================
// STATUS CONFIGURATIONS
// ============================================

export const STATUS_COLORS = {
  [ApplicationStatus.DRAFT]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    dot: 'bg-gray-400',
  },
  [ApplicationStatus.APPLIED]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    dot: 'bg-blue-400',
  },
  [ApplicationStatus.SHORTLISTED]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    dot: 'bg-yellow-400',
  },
  [ApplicationStatus.INTERVIEW]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    dot: 'bg-purple-400',
  },
  [ApplicationStatus.OFFER]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    dot: 'bg-green-400',
  },
  [ApplicationStatus.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot: 'bg-red-400',
  },
} as const;

export const PRIORITY_COLORS = {
  [FeedbackPriority.LOW]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    dot: 'bg-green-400',
  },
  [FeedbackPriority.MEDIUM]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    dot: 'bg-yellow-400',
  },
  [FeedbackPriority.HIGH]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot: 'bg-red-400',
  },
} as const;

export const TAG_COLORS = {
  [FeedbackTag.RESUME]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  [FeedbackTag.DSA]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
  },
  [FeedbackTag.SYSTEM_DESIGN]: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
  },
  [FeedbackTag.COMMUNICATION]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
} as const;

// ============================================
// NOTIFICATION CONFIGURATIONS
// ============================================

export const NOTIFICATION_ICONS = {
  [NotificationType.FEEDBACK_RECEIVED]: '💬',
  [NotificationType.APPLICATION_STATUS_CHANGED]: '📋',
  [NotificationType.MENTOR_ASSIGNED]: '👨‍🏫',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: '📢',
} as const;

export const NOTIFICATION_COLORS = {
  [NotificationType.FEEDBACK_RECEIVED]: 'text-blue-600',
  [NotificationType.APPLICATION_STATUS_CHANGED]: 'text-green-600',
  [NotificationType.MENTOR_ASSIGNED]: 'text-purple-600',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'text-orange-600',
} as const;

// ============================================
// ROUTE CONFIGURATIONS
// ============================================

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  STUDENT_DASHBOARD: '/student',
  STUDENT_APPLICATIONS: '/student/applications',
  STUDENT_APPLICATIONS_NEW: '/student/applications/new',
  STUDENT_APPLICATIONS_EDIT: (id: string) => `/student/applications/${id}/edit`,
  STUDENT_APPLICATIONS_VIEW: (id: string) => `/student/applications/${id}`,
  STUDENT_FEEDBACK: '/student/feedback',
  MENTOR_DASHBOARD: '/mentor',
  MENTOR_STUDENTS: '/mentor/students',
  MENTOR_FEEDBACK: '/mentor/feedback',
  MENTOR_FEEDBACK_NEW: '/mentor/feedback/new',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ASSIGNMENTS: '/admin/assignments',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
] as const;

export const PROTECTED_ROUTES = {
  STUDENT: [
    ROUTES.STUDENT_DASHBOARD,
    ROUTES.STUDENT_APPLICATIONS,
    ROUTES.STUDENT_APPLICATIONS_NEW,
    ROUTES.STUDENT_FEEDBACK,
  ],
  MENTOR: [
    ROUTES.MENTOR_DASHBOARD,
    ROUTES.MENTOR_STUDENTS,
    ROUTES.MENTOR_FEEDBACK,
    ROUTES.MENTOR_FEEDBACK_NEW,
  ],
  ADMIN: [
    ROUTES.ADMIN_DASHBOARD,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_ASSIGNMENTS,
  ],
  ALL: [
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
  ],
} as const;

// ============================================
// API CONFIGURATION
// ============================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  APPLICATIONS: {
    BASE: '/applications',
    BY_ID: (id: string) => `/applications/${id}`,
    SEARCH: '/search/applications',
    STATS: '/stats/applications',
  },
  FEEDBACK: {
    BASE: '/feedback',
    BY_ID: (id: string) => `/feedback/${id}`,
    STATS: '/stats/feedback',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD: '/notifications/unread',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
  UPLOAD: {
    RESUME: '/upload/resume',
    PROFILE_IMAGE: '/users/profile-image',
  },
  DASHBOARD: {
    STUDENT: '/dashboard/student',
    MENTOR: '/dashboard/mentor',
  },
} as const;

// ============================================
// CACHE CONFIGURATIONS
// ============================================

export const CACHE_KEYS = {
  USER: 'user',
  APPLICATIONS: 'applications',
  FEEDBACK: 'feedback',
  NOTIFICATIONS: 'notifications',
  DASHBOARD_STUDENT: 'dashboard-student',
  DASHBOARD_MENTOR: 'dashboard-mentor',
  MENTORS: 'mentors',
  STUDENTS: 'students',
} as const;

export const CACHE_TIMES = {
  USER_PROFILE: 60 * 60 * 1000, // 1 hour
  APPLICATIONS: 5 * 60 * 1000, // 5 minutes
  FEEDBACK: 2 * 60 * 1000, // 2 minutes
  DASHBOARD: 10 * 60 * 1000, // 10 minutes
  STATIC_DATA: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// ============================================
// UI CONSTANTS
// ============================================

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  APPLICATION_CREATED: 'Application created successfully!',
  APPLICATION_UPDATED: 'Application updated successfully!',
  APPLICATION_DELETED: 'Application deleted successfully!',
  FEEDBACK_CREATED: 'Feedback submitted successfully!',
  FEEDBACK_UPDATED: 'Feedback updated successfully!',
  FEEDBACK_DELETED: 'Feedback deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  NOTIFICATION_READ: 'Notification marked as read!',
} as const;

// ============================================
// REGEX PATTERNS
// ============================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: 'yyyy-MM-ddTHH:mm',
  ISO: 'yyyy-MM-ddTHH:mm:ss.SSSXXX',
} as const;

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURE_FLAGS = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_REAL_TIME: true,
  ENABLE_DARK_MODE: false,
  ENABLE_ANALYTICS: false,
} as const;
