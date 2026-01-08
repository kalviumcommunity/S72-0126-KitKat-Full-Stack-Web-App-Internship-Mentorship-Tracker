import { Router } from "express";
import { authController } from "./auth.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { schemas } from "../../lib/validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { rateLimiters, createEmailRateLimit } from "../../middlewares/rate-limit.middleware";

const router = Router();

// Public routes with rate limiting
router.post(
  "/signup",
  rateLimiters.auth,
  createEmailRateLimit(3, 60 * 60 * 1000), // 3 signups per hour per email
  validateBody(schemas.auth.signup),
  authController.signup
);

router.post(
  "/login",
  rateLimiters.auth,
  createEmailRateLimit(5, 15 * 60 * 1000), // 5 login attempts per 15 minutes per email
  validateBody(schemas.auth.login),
  authController.login
);

// Protected routes
router.post(
  "/logout",
  authenticate,
  authController.logout
);

router.get(
  "/me",
  authenticate,
  authController.getMe
);

router.post(
  "/refresh",
  authenticate,
  authController.refreshToken
);

router.post(
  "/change-password",
  authenticate,
  rateLimiters.auth,
  validateBody(schemas.auth.changePassword),
  authController.changePassword
);

export default router;

