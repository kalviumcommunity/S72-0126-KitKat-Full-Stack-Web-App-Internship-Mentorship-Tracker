// Form validation schemas using Zod
// Based on Prisma schema analysis for frontend data requirements

import { z } from 'zod';
import { 
  UserRole, 
  ApplicationStatus, 
  ApplicationPlatform, 
  FeedbackTag, 
  FeedbackPriority 
} from './types';

// ============================================
// AUTHENTICATION SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Please select a valid role' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// ============================================
// APPLICATION SCHEMAS
// ============================================

export const applicationSchema = z.object({
  company: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .trim(),
  role: z
    .string()
    .min(1, 'Role title is required')
    .min(2, 'Role title must be at least 2 characters')
    .max(100, 'Role title must be less than 100 characters')
    .trim(),
  platform: z.nativeEnum(ApplicationPlatform, {
    errorMap: () => ({ message: 'Please select a valid platform' })
  }),
  status: z.nativeEnum(ApplicationStatus, {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  deadline: z
    .string()
    .datetime('Please enter a valid date and time')
    .optional()
    .or(z.literal('')),
  appliedDate: z
    .string()
    .datetime('Please enter a valid date and time')
    .optional()
    .or(z.literal(''))
}).refine((data) => {
  // If both deadline and appliedDate are provided, deadline should be after appliedDate
  if (data.deadline && data.appliedDate) {
    return new Date(data.deadline) >= new Date(data.appliedDate);
  }
  return true;
}, {
  message: "Deadline must be after the applied date",
  path: ["deadline"]
}).refine((data) => {
  // Applied date should not be in the future
  if (data.appliedDate) {
    return new Date(data.appliedDate) <= new Date();
  }
  return true;
}, {
  message: "Applied date cannot be in the future",
  path: ["appliedDate"]
});

// ============================================
// FEEDBACK SCHEMAS
// ============================================

export const feedbackSchema = z.object({
  applicationId: z
    .string()
    .min(1, 'Application ID is required')
    .uuid('Invalid application ID'),
  content: z
    .string()
    .min(1, 'Feedback content is required')
    .min(10, 'Feedback must be at least 10 characters')
    .max(2000, 'Feedback must be less than 2000 characters')
    .trim(),
  tags: z
    .array(z.nativeEnum(FeedbackTag))
    .min(1, 'Please select at least one skill tag')
    .max(4, 'Maximum 4 tags allowed'),
  priority: z.nativeEnum(FeedbackPriority, {
    errorMap: () => ({ message: 'Please select a valid priority level' })
  })
});

// ============================================
// FILE UPLOAD SCHEMAS
// ============================================

export const resumeUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select a file' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      'File size must be less than 5MB'
    )
    .refine(
      (file) => [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type),
      'Only PDF and DOC files are allowed'
    )
    .refine(
      (file) => file.name.length <= 100,
      'File name must be less than 100 characters'
    )
});

export const profileImageUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select an image' })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024, // 2MB
      'Image size must be less than 2MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    )
});

// ============================================
// PROFILE UPDATE SCHEMAS
// ============================================

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
});

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmNewPassword: z
    .string()
    .min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

// ============================================
// SEARCH AND FILTER SCHEMAS
// ============================================

export const applicationFilterSchema = z.object({
  status: z.array(z.nativeEnum(ApplicationStatus)).optional(),
  platform: z.array(z.nativeEnum(ApplicationPlatform)).optional(),
  company: z.string().max(100).optional(),
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional()
  }).optional()
}).refine((data) => {
  // If date range is provided, start should be before end
  if (data.dateRange?.start && data.dateRange?.end) {
    return new Date(data.dateRange.start) <= new Date(data.dateRange.end);
  }
  return true;
}, {
  message: "Start date must be before end date",
  path: ["dateRange"]
});

export const feedbackFilterSchema = z.object({
  tags: z.array(z.nativeEnum(FeedbackTag)).optional(),
  priority: z.array(z.nativeEnum(FeedbackPriority)).optional(),
  mentorId: z.string().uuid().optional(),
  dateRange: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional()
  }).optional()
}).refine((data) => {
  // If date range is provided, start should be before end
  if (data.dateRange?.start && data.dateRange?.end) {
    return new Date(data.dateRange.start) <= new Date(data.dateRange.end);
  }
  return true;
}, {
  message: "Start date must be before end date",
  path: ["dateRange"]
});

// ============================================
// PAGINATION SCHEMA
// ============================================

export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20)
});

// ============================================
// NOTIFICATION SCHEMAS
// ============================================

export const notificationUpdateSchema = z.object({
  read: z.boolean()
});

// ============================================
// MENTOR ASSIGNMENT SCHEMA (Admin only)
// ============================================

export const mentorAssignmentSchema = z.object({
  mentorId: z
    .string()
    .min(1, 'Mentor is required')
    .uuid('Invalid mentor ID'),
  studentId: z
    .string()
    .min(1, 'Student is required')
    .uuid('Invalid student ID')
}).refine((data) => data.mentorId !== data.studentId, {
  message: "Mentor and student cannot be the same person",
  path: ["studentId"]
});

// ============================================
// TYPE EXPORTS FOR FORM DATA
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type ApplicationFilterData = z.infer<typeof applicationFilterSchema>;
export type FeedbackFilterData = z.infer<typeof feedbackFilterSchema>;
export type MentorAssignmentFormData = z.infer<typeof mentorAssignmentSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).safeParse(password).success;
};

export const validateUUID = (id: string): boolean => {
  return z.string().uuid().safeParse(id).success;
};

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// ============================================
// ERROR MESSAGE HELPERS
// ============================================

export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
};

export const formatValidationError = (error: z.ZodError): string => {
  return error.errors.map(err => err.message).join(', ');
};