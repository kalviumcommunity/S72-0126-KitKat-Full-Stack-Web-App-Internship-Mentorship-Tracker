// Form Validation Bug Fixes
// Comprehensive validation utilities with edge case handling

import { z } from 'zod';

// Enhanced email validation with common edge cases
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email address is too long') // RFC 5321 limit
  .refine((email) => {
    // Additional validation for common edge cases
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    
    // Local part validation
    if (localPart.length === 0 || localPart.length > 64) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;
    
    // Domain validation
    if (domain.length === 0 || domain.length > 253) return false;
    if (domain.startsWith('-') || domain.endsWith('-')) return false;
    if (!domain.includes('.')) return false;
    
    return true;
  }, 'Please enter a valid email address');

// Enhanced password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password is too long')
  .refine((password) => {
    // Check for at least one lowercase letter
    return /[a-z]/.test(password);
  }, 'Password must contain at least one lowercase letter')
  .refine((password) => {
    // Check for at least one uppercase letter
    return /[A-Z]/.test(password);
  }, 'Password must contain at least one uppercase letter')
  .refine((password) => {
    // Check for at least one number
    return /\d/.test(password);
  }, 'Password must contain at least one number')
  .refine((password) => {
    // Check for at least one special character
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }, 'Password must contain at least one special character')
  .refine((password) => {
    // Check for no common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
    ];
    return !commonPatterns.some(pattern => pattern.test(password));
  }, 'Password contains common patterns and is not secure');

// Name validation with proper handling
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .refine((name) => {
    // Allow letters, spaces, hyphens, and apostrophes
    return /^[a-zA-Z\s\-']+$/.test(name.trim());
  }, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform((name) => {
    // Trim and normalize spaces
    return name.trim().replace(/\s+/g, ' ');
  });

// Company name validation
export const companySchema = z
  .string()
  .min(1, 'Company name is required')
  .max(100, 'Company name is too long')
  .refine((company) => {
    // Allow letters, numbers, spaces, and common business characters
    return /^[a-zA-Z0-9\s\-&.,()]+$/.test(company.trim());
  }, 'Company name contains invalid characters')
  .transform((company) => {
    return company.trim().replace(/\s+/g, ' ');
  });

// Job role validation
export const roleSchema = z
  .string()
  .min(1, 'Job role is required')
  .max(100, 'Job role is too long')
  .refine((role) => {
    // Allow letters, numbers, spaces, and common job title characters
    return /^[a-zA-Z0-9\s\-/()&.]+$/.test(role.trim());
  }, 'Job role contains invalid characters')
  .transform((role) => {
    return role.trim().replace(/\s+/g, ' ');
  });

// URL validation for resumes and links
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      // Only allow https and http protocols
      return ['https:', 'http:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }, 'URL must use HTTP or HTTPS protocol')
  .refine((url) => {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
    ];
    return !suspiciousPatterns.some(pattern => pattern.test(url));
  }, 'URL contains suspicious content');

// Date validation with proper range checking
export const dateSchema = z
  .string()
  .refine((date) => {
    if (!date) return true; // Optional dates
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Please enter a valid date')
  .refine((date) => {
    if (!date) return true;
    const parsedDate = new Date(date);
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    
    // Date should be between now and one year from now
    return parsedDate >= now && parsedDate <= oneYearFromNow;
  }, 'Date must be between today and one year from now');

// File validation for uploads
export const fileSchema = z
  .instanceof(File)
  .refine((file) => {
    // Check file size (5MB limit)
    return file.size <= 5 * 1024 * 1024;
  }, 'File size must be less than 5MB')
  .refine((file) => {
    // Check file type for resumes
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return allowedTypes.includes(file.type);
  }, 'File must be a PDF or Word document');

// Text area validation with length limits
export const textAreaSchema = z
  .string()
  .max(1000, 'Text is too long (maximum 1000 characters)')
  .refine((text) => {
    // Check for potential XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];
    return !xssPatterns.some(pattern => pattern.test(text));
  }, 'Text contains potentially unsafe content')
  .transform((text) => {
    // Trim and normalize whitespace
    return text.trim().replace(/\s+/g, ' ');
  });

// Form validation helper functions
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize form data
export const processFormData = <T>(
  schema: z.ZodSchema<T>,
  data: Record<string, any>
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  // First sanitize string inputs
  const sanitizedData = Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    if (typeof value === 'string') {
      acc[key] = sanitizeInput(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  // Then validate
  return validateForm(schema, sanitizedData);
};

// Common validation schemas for forms
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['STUDENT', 'MENTOR'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const applicationFormSchema = z.object({
  company: companySchema,
  role: roleSchema,
  platform: z.enum(['LINKEDIN', 'COMPANY_WEBSITE', 'REFERRAL', 'JOB_BOARD', 'CAREER_FAIR', 'OTHER'], {
    errorMap: () => ({ message: 'Please select a valid platform' }),
  }),
  status: z.enum(['DRAFT', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  notes: textAreaSchema.optional(),
  deadline: dateSchema.optional(),
  appliedDate: dateSchema.optional(),
});

export const feedbackFormSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID'),
  content: z.string().min(10, 'Feedback must be at least 10 characters long').max(1000, 'Feedback is too long'),
  tags: z.array(z.enum(['RESUME', 'DSA', 'SYSTEM_DESIGN', 'COMMUNICATION'])).min(1, 'Please select at least one tag'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select a valid priority' }),
  }),
});

// Export types for TypeScript
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;