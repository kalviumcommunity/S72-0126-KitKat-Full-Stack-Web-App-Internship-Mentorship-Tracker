import { z } from "zod";
import { UserRole } from "../../types/roles";
import { PASSWORD } from "../../config/constants";

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(PASSWORD.MIN_LENGTH, `Password must be at least ${PASSWORD.MIN_LENGTH} characters`),
    role: z.nativeEnum(UserRole, {
      errorMap: () => ({ message: "Role must be STUDENT, MENTOR, or ADMIN" }),
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];

