import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { closeRedisConnection } from "./lib/redis";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    logger.info("HTTP server closed");
    await closeRedisConnection();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received: closing HTTP server");
  server.close(async () => {
    logger.info("HTTP server closed");
    await closeRedisConnection();
    process.exit(0);
  });
});

export default server;

