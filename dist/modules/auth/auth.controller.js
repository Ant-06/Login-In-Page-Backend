"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
const env_1 = __importDefault(require("../../config/env"));
const refreshCookieOptions = {
    httpOnly: true,
    secure: env_1.default.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const setRefreshCookie = (res, token) => res.cookie("refreshToken", token, refreshCookieOptions);
const clearRefreshCookie = (res) => res.clearCookie("refreshToken", {
    ...refreshCookieOptions,
    maxAge: undefined,
});
class AuthController {
    static async register(req, res) {
        const { email, password } = req.body;
        const user = await auth_service_1.AuthService.register(email, password);
        return (0, response_1.sendSuccess)(res, 201, "User registered successfully", { user });
    }
    static async login(req, res) {
        const { email, password } = req.body;
        const result = await auth_service_1.AuthService.login(email, password);
        setRefreshCookie(res, result.refreshToken);
        const publicResult = {
            accessToken: result.accessToken,
            user: result.user,
        };
        return (0, response_1.sendSuccess)(res, 200, "Login successful", publicResult);
    }
    static async refresh(req, res, next) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken || typeof refreshToken !== "string") {
            clearRefreshCookie(res);
            return (0, response_1.sendError)(res, 401, "Invalid or expired refresh token");
        }
        try {
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            setRefreshCookie(res, result.refreshToken);
            const publicResult = {
                accessToken: result.accessToken,
                user: result.user,
            };
            return (0, response_1.sendSuccess)(res, 200, "Token refreshed", publicResult);
        }
        catch (err) {
            // Expected authentication/authorization failures from AuthService
            // have a numeric status property (401, 403).
            const isExpectedAuthError = typeof err.status === "number" &&
                (err.status === 401 || err.status === 403);
            if (isExpectedAuthError) {
                clearRefreshCookie(res);
                return (0, response_1.sendError)(res, err.status, err.message);
            }
            // Unexpected errors (DB failures, programming errors) — forward to
            // the centralized error handler; do not turn them into 401s.
            return next(err);
        }
    }
    static async logout(req, res) {
        await auth_service_1.AuthService.logout(req.cookies?.refreshToken);
        clearRefreshCookie(res);
        return (0, response_1.sendSuccess)(res, 200, "Logout successful", null);
    }
    static async me(req, res) {
        if (!req.user) {
            return (0, response_1.sendError)(res, 401, "Access token required");
        }
        const user = await auth_service_1.AuthService.me(req.user.userId);
        return (0, response_1.sendSuccess)(res, 200, "User profile", user);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map