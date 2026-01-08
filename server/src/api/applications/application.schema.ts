// Enhanced application validation schemas with comprehensive security
import { z } from "zod";
import { commonSchemas, applicationStatusSchema, applicationPlatformSchema } from "../../lib/validation";

// Company name validation with security checks
const companyNameSchema = z
  .string()
  .min(1, "Company name is required")
  .max(255, "Company name must be less than 255 characters")
  .regex(/^[a-zA-Z0-9\s\-&.,()]+$/, "Company name contains invalid characters")
  .transform(str => str.trim());

// Role validation with security checks
const roleSchema = z
  .string()
  .min(1, "Role is required")
  .max(255, "Role must be less than 255 characters")
  .regex(/^[a-zA-Z0-9\s\-&.,()\/]+$/, "Role contains invalid characters")
  .transform(str => str.trim());

// Notes validation with XSS protection
const notesSchema = z
  .string()
  .max(2000, "Notes must be less than 2000 characters")
  .regex(/^[^<>]*$/, "Notes cannot contain HTML tags")
  .transform(str => str.trim())
  .optional();

// URL validation for resume
const resumeUrlSchema = z
  .string()
  .url("Invalid URL format")
  .max(500, "URL too long")
  .regex(/^https?:\/\//, "URL must use HTTP or HTTPS protocol")
  .optional();

// Date validation with reasonable bounds
const dateSchema = z
  .string()
  .datetime("Invalid date format")
  .refine(
    (date) => {
      const d = new Date(date);
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const twoYearsFromNow = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());
      return d >= oneYearAgo && d <= twoYearsFromNow;
    },
    "Date must be within reasonable range (1 year ago to 2 years from now)"
  )
  .optional();

// Create application schema
export const createApplicationSchema = z.object({
  company: companyNameSchema,
  role: roleSchema,
  platform: applicationPlatformSchema,
  status: applicationStatusSchema.default("DRAFT"),
  resumeUrl: resumeUrlSchema,
  notes: notesSchema,
  deadline: dateSchema,
  appliedDate: dateSchema,
}).refine(
  (data) => {
    // Ensure applied date is not in the future if status is not DRAFT
    if (data.status !== "DRAFT" && data.appliedDate) {
      return new Date(data.appliedDate) <= new Date();
    }
    return true;
  },
  {
    message: "Applied date cannot be in the future for non-draft applications",
    path: ["appliedDate"],
  }
).refine(
  (data) => {
    // Ensure deadline is after applied date if both are provided
    if (data.appliedDate && data.deadline) {
      return new Date(data.deadline) >= new Date(data.appliedDate);
    }
    return true;
  },
  {
    message: "Deadline must be after applied date",
    path: ["deadline"],
  }
);

// Update application schema (all fields optional)
export const updateApplicationSchema = z.object({
  company: companyNameSchema.optional(),
  role: roleSchema.optional(),
  platform: applicationPlatformSchema.optional(),
  status: applicationStatusSchema.optional(),
  resumeUrl: resumeUrlSchema,
  notes: notesSchema,
  deadline: dateSchema,
  appliedDate: dateSchema,
}).refine(
  (data) => {
    // Same business rules as create
    if (data.status && data.status !== "DRAFT" && data.appliedDate) {
      return new Date(data.appliedDate) <= new Date();
    }
    return true;
  },
  {
    message: "Applied date cannot be in the future for non-draft applications",
    path: ["appliedDate"],
  }
).refine(
  (data) => {
    if (data.appliedDate && data.deadline) {
      return new Date(data.deadline) >= new Date(data.appliedDate);
    }
    return true;
  },
  {
    message: "Deadline must be after applied date",
    path: ["deadline"],
  }
);

// List applications query schema
export const listApplicationsSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: applicationStatusSchema.optional(),
  platform: applicationPlatformSchema.optional(),
  company: z.string().max(255).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'company', 'role', 'status', 'deadline']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Get application by ID schema
export const getApplicationByIdSchema = z.object({
  id: commonSchemas.uuid,
});

// Delete application schema
export const deleteApplicationSchema = z.object({
  id: commonSchemas.uuid,
});

// Bulk update status schema
export const bulkUpdateStatusSchema = z.object({
  applicationIds: z.array(commonSchemas.uuid).min(1).max(50),
  status: applicationStatusSchema,
});

// Export applications schema
export const exportApplicationsSchema = z.object({
  status: applicationStatusSchema.optional(),
  platform: applicationPlatformSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: "Start date must be before or equal to end date",
    path: ["startDate"],
  }
);

// Type exports for TypeScript
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type ExportApplicationsQuery = z.infer<typeof exportApplicationsSchema>;

