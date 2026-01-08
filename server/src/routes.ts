import { Router } from "express";
import authRoutes from "./api/auth/auth.routes";
import applicationRoutes from "./api/applications/application.routes";
import feedbackRoutes from "./api/feedback/feedback.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/applications", applicationRoutes);
router.use("/feedback", feedbackRoutes);

export default router;

