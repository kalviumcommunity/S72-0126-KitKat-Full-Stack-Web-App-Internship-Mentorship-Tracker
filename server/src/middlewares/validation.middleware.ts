import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { ValidationError } from "./error.middleware";
import { formatZodError } from "../lib/validation-helpers";

export interface ValidationConfig {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  headers?: ZodSchema;
  files?: ZodSchema;
}

/**
 * Comprehensive validation middleware that can validate multiple parts of the request
 */
export function validateRequest(config: ValidationConfig) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const errors: Record<string, string[]> = {};

      // Validate body
      if (config.body) {
        const result = config.body.safeParse(req.body);
        if (!result.success) {
          Object.assign(errors, formatZodError(result.error));
        } else {
          req.body = result.data;
        }
      }

      // Validate query parameters
      if (config.query) {
        const result = config.query.safeParse(req.query);
        if (!result.success) {
          const formattedErrors = formatZodError(result.error);
          Object.keys(formattedErrors).forEach(key => {
            errors[`query.${key}`] = formattedErrors[key];
          });
        } else {
          req.query = result.data;
        }
      }

      // Validate route parameters
      if (config.params) {
        const result = config.params.safeParse(req.params);
        if (!result.success) {
          const formattedErrors = formatZodError(result.error);
          Object.keys(formattedErrors).forEach(key => {
            errors[`params.${key}`] = formattedErrors[key];
          });
        } else {
          req.params = result.data;
        }
      }

      // Validate headers
      if (config.headers) {
        const result = config.headers.safeParse(req.headers);
        if (!result.success) {
          const formattedErrors = formatZodError(result.error);
          Object.keys(formattedErrors).forEach(key => {
            errors[`headers.${key}`] = formattedErrors[key];
          });
        }
      }

      // Validate files (if using multer)
      if (config.files && req.files) {
        const result = config.files.safeParse(req.files);
        if (!result.success) {
          const formattedErrors = formatZodError(result.error);
          Object.keys(formattedErrors).forEach(key => {
            errors[`files.${key}`] = formattedErrors[key];
          });
        }
      }

      // If there are validation errors, throw ValidationError
      if (Object.keys(errors).length > 0) {
        throw new ValidationError("Validation failed", errors);
      }

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        return next(error);
      } else {
        return next(new ValidationError("Validation error occurred"));
      }
    }
  };
}

// Convenience functions for single-target validation
export const validateBody = (schema: ZodSchema) => 
  validateRequest({ body: schema });

export const validateQuery = (schema: ZodSchema) => 
  validateRequest({ query: schema });

export const validateParams = (schema: ZodSchema) => 
  validateRequest({ params: schema });

export const validateHeaders = (schema: ZodSchema) => 
  validateRequest({ headers: schema });

// Combined validation for common patterns
export const validateBodyAndParams = (bodySchema: ZodSchema, paramsSchema: ZodSchema) =>
  validateRequest({ body: bodySchema, params: paramsSchema });

export const validateQueryAndParams = (querySchema: ZodSchema, paramsSchema: ZodSchema) =>
  validateRequest({ query: querySchema, params: paramsSchema });

// File validation middleware
export function validateFile(
  fieldName: string,
  options: {
    required?: boolean;
    maxSize?: number;
    allowedMimeTypes?: string[];
    maxCount?: number;
  } = {}
) {
  const {
    required = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedMimeTypes = [],
    maxCount = 1,
  } = options;

  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const files = req.files as any;
      const file = files?.[fieldName];

      // Check if file is required
      if (required && !file) {
        throw new ValidationError("File is required", {
          [fieldName]: ["File is required"],
        });
      }

      // If no file and not required, continue
      if (!file) {
        return next();
      }

      // Handle multiple files
      const fileArray = Array.isArray(file) ? file : [file];

      // Check file count
      if (fileArray.length > maxCount) {
        throw new ValidationError("Too many files", {
          [fieldName]: [`Maximum ${maxCount} file(s) allowed`],
        });
      }

      // Validate each file
      for (const f of fileArray) {
        // Check file size
        if (f.size > maxSize) {
          throw new ValidationError("File too large", {
            [fieldName]: [`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`],
          });
        }

        // Check MIME type
        if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(f.mimetype)) {
          throw new ValidationError("Invalid file type", {
            [fieldName]: [`Allowed file types: ${allowedMimeTypes.join(", ")}`],
          });
        }
      }

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(error);
      } else {
        next(new ValidationError("File validation error"));
      }
    }
  };
}

// Conditional validation based on user role or other conditions
export function conditionalValidation(
  condition: (req: Request) => boolean,
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (condition(req)) {
      const config = { [target]: schema };
      return validateRequest(config)(req, res, next);
    }
    next();
  };
}

// Validation for pagination parameters
export const validatePagination = validateQuery(
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  })
);

// Validation for sorting parameters
export function validateSort(allowedFields: string[]) {
  return validateQuery(
    z.object({
      sortBy: z.enum(allowedFields as [string, ...string[]]).optional(),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    })
  );
}

// Validation for search parameters
export const validateSearch = validateQuery(
  z.object({
    q: z.string().min(1).max(100).optional(),
    filter: z.string().optional(),
  })
);

// UUID parameter validation
export const validateUuidParam = (paramName: string = "id") =>
  validateParams(
    z.object({
      [paramName]: z.string().uuid(`Invalid ${paramName} format`),
    })
  );