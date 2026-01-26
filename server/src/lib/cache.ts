import { redis, CacheTTL } from "./redis";
import { logger } from "./logger";

/**
 * Cache decorator for async functions
 * Automatically caches function results with specified TTL
 */
export function cached(key: string | ((...args: any[]) => string), ttl: number = CacheTTL.MEDIUM) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Generate cache key
      const cacheKey = typeof key === "function" ? key(...args) : key;

      // Try to get from cache
      const cached = await redis.get(cacheKey);
      if (cached !== null) {
        logger.debug("Cache hit", { key: cacheKey, method: propertyKey });
        return cached;
      }

      // Cache miss - execute original method
      logger.debug("Cache miss", { key: cacheKey, method: propertyKey });
      const result = await originalMethod.apply(this, args);

      // Store in cache (only if result is not null/undefined)
      if (result !== null && result !== undefined) {
        await redis.set(cacheKey, result, ttl);
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Cache invalidation helper
 * Invalidates cache entries matching patterns
 */
export class CacheInvalidator {
  /**
   * Invalidate user-related caches
   */
  static async invalidateUser(userId: string): Promise<void> {
    await redis.delPattern(`user:${userId}*`);
    await redis.delPattern(`stats:*:${userId}`);
    logger.debug("Invalidated user cache", { userId });
  }

  /**
   * Invalidate application-related caches
   */
  static async invalidateApplication(applicationId: string, userId: string): Promise<void> {
    await redis.del([
      `application:${applicationId}`,
      `feedback:app:${applicationId}`,
    ]);
    await redis.delPattern(`applications:${userId}:*`);
    await redis.delPattern(`stats:*:${userId}`);
    logger.debug("Invalidated application cache", { applicationId, userId });
  }

  /**
   * Invalidate feedback-related caches
   */
  static async invalidateFeedback(feedbackId: string, applicationId: string, userId: string): Promise<void> {
    await redis.del([
      `feedback:${feedbackId}`,
      `feedback:app:${applicationId}`,
    ]);
    await redis.delPattern(`feedback:${userId}:*`);
    await redis.delPattern(`stats:*:${userId}`);
    logger.debug("Invalidated feedback cache", { feedbackId, applicationId, userId });
  }

  /**
   * Invalidate mentor assignment caches
   */
  static async invalidateMentorAssignment(mentorId: string, studentId: string): Promise<void> {
    await redis.del([
      `assignment:${mentorId}:${studentId}`,
      `mentor:students:${mentorId}`,
      `student:mentors:${studentId}`,
    ]);
    await redis.delPattern(`applications:${studentId}:*`);
    await redis.delPattern(`feedback:${mentorId}:*`);
    await redis.delPattern(`feedback:${studentId}:*`);
    logger.debug("Invalidated mentor assignment cache", { mentorId, studentId });
  }

  /**
   * Invalidate all caches for a user (useful for logout, profile updates)
   */
  static async invalidateAllUserCaches(userId: string): Promise<void> {
    await redis.delPattern(`*:${userId}*`);
    logger.debug("Invalidated all user caches", { userId });
  }

  /**
   * Clear all caches (use with caution)
   */
  static async clearAll(): Promise<void> {
    const client = redis.getClient();
    if (client) {
      await client.flushDb();
      logger.warn("Cleared all caches");
    }
  }
}

/**
 * Cache-aside pattern helper
 * Tries cache first, falls back to database, then caches result
 */
export async function cacheAside<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl: number = CacheTTL.MEDIUM
): Promise<T> {
  // Try cache first
  const cached = await redis.get<T>(cacheKey);
  if (cached !== null) {
    logger.debug("Cache hit", { key: cacheKey });
    return cached;
  }

  // Cache miss - fetch from database
  logger.debug("Cache miss", { key: cacheKey });
  const result = await fetchFn();

  // Store in cache (only if result is not null/undefined)
  if (result !== null && result !== undefined) {
    await redis.set(cacheKey, result, ttl);
  }

  return result;
}

/**
 * Batch cache operations
 * Efficiently fetch multiple items from cache
 */
export async function batchGet<T>(
  keys: string[],
  fetchFn: (missingKeys: string[]) => Promise<Map<string, T>>,
  ttl: number = CacheTTL.MEDIUM
): Promise<Map<string, T>> {
  if (keys.length === 0) {
    return new Map();
  }

  // Get all from cache - mget returns (T | null)[] where null means cache miss
  const cachedValues = await redis.mget<T>(keys);
  const result = new Map<string, T>();
  const missingKeys: string[] = [];

  // Separate cached and missing - handle null values properly
  keys.forEach((key, index) => {
    const value = cachedValues[index];
    if (value !== null && value !== undefined) {
      result.set(key, value);
    } else {
      missingKeys.push(key);
    }
  });

  // Fetch missing from database
  if (missingKeys.length > 0) {
    logger.debug("Batch cache miss", { count: missingKeys.length });
    const fetched = await fetchFn(missingKeys);

    // Store fetched items in cache - only cache non-null values
    const toCache: Record<string, T> = {};
    fetched.forEach((value, key) => {
      result.set(key, value);
      // Only cache non-null/undefined values
      if (value !== null && value !== undefined) {
        toCache[key] = value;
      }
    });

    if (Object.keys(toCache).length > 0) {
      await redis.mset(toCache);
      // Set TTL for each key
      for (const key of Object.keys(toCache)) {
        await redis.expire(key, ttl);
      }
    }
  }

  return result;
}

/**
 * Cache warming helper
 * Pre-populate cache with frequently accessed data
 */
export class CacheWarmer {
  /**
   * Warm user cache
   */
  static async warmUser(userId: string, userData: any): Promise<void> {
    await redis.set(`user:${userId}`, userData, CacheTTL.HOUR);
    logger.debug("Warmed user cache", { userId });
  }

  /**
   * Warm application cache
   */
  static async warmApplication(applicationId: string, applicationData: any): Promise<void> {
    await redis.set(`application:${applicationId}`, applicationData, CacheTTL.MEDIUM);
    logger.debug("Warmed application cache", { applicationId });
  }

  /**
   * Warm feedback cache
   */
  static async warmFeedback(feedbackId: string, feedbackData: any): Promise<void> {
    await redis.set(`feedback:${feedbackId}`, feedbackData, CacheTTL.MEDIUM);
    logger.debug("Warmed feedback cache", { feedbackId });
  }

  /**
   * Warm mentor assignment cache
   */
  static async warmMentorAssignment(mentorId: string, studentId: string, assignmentData: any): Promise<void> {
    await redis.set(`assignment:${mentorId}:${studentId}`, assignmentData, CacheTTL.LONG);
    logger.debug("Warmed mentor assignment cache", { mentorId, studentId });
  }
}

/**
 * Cache statistics helper
 */
export class CacheStats {
  private static hits = 0;
  private static misses = 0;

  static recordHit(): void {
    this.hits++;
  }

  static recordMiss(): void {
    this.misses++;
  }

  static getStats(): { hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  static reset(): void {
    this.hits = 0;
    this.misses = 0;
  }
}
