import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { signupSchema, loginSchema } from "./auth.schema";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", validate(signupSchema), authController.signup.bind(authController));
router.post("/login", validate(loginSchema), authController.login.bind(authController));
router.post("/logout", authenticate, authController.logout.bind(authController));
router.get("/me", authenticate, authController.getMe.bind(authController));

export default router;

