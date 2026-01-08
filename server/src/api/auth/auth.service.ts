import { prisma } from "../../lib/prisma";
import { hashPassword, comparePassword } from "../../lib/password";
import { generateToken } from "../../lib/jwt";
import { SignupInput, LoginInput } from "./auth.schema";
import { UserRole } from "../../types/roles";
import { logger } from "../../lib/logger";

export class AuthService {
  async signup(input: SignupInput) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          role: input.role as UserRole,
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

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
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isValid = await comparePassword(input.password, user.passwordHash);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
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
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      logger.error("Get user error", error);
      throw error;
    }
  }
}

export const authService = new AuthService();

