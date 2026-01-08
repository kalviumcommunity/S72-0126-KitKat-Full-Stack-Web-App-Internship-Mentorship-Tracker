import { z } from "zod";
import { PAGINATION } from "../../config/constants";

export const ApplicationStatus = z.enum([
  "DRAFT",
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

export const ApplicationPlatform = z.enum([
  "LINKEDIN",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "JOB_BOARD",
  "CAREER_FAIR",
  "OTHER",
]);

export const createApplicationSchema = z.object({
  body: z.object({
    company: z.string().min(1, "Company name is required").max(255, "Company name too long"),
    role: z.string().min(1, "Role is required").max(255, "Role too long"),
    platform: ApplicationPlatform,
    status: ApplicationStatus.optional().default("DRAFT"),
    resumeUrl: z.string().url("Invalid URL format").optional().nullable(),
    notes: z.string().max(5000, "Notes too long").optional().nullable(),
    deadline: z.string().datetime().optional().nullable(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid application ID"),
  }),
  body: z.object({
    company: z.string().min(1).max(255).optional(),
    role: z.string().min(1).max(255).optional(),
    platform: ApplicationPlatform.optional(),
    status: ApplicationStatus.optional(),
    resumeUrl: z.string().url().optional().nullable(),
    notes: z.string().max(5000).optional().nullable(),
    deadline: z.string().datetime().optional().nullable(),
  }),
});

export const getApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid application ID"),
  }),
});

export const listApplicationsSchema = z.object({
  query: z.object({
    status: ApplicationStatus.optional(),
    company: z.string().optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  }),
});

export const deleteApplicationSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid application ID"),
  }),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>["body"];
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>["body"];
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>["query"];

