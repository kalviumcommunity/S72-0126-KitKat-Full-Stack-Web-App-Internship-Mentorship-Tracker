import bcrypt from "bcrypt";
import { PASSWORD } from "../config/constants";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD.SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

