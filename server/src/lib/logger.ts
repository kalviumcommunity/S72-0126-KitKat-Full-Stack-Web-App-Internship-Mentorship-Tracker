import { env } from "../config/env";

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (env.NODE_ENV !== "test") {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

