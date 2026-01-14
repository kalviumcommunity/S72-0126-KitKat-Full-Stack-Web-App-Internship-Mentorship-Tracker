import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { redis } from "./lib/redis";

// Initialize Redis connection
async function initializeServer() {
  try {
    // Connect to Redis
    await redis.connect();
    logger.info("Redis connection initialized");
  } catch (error) {
    logger.warn("Redis connection failed, continuing without cache", { error });
  }

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(async () => {
      logger.info("HTTP server closed");
      await redis.disconnect();
      logger.info("Redis connection closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  return server;
}

// Start server
initializeServer().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});

export default initializeServer;

