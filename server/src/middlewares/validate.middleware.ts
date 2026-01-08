import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiResponse } from "../types/api";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
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

