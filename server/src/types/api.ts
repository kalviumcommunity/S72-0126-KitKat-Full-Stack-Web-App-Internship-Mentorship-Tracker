import { UserRole } from "@prisma/client";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  organizationId?: string; // Added for multi-tenant support
}

export interface RequestUser extends AuthUser {
  iat?: number;
  exp?: number;
}

