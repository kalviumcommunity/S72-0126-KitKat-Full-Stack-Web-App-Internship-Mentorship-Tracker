export enum UserRole {
  STUDENT = "STUDENT",
  MENTOR = "MENTOR",
  ADMIN = "ADMIN",
}

export type Role = UserRole.STUDENT | UserRole.MENTOR | UserRole.ADMIN;

