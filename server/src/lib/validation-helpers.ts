import { z } from "zod";
import { Request } from "express";

/**
 * Validates and transforms request data using Zod schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}

/**
 * Safely validates request data and returns result with error handling
 */
export function safeValidateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Transforms Zod errors into a more readable format
 */
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });
  
  return formatted;
}

/**
 * Creates a validation schema for pagination with custom limits
 */
export function createPaginationSchema(maxLimit = 100) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(maxLimit).default(10),
  });
}

/**
 * Creates a validation schema for sorting
 */
export function createSortSchema(allowedFields: string[]) {
  return z.object({
    sortBy: z.enum(allowedFields as [string, ...string[]]).optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  });
}

/**
 * Creates a validation schema for filtering by date range
 */
export function createDateRangeSchema() {
  return z.object({
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
}

/**
 * Validates file upload constraints
 */
export function createFileValidationSchema(
  allowedMimeTypes: string[],
  maxSizeBytes: number
) {
  return z.object({
    mimetype: z.enum(allowedMimeTypes as [string, ...string[]]),
    size: z.number().max(maxSizeBytes),
    originalname: z.string().min(1),
  });
}

/**
 * Validates that a string is a valid JSON
 */
export const jsonStringSchema = z.string().refine(
  (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid JSON string" }
);

/**
 * Creates a schema for optional fields that can be null or undefined
 */
export function optional<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().nullable().transform((val) => val ?? undefined);
}

/**
 * Creates a schema that accepts either a single value or an array
 */
export function singleOrArray<T extends z.ZodTypeAny>(schema: T) {
  return z.union([schema, z.array(schema)]).transform((val) => 
    Array.isArray(val) ? val : [val]
  );
}

/**
 * Validates environment variables with Zod
 */
export function validateEnv<T>(schema: z.ZodSchema<T>, env: Record<string, string | undefined>): T {
  const result = schema.safeParse(env);
  
  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.errors.forEach((error) => {
      console.error(`  ${error.path.join(".")}: ${error.message}`);
    });
    process.exit(1);
  }
  
  return result.data;
}

/**
 * Middleware helper to extract and validate specific parts of the request
 */
export function extractValidatedData<T>(
  req: Request,
  schema: z.ZodSchema<T>,
  source: "body" | "query" | "params" = "body"
): T {
  const data = req[source];
  return validateRequest(schema, data);
}

/**
 * Creates a conditional validation schema based on another field
 */
export function conditionalSchema<T extends z.ZodTypeAny>(
  condition: (data: any) => boolean,
  schema: T,
  fallback?: z.ZodTypeAny
) {
  return z.any().superRefine((data, ctx) => {
    if (condition(data)) {
      const result = schema.safeParse(data);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          ctx.addIssue(error);
        });
      }
    } else if (fallback) {
      const result = fallback.safeParse(data);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          ctx.addIssue(error);
        });
      }
    }
  });
}

/**
 * Validates that at least one field in an object is provided
 */
export function atLeastOneField<T extends Record<string, z.ZodTypeAny>>(
  fields: T,
  message = "At least one field must be provided"
) {
  return z.object(fields).refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message }
  );
}

/**
 * Creates a schema for password confirmation
 */
export function passwordConfirmationSchema() {
  return z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );
}