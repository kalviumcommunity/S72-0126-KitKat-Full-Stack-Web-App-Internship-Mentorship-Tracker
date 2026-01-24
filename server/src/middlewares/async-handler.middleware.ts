import { Request, Response, NextFunction } from 'express';

/**
 * Async Handler Middleware
 * Wraps async route handlers to catch errors and pass them to error middleware
 */

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};