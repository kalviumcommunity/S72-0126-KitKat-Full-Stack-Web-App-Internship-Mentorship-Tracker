import { z } from "zod";

// UUID parameter schema
export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid notification ID"),
  }),
});

// Query parameters schema for notifications
export const notificationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    read: z.coerce.boolean().optional(),
    type: z.string().optional(),
    sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt").optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  }),
});

export type NotificationQueryParams = z.infer<typeof notificationQuerySchema>["query"];