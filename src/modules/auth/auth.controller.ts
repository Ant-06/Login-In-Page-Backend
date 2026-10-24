import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import { LoginDto, RegisterDto } from "./auth.dto";
import { Validator } from "../../core/validator/validator.service";
import { RouteInput } from "../../core/router/router.service";
import env from "../../config/env";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setRefreshCookie(input: RouteInput, token: string): void {
  input.setCookie("refreshToken", token, refreshCookieOptions);
}

function clearRefreshCookie(input: RouteInput): void {
  input.clearCookie("refreshToken", {
    ...refreshCookieOptions,
    maxAge: undefined,
  });
}

export class AuthController {
  @Validator(RegisterDto)
  static async register(input: RouteInput) {
    const { email, password } = input.body;
    const user = await AuthService.register(email, password);

    return {
      status: 201,
      message: "User registered successfully",
      data: { user },
    };
  }

  @Validator(LoginDto)
  static async login(input: RouteInput) {
    const { email, password } = input.body;
    const result = await AuthService.login(email, password);

    setRefreshCookie(input, result.refreshToken);

    return {
      status: 200,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    };
  }

  static async refresh(input: RouteInput) {
    const refreshToken = input.cookies?.refreshToken;

    if (!refreshToken || typeof refreshToken !== "string") {
      clearRefreshCookie(input);
      throw { status: 401, message: "Invalid or expired refresh token" };
    }

    try {
      const result = await AuthService.refresh(refreshToken);

      setRefreshCookie(input, result.refreshToken);

      return {
        status: 200,
        message: "Token refreshed",
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      };
    } catch (error: any) {
      if (error?.status === 401 || error?.status === 403) {
        clearRefreshCookie(input);
      }

      throw error;
    }
  }

  static async logout(input: RouteInput) {
    await AuthService.logout(input.cookies?.refreshToken);
    clearRefreshCookie(input);

    return {
      status: 200,
      message: "Logout successful",
      data: null,
    };
  }

  static async me(input: RouteInput) {
    const user = input.user as AuthRequest["user"];

    if (!user) {
      throw { status: 401, message: "Access token required" };
    }

    const profile = await AuthService.me(user.userId);

    return {
      status: 200,
      message: "User profile",
      data: profile,
    };
  }

  static async check(input: RouteInput) {
    const user = input.user as AuthRequest["user"];

    if (!user) {
      throw { status: 401, message: "Access token required" };
    }

    return {
      status: 200,
      message: "JWT Token is valid",
      data: {
        tokenValid: true,
        user: {
          id: user.userId,
          email: user.email,
        },
      },
    };
  }
}