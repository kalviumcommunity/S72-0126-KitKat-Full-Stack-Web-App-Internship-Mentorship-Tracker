import { z } from "zod";

// Enums matching Prisma schema
export const FeedbackTag = z.enum(["RESUME", "DSA", "SYSTEM_DESIGN", "COMMUNICATION"]);
export const FeedbackPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Create feedback schema
export const createFeedbackSchema = z.object({
  body: z.object({
    applicationId: z.string().uuid("Invalid application ID"),
    content: z
      .string()
      .min(10, "Feedback content must be at least 10 characters")
      .max(2000, "Feedback content must be less than 2000 characters")
      .trim(),
    tags: z
      .array(FeedbackTag)
      .min(1, "At least one tag is required")
      .max(4, "Maximum 4 tags allowed"),
    priority: FeedbackPriority,
  }),
});

// Update feedback schema
export const updateFeedbackSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(10, "Feedback content must be at least 10 characters")
      .max(2000, "Feedback content must be less than 2000 characters")
      .trim()
      .optional(),
    tags: z
      .array(FeedbackTag)
      .min(1, "At least one tag is required")
      .max(4, "Maximum 4 tags allowed")
      .optional(),
    priority: FeedbackPriority.optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});

// Query parameters schema
export const feedbackQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    applicationId: z.string().uuid().optional(),
    mentorId: z.string().uuid().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    priority: z.union([z.string(), z.array(z.string())]).optional(),
    sortBy: z.enum(["createdAt", "updatedAt", "priority"]).default("createdAt").optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  }),
});

// UUID parameter schema
export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid feedback ID"),
  }),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>["body"];
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>["body"];
export type FeedbackQueryParams = z.infer<typeof feedbackQuerySchema>["query"];
