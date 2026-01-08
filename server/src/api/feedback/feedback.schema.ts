import { z } from "zod";
import { PAGINATION } from "../../config/constants";

export const FeedbackTag = z.enum(["RESUME", "DSA", "SYSTEM_DESIGN", "COMMUNICATION"]);

export const FeedbackPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createFeedbackSchema = z.object({
  body: z.object({
    applicationId: z.string().uuid("Invalid application ID"),
    content: z.string().min(1, "Content is required").max(5000, "Content too long"),
    tags: z.array(FeedbackTag).min(1, "At least one tag is required"),
    priority: FeedbackPriority,
  }),
});

export const updateFeedbackSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid feedback ID"),
  }),
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
    tags: z.array(FeedbackTag).optional(),
    priority: FeedbackPriority.optional(),
  }),
});

export const getFeedbackSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid feedback ID"),
  }),
});

export const listFeedbackSchema = z.object({
  query: z.object({
    applicationId: z.string().uuid().optional(),
    mentorId: z.string().uuid().optional(),
    priority: FeedbackPriority.optional(),
    tags: z.string().optional().transform((val) => (val ? val.split(",") : undefined)),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  }),
});

export const deleteFeedbackSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid feedback ID"),
  }),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>["body"];
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>["body"];
export type ListFeedbackQuery = z.infer<typeof listFeedbackSchema>["query"];

