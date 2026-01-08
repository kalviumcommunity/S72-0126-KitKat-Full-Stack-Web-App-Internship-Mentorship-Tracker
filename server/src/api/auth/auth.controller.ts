import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ApiResponse } from "../../types/api";
import { JWT } from "../../config/constants";
import { logger } from "../../lib/logger";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, ConflictError, NotFoundError } from "../../middlewares/error.middleware";
import { SUCCESS_MESSAGES } from "../../constants/errors";

export class AuthController {
  signup = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.signup(req.body);

    const response: ApiResponse = {
      success: true,
      data: { user },
      message: SUCCESS_MESSAGES.USER_CREATED,
    };

    res.status(201).json(response);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);

    // Set HttpOnly cookie with secure settings
    res.cookie(JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    });

    // Update last login timestamp
    await authService.updateLastLogin(user.id);

    const response: ApiResponse = {
      success: true,
      data: { user },
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    };

    res.status(200).json(response);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // Clear the auth cookie
    res.clearCookie(JWT.COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };

    res.status(200).json(response);
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const user = await authService.getUserById(req.user.id);
    if (!user) {
      throw new NotFoundError("User");
    }

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { token } = await authService.refreshToken(req.user.id);

    // Set new HttpOnly cookie
    res.cookie(JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    });

    const response: ApiResponse = {
      success: true,
      message: "Token refreshed successfully",
    };

    res.status(200).json(response);
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    await authService.changePassword(req.user.id, req.body);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
    };

    res.status(200).json(response);
  });
}

export const authController = new AuthController();

