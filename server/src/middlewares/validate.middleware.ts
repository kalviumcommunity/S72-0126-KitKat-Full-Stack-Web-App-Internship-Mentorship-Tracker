import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponse } from "../types/api";

export type ValidationTarget = "body" | "query" | "params" | "headers";

export interface ValidationOptions {
  target?: ValidationTarget;
  stripUnknown?: boolean;
}

export function validate(
  schema: ZodSchema,
  options: ValidationOptions = {}
) {
  const { target = "body", stripUnknown = true } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate: any;

      switch (target) {
        case "body":
          dataToValidate = req.body;
          break;
        case "query":
          dataToValidate = req.query;
          break;
        case "params":
          dataToValidate = req.params;
          break;
        case "headers":
          dataToValidate = req.headers;
          break;
        default:
          dataToValidate = {
            body: req.body,
            query: req.query,
            params: req.params,
          };
      }

      const validatedData = schema.parse(dataToValidate);

      // Replace the original data with validated data
      if (target === "body") {
        req.body = validatedData;
      } else if (target === "query") {
        req.query = validatedData;
      } else if (target === "params") {
        req.params = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          if (!details[path]) {
            details[path] = [];
          }
          details[path].push(err.message);
        });

        const response: ApiResponse = {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details,
          },
        };
        return res.status(422).json(response);
      }
      next(error);
    }
  };
}

// Convenience functions for different validation targets
export const validateBody = (schema: ZodSchema, stripUnknown = true) =>
  validate(schema, { target: "body", stripUnknown });

export const validateQuery = (schema: ZodSchema, stripUnknown = true) =>
  validate(schema, { target: "query", stripUnknown });

export const validateParams = (schema: ZodSchema, stripUnknown = true) =>
  validate(schema, { target: "params", stripUnknown });

