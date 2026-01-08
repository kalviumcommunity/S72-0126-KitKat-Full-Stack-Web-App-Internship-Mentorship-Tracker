import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { validateRequest, validateBody, validateParams, validateQuery } from "../middlewares/validation.middleware";
import { rateLimiters } from "../middlewares/rate-limit.middleware";
import { schemas } from "../lib/validation";
import { z } from "zod";

const router = Router();

// Example: Create user with comprehensive validation
router.post(
  "/users",
  rateLimiters.general,
  validateBody(schemas.auth.signup),
  asyncHandler(async (req, res) => {
    // The request body is now validated and typed
    const { email, password, role, firstName, lastName } = req.body;
    
    // Simulate user creation
    const user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      email,
      role,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: { user },
      message: "User created successfully",
    });
  })
);

// Example: Get user with UUID validation
router.get(
  "/users/:id",
  rateLimiters.general,
  validateParams(z.object({ id: z.string().uuid() })),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Simulate user lookup
    const user = {
      id,
      email: "user@example.com",
      role: "STUDENT",
      firstName: "John",
      lastName: "Doe",
    };

    res.json({
      success: true,
      data: { user },
    });
  })
);

// Example: List users with pagination and search
router.get(
  "/users",
  rateLimiters.general,
  validateQuery(
    z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
      search: z.string().optional(),
      role: z.enum(["STUDENT", "MENTOR", "ADMIN"]).optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const { page, limit, search, role } = req.query;
    
    // Simulate user list
    const users = [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "user1@example.com",
        role: "STUDENT",
        firstName: "John",
        lastName: "Doe",
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174001",
        email: "user2@example.com",
        role: "MENTOR",
        firstName: "Jane",
        lastName: "Smith",
      },
    ];

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
    });
  })
);

// Example: Update user with partial validation
router.put(
  "/users/:id",
  rateLimiters.general,
  validateRequest({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    // Simulate user update
    const updatedUser = {
      id,
      email: "user@example.com",
      role: "STUDENT",
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: { user: updatedUser },
      message: "User updated successfully",
    });
  })
);

// Example: Create application with comprehensive validation
router.post(
  "/applications",
  rateLimiters.general,
  validateBody(schemas.application.create),
  asyncHandler(async (req, res) => {
    const applicationData = req.body;
    
    // Simulate application creation
    const application = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      userId: "user-id",
      ...applicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: { application },
      message: "Application created successfully",
    });
  })
);

// Example: Error demonstration route
router.get(
  "/error-demo/:type",
  validateParams(z.object({ 
    type: z.enum(["validation", "not-found", "server-error", "auth-error"]) 
  })),
  asyncHandler(async (req, res) => {
    const { type } = req.params;
    
    switch (type) {
      case "validation":
        // This will trigger validation error
        throw new Error("This should not happen - validation should catch this");
        
      case "not-found":
        const { NotFoundError } = await import("../middlewares/error.middleware");
        throw new NotFoundError("Demo resource");
        
      case "server-error":
        throw new Error("This is a demo server error");
        
      case "auth-error":
        const { AuthenticationError } = await import("../middlewares/error.middleware");
        throw new AuthenticationError("Demo authentication error");
        
      default:
        res.json({ success: true, message: "No error triggered" });
    }
  })
);

export default router;