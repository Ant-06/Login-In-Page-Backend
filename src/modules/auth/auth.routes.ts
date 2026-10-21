import { Router } from "express";
import { AuthController } from "./auth.controller";
import {
  authenticateToken,
  AuthRequest,
} from "../../middleware/auth.middleware";
import { sendSuccess } from "../../utils/response";
import { validateBody } from "../../middleware/validation.middleware";
import { LoginDto, RegisterDto } from "./auth.dto";

const router = Router();

// Registration and login
router.post("/register", validateBody(RegisterDto), AuthController.register);
router.post("/login", validateBody(LoginDto), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

// Protected routes
router.get("/me", authenticateToken, AuthController.me);
router.get("/dashboard", authenticateToken, AuthController.me); // backward compatible
router.get("/check", authenticateToken, async (req: AuthRequest, res) => {
  const user = req.user;
  return sendSuccess(res, 200, "JWT Token is valid", {
    tokenValid: true,
    user: { id: user?.userId, email: user?.email },
  });
});

export default router;
