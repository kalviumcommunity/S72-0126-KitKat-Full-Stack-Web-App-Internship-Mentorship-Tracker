import { env } from "../config/env";
import { logger } from "./logger";

interface ErrorContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  [key: string]: any;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  context?: Record<string, any>;
}

class MonitoringService {
  private errorCount = 0;
  private performanceMetrics: PerformanceMetric[] = [];
  private readonly maxMetricsBuffer = 1000;

  /**
   * Track application errors with context
   */
  trackError(error: Error, context?: ErrorContext): void {
    this.errorCount++;
    
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      context,
    };

    // Log error with full context
    logger.error("Application error tracked", errorData);

    // In production, you would send this to your monitoring service
    // Examples: Sentry, DataDog, New Relic, etc.
    if (env.NODE_ENV === "production") {
      this.sendToMonitoringService(errorData);
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: PerformanceMetric): void {
    // Add to buffer
    this.performanceMetrics.push({
      ...metric,
      timestamp: Date.now(),
    } as any);

    // Keep buffer size manageable
    if (this.performanceMetrics.length > this.maxMetricsBuffer) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetricsBuffer);
    }

    // Log slow operations
    if (metric.duration > 5000) {
      logger.warn("Slow operation detected", {
        name: metric.name,
        duration: `${metric.duration}ms`,
        context: metric.context,
      });
    }

    // Log performance metric
    logger.performance(metric.name, metric.duration, metric.context);
  }

  /**
   * Track security events
   */
  trackSecurityEvent(event: string, context?: ErrorContext): void {
    const securityData = {
      event,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      context,
    };

    logger.security("Security event", securityData);

    // In production, immediately alert security team
    if (env.NODE_ENV === "production") {
      this.sendSecurityAlert(securityData);
    }
  }

  /**
   * Track business metrics
   */
  trackBusinessMetric(metric: string, value: number, context?: Record<string, any>): void {
    const metricData = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      context,
    };

    logger.info("Business metric", metricData);

    // Send to analytics service
    if (env.NODE_ENV === "production") {
      this.sendToAnalytics(metricData);
    }
  }

  /**
   * Get system health metrics
   */
  getHealthMetrics(): Record<string, any> {
    const memoryUsage = process.memoryUsage();
    
    return {
      uptime: process.uptime(),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      },
      cpu: process.cpuUsage(),
      errorCount: this.errorCount,
      performanceMetricsCount: this.performanceMetrics.length,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  /**
   * Performance timing helper
   */
  startTimer(name: string): (context?: Record<string, any>) => void {
    const start = Date.now();
    
    return (context?: Record<string, any>) => {
      const duration = Date.now() - start;
      this.trackPerformance({ name, duration, context });
    };
  }

  /**
   * Async operation wrapper with performance tracking
   */
  async trackAsync<T>(
    name: string,
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const endTimer = this.startTimer(name);
    
    try {
      const result = await operation();
      endTimer({ ...context, success: true });
      return result;
    } catch (error) {
      endTimer({ ...context, success: false, error: (error as Error).message });
      throw error;
    }
  }

  /**
   * Send error to external monitoring service
   */
  private sendToMonitoringService(errorData: any): void {
    // Implement integration with your monitoring service
    // Examples:
    
    // Sentry
    // Sentry.captureException(error, { contexts: { custom: errorData } });
    
    // DataDog
    // dogapi.event.create({ title: 'Application Error', text: errorData.message });
    
    // New Relic
    // newrelic.recordCustomEvent('ApplicationError', errorData);
    
    // For now, just log that we would send it
    logger.debug("Would send error to monitoring service", { errorData });
  }

  /**
   * Send security alert
   */
  private sendSecurityAlert(securityData: any): void {
    // Implement security alerting
    // Examples:
    // - Send to security team via email/Slack
    // - Create incident in PagerDuty
    // - Log to SIEM system
    
    logger.debug("Would send security alert", { securityData });
  }

  /**
   * Send to analytics service
   */
  private sendToAnalytics(metricData: any): void {
    // Implement analytics integration
    // Examples:
    // - Google Analytics
    // - Mixpanel
    // - Custom analytics service
    
    logger.debug("Would send to analytics", { metricData });
  }

  /**
   * Reset metrics (useful for testing)
   */
  reset(): void {
    this.errorCount = 0;
    this.performanceMetrics = [];
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

// Middleware helper for Express
export function createMonitoringMiddleware() {
  return (req: any, res: any, next: any) => {
    const endTimer = monitoring.startTimer(`${req.method} ${req.route?.path || req.path}`);
    
    // Add monitoring to request object
    req.monitoring = monitoring;
    
    // Track when response finishes
    res.on('finish', () => {
      endTimer({
        statusCode: res.statusCode,
        method: req.method,
        path: req.path,
        userId: req.user?.id,
        ip: req.ip,
      });
    });
    
    next();
  };
}