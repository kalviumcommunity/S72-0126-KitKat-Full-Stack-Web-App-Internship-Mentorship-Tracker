import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RequestUser } from "../types/api";
import { UserRole } from "@prisma/client";

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

// Alias for compatibility with existing imports
export const signToken = generateToken;

export function verifyToken(token: string): RequestUser {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload & {
      iat?: number;
      exp?: number;
    };
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

