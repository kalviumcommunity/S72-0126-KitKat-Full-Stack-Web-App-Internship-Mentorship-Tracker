import { Router } from "express";
import authRoutes from "./api/auth/auth.routes";
import applicationRoutes from "./api/applications/application.routes";
import feedbackRoutes from "./api/feedback/feedback.routes";
import exampleRoutes from "./api/example.routes";

const router = Router();

// Main API routes
router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);
router.use("/feedback", feedbackRoutes);

// Example routes (for testing validation and error handling)
router.use("/example", exampleRoutes);

export default router;

