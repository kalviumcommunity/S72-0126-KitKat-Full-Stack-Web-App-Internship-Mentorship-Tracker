import { Router } from "express";
import authRoutes from "./api/auth/auth.routes";
import userRoutes from "./api/users/user.routes";
import applicationRoutes from "./api/applications/application.routes";
import feedbackRoutes from "./api/feedback/feedback.routes";
import exampleRoutes from "./api/example.routes";
import authTestRoutes from "./api/auth-test.routes";

const router = Router();

// Main API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/applications", applicationRoutes);
router.use("/feedback", feedbackRoutes);

// Testing routes
router.use("/example", exampleRoutes);
router.use("/auth-test", authTestRoutes);

export default router;

