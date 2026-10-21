import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { sendError, sendSuccess } from "../../utils/response";
import env from "../../config/env";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setRefreshCookie = (res: Response, token: string) =>
  res.cookie("refreshToken", token, refreshCookieOptions);
const clearRefreshCookie = (res: Response) =>
  res.clearCookie("refreshToken", {
    ...refreshCookieOptions,
    maxAge: undefined,
  });

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await AuthService.register(email, password);
    return sendSuccess(res, 201, "User registered successfully", { user });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    setRefreshCookie(res, result.refreshToken);
    const publicResult = {
      accessToken: result.accessToken,
      user: result.user,
    };
    return sendSuccess(res, 200, "Login successful", publicResult);
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken || typeof refreshToken !== "string") {
      clearRefreshCookie(res);
      return sendError(res, 401, "Invalid or expired refresh token");
    }

    try {
      const result = await AuthService.refresh(refreshToken);
      setRefreshCookie(res, result.refreshToken);
      const publicResult = {
        accessToken: result.accessToken,
        user: result.user,
      };
      return sendSuccess(res, 200, "Token refreshed", publicResult);
    } catch (err: any) {
      // Expected authentication/authorization failures from AuthService
      // have a numeric status property (401, 403).
      const isExpectedAuthError =
        typeof err.status === "number" &&
        (err.status === 401 || err.status === 403);

      if (isExpectedAuthError) {
        clearRefreshCookie(res);
        return sendError(res, err.status, err.message);
      }

      // Unexpected errors (DB failures, programming errors) — forward to
      // the centralized error handler; do not turn them into 401s.
      return next(err);
    }
  }

  static async logout(req: Request, res: Response) {
    await AuthService.logout(req.cookies?.refreshToken);
    clearRefreshCookie(res);
    return sendSuccess(res, 200, "Logout successful", null);
  }

  static async me(req: AuthRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 401, "Access token required");
    }
    const user = await AuthService.me(req.user.userId);
    return sendSuccess(res, 200, "User profile", user);
  }
}
