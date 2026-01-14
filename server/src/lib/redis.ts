import { createClient, RedisClientType } from "redis";
import { env } from "../config/env";
import { logger } from "./logger";

class RedisClient {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return;
    }

    try {
      this.client = createClient({
        url: env.REDIS_URL || "redis://localhost:6379",
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error("Redis reconnection failed after 10 attempts");
              return new Error("Redis reconnection failed");
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      this.client.on("error", (err) => {
        logger.error("Redis client error", { error: err.message });
      });

      this.client.on("connect", () => {
        logger.info("Redis client connected");
      });

      this.client.on("ready", () => {
        logger.info("Redis client ready");
        this.isConnected = true;
      });

      this.client.on("reconnecting", () => {
        logger.warn("Redis client reconnecting");
      });

      this.client.on("end", () => {
        logger.info("Redis client disconnected");
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      logger.error("Failed to connect to Redis", { error });
      // Don't throw - allow app to run without Redis
      this.client = null;
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }

  getClient(): RedisClientType | null {
    return this.client;
  }

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  // Get value from cache
  async get<T>(key: string): Promise<T | null> {
    if (!this.isReady()) {
      return null;
    }

    try {
      const value = await this.client!.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error("Redis GET error", { key, error });
      return null;
    }
  }

  // Set value in cache with TTL (in seconds)
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.client!.setEx(key, ttl, serialized);
      } else {
        await this.client!.set(key, serialized);
      }
      return true;
    } catch (error) {
      logger.error("Redis SET error", { key, error });
      return false;
    }
  }

  // Delete key from cache
  async del(key: string | string[]): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const keys = Array.isArray(key) ? key : [key];
      await this.client!.del(keys);
      return true;
    } catch (error) {
      logger.error("Redis DEL error", { key, error });
      return false;
    }
  }

  // Delete keys matching pattern
  async delPattern(pattern: string): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const keys = await this.client!.keys(pattern);
      if (keys.length > 0) {
        await this.client!.del(keys);
      }
      return true;
    } catch (error) {
      logger.error("Redis DEL pattern error", { pattern, error });
      return false;
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const result = await this.client!.exists(key);
      return result === 1;
    } catch (error) {
      logger.error("Redis EXISTS error", { key, error });
      return false;
    }
  }

  // Set expiration on key
  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      await this.client!.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error("Redis EXPIRE error", { key, error });
      return false;
    }
  }

  // Increment value
  async incr(key: string): Promise<number | null> {
    if (!this.isReady()) {
      return null;
    }

    try {
      return await this.client!.incr(key);
    } catch (error) {
      logger.error("Redis INCR error", { key, error });
      return null;
    }
  }

  // Decrement value
  async decr(key: string): Promise<number | null> {
    if (!this.isReady()) {
      return null;
    }

    try {
      return await this.client!.decr(key);
    } catch (error) {
      logger.error("Redis DECR error", { key, error });
      return null;
    }
  }

  // Get multiple keys
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isReady() || keys.length === 0) {
      return keys.map(() => null);
    }

    try {
      const values = await this.client!.mGet(keys);
      return values.map((value) => {
        if (!value) return null;
        try {
          return JSON.parse(value) as T;
        } catch {
          return null;
        }
      });
    } catch (error) {
      logger.error("Redis MGET error", { keys, error });
      return keys.map(() => null);
    }
  }

  // Set multiple keys
  async mset(entries: Record<string, any>): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const serialized: Record<string, string> = {};
      for (const [key, value] of Object.entries(entries)) {
        serialized[key] = JSON.stringify(value);
      }
      await this.client!.mSet(serialized);
      return true;
    } catch (error) {
      logger.error("Redis MSET error", { error });
      return false;
    }
  }

  // Hash operations
  async hget<T>(key: string, field: string): Promise<T | null> {
    if (!this.isReady()) {
      return null;
    }

    try {
      const value = await this.client!.hGet(key, field);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error("Redis HGET error", { key, field, error });
      return null;
    }
  }

  async hset(key: string, field: string, value: any): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      await this.client!.hSet(key, field, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error("Redis HSET error", { key, field, error });
      return false;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    if (!this.isReady()) {
      return null;
    }

    try {
      const hash = await this.client!.hGetAll(key);
      if (!hash || Object.keys(hash).length === 0) return null;

      const result: Record<string, T> = {};
      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value) as T;
        } catch {
          // Skip invalid JSON
        }
      }
      return result;
    } catch (error) {
      logger.error("Redis HGETALL error", { key, error });
      return null;
    }
  }

  async hdel(key: string, fields: string | string[]): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const fieldArray = Array.isArray(fields) ? fields : [fields];
      await this.client!.hDel(key, fieldArray);
      return true;
    } catch (error) {
      logger.error("Redis HDEL error", { key, fields, error });
      return false;
    }
  }
}

// Singleton instance
export const redis = new RedisClient();

// Cache key builders
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,
  application: (id: string) => `application:${id}`,
  applicationList: (userId: string, filters: string) => `applications:${userId}:${filters}`,
  feedback: (id: string) => `feedback:${id}`,
  feedbackList: (userId: string, filters: string) => `feedback:${userId}:${filters}`,
  feedbackByApplication: (applicationId: string) => `feedback:app:${applicationId}`,
  stats: (userId: string, type: string) => `stats:${type}:${userId}`,
  mentorAssignment: (mentorId: string, studentId: string) => `assignment:${mentorId}:${studentId}`,
  mentorStudents: (mentorId: string) => `mentor:students:${mentorId}`,
  studentMentors: (studentId: string) => `student:mentors:${studentId}`,
};

// Cache TTL (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
};
