import { env } from "../config/env";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private shouldLog(level: string): boolean {
    const levels = ["error", "warn", "info", "debug"];
    const currentLevelIndex = levels.indexOf(env.LOG_LEVEL);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    if (env.NODE_ENV !== "test" && this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, context));
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (env.NODE_ENV === "development" && this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  // Production-specific logging methods
  security(message: string, context?: LogContext): void {
    // Always log security events regardless of log level
    console.error(this.formatMessage("SECURITY", message, context));
  }

  audit(action: string, userId?: string, context?: LogContext): void {
    // Always log audit events
    const auditContext = {
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...context,
    };
    console.log(this.formatMessage("AUDIT", action, auditContext));
  }

  performance(message: string, duration: number, context?: LogContext): void {
    if (this.shouldLog("info")) {
      const perfContext = { duration: `${duration}ms`, ...context };
      console.log(this.formatMessage("PERF", message, perfContext));
    }
  }
}

export const logger = new Logger();

