import { Request, Response } from "express";
import { authService } from "./auth.service";
import { ApiResponse } from "../../types/api";
import { JWT } from "../../config/constants";
import { logger } from "../../lib/logger";

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const user = await authService.signup(req.body);

      const response: ApiResponse = {
        success: true,
        data: { user },
        message: "User created successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error("Signup controller error", error);
      
      if (error instanceof Error && error.message === "Email already exists") {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "DUPLICATE_EMAIL",
            message: error.message,
          },
        };
        return res.status(409).json(response);
      }

      throw error;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await authService.login(req.body);

      // Set HttpOnly cookie
      res.cookie(JWT.COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      const response: ApiResponse = {
        success: true,
        data: { user },
        message: "Login successful",
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Login controller error", error);
      
      if (error instanceof Error && error.message === "Invalid credentials") {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: error.message,
          },
        };
        return res.status(401).json(response);
      }

      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie(JWT.COOKIE_NAME);

    const response: ApiResponse = {
      success: true,
      message: "Logged out successfully",
    };

    res.status(200).json(response);
  }

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
        return res.status(401).json(response);
      }

      const user = await authService.getUserById(req.user.id);

      const response: ApiResponse = {
        success: true,
        data: { user },
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get me controller error", error);
      throw error;
    }
  }
}

export const authController = new AuthController();

