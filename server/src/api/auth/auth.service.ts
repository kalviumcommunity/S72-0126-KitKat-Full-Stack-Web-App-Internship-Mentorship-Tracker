import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../lib/password";
import { generateToken } from "../../lib/jwt";
import { SignupInput, LoginInput, CreateApplicationInput } from "../../lib/validation";
import { UserRole } from "../../types/roles";
import { logger } from "../../lib/logger";
import { ConflictError, AuthenticationError, NotFoundError } from "../../middlewares/error.middleware";

export class AuthService {
  async signup(input: SignupInput) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new ConflictError("Email already exists");
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role as UserRole,
          firstName: input.firstName,
          lastName: input.lastName,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
        },
      });

      logger.info("User created successfully", { userId: user.id, email: user.email, role: user.role });

      return user;
    } catch (error) {
      logger.error("Signup error", error);
      throw error;
    }
  }

  async login(input: LoginInput) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          role: true,
          firstName: true,
          lastName: true,
          isActive: true,
          lastLoginAt: true,
        },
      });

      if (!user) {
        throw new AuthenticationError("Invalid email or password");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AuthenticationError("Account is deactivated");
      }

      // Verify password
      const isValid = await comparePassword(input.password, user.passwordHash);
      if (!isValid) {
        throw new AuthenticationError("Invalid email or password");
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      logger.info("User logged in successfully", { userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLoginAt: user.lastLoginAt,
        },
        token,
      };
    } catch (error) {
      logger.error("Login error", error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError("User");
      }

      if (!user.isActive) {
        throw new AuthenticationError("Account is deactivated");
      }

      return user;
    } catch (error) {
      logger.error("Get user error", error);
      throw error;
    }
  }

  async updateLastLogin(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      });
    } catch (error) {
      logger.error("Update last login error", error);
      // Don't throw error for this non-critical operation
    }
  }

  async refreshToken(userId: string) {
    try {
      const user = await this.getUserById(userId);

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      logger.info("Token refreshed", { userId: user.id });

      return { token };
    } catch (error) {
      logger.error("Refresh token error", error);
      throw error;
    }
  }

  async changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, passwordHash: true },
      });

      if (!user) {
        throw new NotFoundError("User");
      }

      // Verify current password
      const isValid = await comparePassword(input.currentPassword, user.passwordHash);
      if (!isValid) {
        throw new AuthenticationError("Current password is incorrect");
      }

      // Hash new password
      const newPasswordHash = await hashPassword(input.newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { 
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        },
      });

      logger.info("Password changed successfully", { userId });
    } catch (error) {
      logger.error("Change password error", error);
      throw error;
    }
  }

  async deactivateUser(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          isActive: false,
          updatedAt: new Date(),
        },
      });

      logger.info("User deactivated", { userId });
    } catch (error) {
      logger.error("Deactivate user error", error);
      throw error;
    }
  }

  async activateUser(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          isActive: true,
          updatedAt: new Date(),
        },
      });

      logger.info("User activated", { userId });
    } catch (error) {
      logger.error("Activate user error", error);
      throw error;
    }
  }
}

export const authService = new AuthService();

