import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);

export const authRoutes = router;
