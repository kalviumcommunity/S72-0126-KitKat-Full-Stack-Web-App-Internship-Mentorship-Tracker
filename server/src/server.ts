/// <reference path="./types/express.d.ts" />

import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { redis } from "./lib/redis";
import { prisma } from "./lib/prisma";

// Health check for dependencies
async function checkDependencies(): Promise<void> {
  const checks = [];

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connection verified");
  } catch (error) {
    logger.error("Database connection failed", { error });
    throw new Error("Database connection failed");
  }

  // Check Redis connection (optional in development)
  try {
    await redis.connect();
    logger.info("Redis connection verified");
  } catch (error) {
    if (env.NODE_ENV === "production") {
      logger.error("Redis connection failed", { error });
      throw new Error("Redis connection failed");
    } else {
      logger.warn("Redis connection failed, continuing without cache", { error });
    }
  }
}

// Initialize server with proper error handling
async function initializeServer() {
  try {
    logger.info("Starting server initialization", {
      nodeEnv: env.NODE_ENV,
      port: env.PORT,
      version: process.env.npm_package_version || "unknown",
    });

    // Check dependencies
    await checkDependencies();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info("Server started successfully", {
        port: env.PORT,
        environment: env.NODE_ENV,
        pid: process.pid,
        nodeVersion: process.version,
      });
    });

    // Handle server errors
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`Port ${env.PORT} is already in use`);
      } else {
        logger.error("Server error", { error });
      }
      process.exit(1);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string) => {
      logger.info(`${signal} signal received: starting graceful shutdown`);
      
      // Stop accepting new connections
      server.close(async (err) => {
        if (err) {
          logger.error("Error during server shutdown", { error: err });
        } else {
          logger.info("HTTP server closed");
        }

        try {
          // Close database connections
          await prisma.$disconnect();
          logger.info("Database connections closed");

          // Close Redis connection
          await redis.disconnect();
          logger.info("Redis connection closed");

          logger.info("Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during graceful shutdown", { error });
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 30000);
    };

    // Register shutdown handlers
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught exception", { error: error.message, stack: error.stack });
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled promise rejection", { reason, promise });
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error("Failed to initialize server", { error });
    process.exit(1);
  }
}

// Start server
if (require.main === module) {
  initializeServer().catch((error) => {
    logger.error("Server startup failed", { error });
    process.exit(1);
  });
}

export default initializeServer;

