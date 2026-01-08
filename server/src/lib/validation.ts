import { z } from "zod";

// Common validation patterns
export const commonSchemas = {
  // UUID validation
  uuid: z.string().uuid("Invalid UUID format"),
  
  // Email validation
  email: z.string().email("Invalid email format").toLowerCase(),
  
  // Password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
  // Simple password (for development/testing)
  simplePassword: z.string().min(8, "Password must be at least 8 characters"),
  
  // Name validation
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  // Phone number validation
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  
  // URL validation
  url: z.string().url("Invalid URL format"),
  
  // Date validation
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
  
  // Search query
  search: z.object({
    q: z.string().min(1).max(100).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
};

// User role validation
export const userRoleSchema = z.enum(["STUDENT", "MENTOR", "ADMIN"]);

// Application status validation
export const applicationStatusSchema = z.enum([
  "DRAFT",
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

// Application platform validation
export const applicationPlatformSchema = z.enum([
  "LINKEDIN",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "JOB_BOARD",
  "CAREER_FAIR",
  "OTHER",
]);

// Feedback tags validation
export const feedbackTagSchema = z.enum([
  "RESUME",
  "DSA",
  "SYSTEM_DESIGN",
  "COMMUNICATION",
  "INTERVIEW_PREP",
  "GENERAL",
]);

// Feedback priority validation
export const feedbackPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Notification type validation
export const notificationTypeSchema = z.enum([
  "FEEDBACK_RECEIVED",
  "APPLICATION_STATUS_CHANGED",
  "MENTOR_ASSIGNED",
  "SYSTEM_ANNOUNCEMENT",
]);

// Authentication schemas
export const authSchemas = {
  signup: z.object({
    email: commonSchemas.email,
    password: commonSchemas.simplePassword, // Use simple password for MVP
    role: userRoleSchema,
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
  }),
  
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),
  
  changePassword: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: commonSchemas.simplePassword,
  }),
  
  resetPassword: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: commonSchemas.simplePassword,
  }),
  
  forgotPassword: z.object({
    email: commonSchemas.email,
  }),
};

// User schemas
export const userSchemas = {
  updateProfile: z.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    phone: commonSchemas.phone,
  }),
  
  getUserById: z.object({
    id: commonSchemas.uuid,
  }),
  
  listUsers: z.object({
    ...commonSchemas.pagination.shape,
    role: userRoleSchema.optional(),
    search: z.string().optional(),
  }),
};

// Application schemas
export const applicationSchemas = {
  create: z.object({
    company: z.string().min(1, "Company name is required").max(255),
    role: z.string().min(1, "Role is required").max(255),
    platform: applicationPlatformSchema,
    status: applicationStatusSchema.default("DRAFT"),
    resumeUrl: commonSchemas.url.optional(),
    notes: z.string().max(2000).optional(),
    deadline: commonSchemas.dateString.optional(),
    appliedDate: commonSchemas.dateString.optional(),
  }),
  
  update: z.object({
    company: z.string().min(1).max(255).optional(),
    role: z.string().min(1).max(255).optional(),
    platform: applicationPlatformSchema.optional(),
    status: applicationStatusSchema.optional(),
    resumeUrl: commonSchemas.url.optional(),
    notes: z.string().max(2000).optional(),
    deadline: commonSchemas.dateString.optional(),
    appliedDate: commonSchemas.dateString.optional(),
  }),
  
  getById: z.object({
    id: commonSchemas.uuid,
  }),
  
  list: z.object({
    ...commonSchemas.pagination.shape,
    status: applicationStatusSchema.optional(),
    company: z.string().optional(),
    platform: applicationPlatformSchema.optional(),
    search: z.string().optional(),
  }),
  
  delete: z.object({
    id: commonSchemas.uuid,
  }),
};

// Feedback schemas
export const feedbackSchemas = {
  create: z.object({
    applicationId: commonSchemas.uuid,
    content: z.string().min(1, "Feedback content is required").max(2000),
    tags: z.array(feedbackTagSchema).min(1, "At least one tag is required"),
    priority: feedbackPrioritySchema,
  }),
  
  update: z.object({
    content: z.string().min(1).max(2000).optional(),
    tags: z.array(feedbackTagSchema).min(1).optional(),
    priority: feedbackPrioritySchema.optional(),
    isRead: z.boolean().optional(),
  }),
  
  getById: z.object({
    id: commonSchemas.uuid,
  }),
  
  list: z.object({
    ...commonSchemas.pagination.shape,
    applicationId: commonSchemas.uuid.optional(),
    mentorId: commonSchemas.uuid.optional(),
    priority: feedbackPrioritySchema.optional(),
    tags: z.array(feedbackTagSchema).optional(),
    isRead: z.boolean().optional(),
  }),
  
  delete: z.object({
    id: commonSchemas.uuid,
  }),
  
  markAsRead: z.object({
    id: commonSchemas.uuid,
  }),
};

// Notification schemas
export const notificationSchemas = {
  create: z.object({
    userId: commonSchemas.uuid,
    type: notificationTypeSchema,
    title: z.string().min(1).max(255),
    message: z.string().min(1).max(1000),
    expiresAt: z.string().datetime().optional(),
  }),
  
  list: z.object({
    ...commonSchemas.pagination.shape,
    type: notificationTypeSchema.optional(),
    read: z.boolean().optional(),
  }),
  
  markAsRead: z.object({
    id: commonSchemas.uuid,
  }),
  
  delete: z.object({
    id: commonSchemas.uuid,
  }),
};

// Upload schemas
export const uploadSchemas = {
  resume: z.object({
    file: z.object({
      mimetype: z.literal("application/pdf"),
      size: z.number().max(5 * 1024 * 1024), // 5MB
    }),
  }),
};

// Mentor assignment schemas
export const mentorAssignmentSchemas = {
  assign: z.object({
    mentorId: commonSchemas.uuid,
    studentId: commonSchemas.uuid,
  }),
  
  unassign: z.object({
    mentorId: commonSchemas.uuid,
    studentId: commonSchemas.uuid,
  }),
  
  list: z.object({
    ...commonSchemas.pagination.shape,
    mentorId: commonSchemas.uuid.optional(),
    studentId: commonSchemas.uuid.optional(),
    isActive: z.boolean().optional(),
  }),
};

// Export all schemas for easy access
export const schemas = {
  common: commonSchemas,
  auth: authSchemas,
  user: userSchemas,
  application: applicationSchemas,
  feedback: feedbackSchemas,
  notification: notificationSchemas,
  upload: uploadSchemas,
  mentorAssignment: mentorAssignmentSchemas,
};

// Type inference helpers
export type SignupInput = z.infer<typeof authSchemas.signup>;
export type LoginInput = z.infer<typeof authSchemas.login>;
export type CreateApplicationInput = z.infer<typeof applicationSchemas.create>;
export type UpdateApplicationInput = z.infer<typeof applicationSchemas.update>;
export type CreateFeedbackInput = z.infer<typeof feedbackSchemas.create>;
export type UpdateFeedbackInput = z.infer<typeof feedbackSchemas.update>;
export type PaginationInput = z.infer<typeof commonSchemas.pagination>;