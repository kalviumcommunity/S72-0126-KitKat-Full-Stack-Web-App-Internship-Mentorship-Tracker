import { createClient } from "redis";
import { env } from "../config/env";
import { logger } from "./logger";

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      logger.error("Redis Client Error", err);
    });

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }

  return redisClient;
}

export async function closeRedisConnection() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}

