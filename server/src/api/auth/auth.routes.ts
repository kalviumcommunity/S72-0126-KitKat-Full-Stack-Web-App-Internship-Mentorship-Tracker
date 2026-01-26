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

// OTP-based Password Reset routes
router.post(
  "/forgot-password",
  rateLimiters.auth,
  createEmailRateLimit(3, 60 * 60 * 1000), // 3 password reset requests per hour per email
  validateBody(schemas.auth.forgotPassword),
  authController.forgotPassword
);

router.post(
  "/verify-otp",
  rateLimiters.auth,
  createEmailRateLimit(10, 15 * 60 * 1000), // 10 OTP verification attempts per 15 minutes per email
  validateBody(schemas.auth.verifyOtp),
  authController.verifyOtp
);

router.post(
  "/reset-password",
  rateLimiters.auth,
  createEmailRateLimit(5, 15 * 60 * 1000), // 5 password reset attempts per 15 minutes per email
  validateBody(schemas.auth.resetPassword),
  authController.resetPassword
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

