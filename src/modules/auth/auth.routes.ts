import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticateToken } from "../../middleware/auth.middleware";
import {
  createRouter,
  registerRoute,
} from "../../core/router/router.service";

const router: Router = createRouter();

registerRoute(router, "post", "/register", AuthController, "register", {
  status: 201,
  message: "User registered successfully",
});

registerRoute(router, "post", "/login", AuthController, "login", {
  status: 200,
  message: "Login successful",
});

registerRoute(router, "post", "/refresh", AuthController, "refresh", {
  status: 200,
  message: "Token refreshed",
});

registerRoute(router, "post", "/logout", AuthController, "logout", {
  status: 200,
  message: "Logout successful",
});

registerRoute(router, "get", "/me", AuthController, "me", {
  middleware: [authenticateToken],
  status: 200,
  message: "User profile",
});

registerRoute(router, "get", "/dashboard", AuthController, "me", {
  middleware: [authenticateToken],
  status: 200,
  message: "User profile",
});

registerRoute(router, "get", "/check", AuthController, "check", {
  middleware: [authenticateToken],
  status: 200,
  message: "JWT Token is valid",
});

export default router;