import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./lib/logger";
import { monitoring, createMonitoringMiddleware } from "./lib/monitoring";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import compression from "compression";

// Request logging middleware with performance tracking
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  // Add request ID to request object for tracing
  (req as any).requestId = requestId;

  // Log request
  logger.info("Incoming request", {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    
    // Log performance issues
    if (duration > 5000) {
      logger.warn("Slow request detected", {
        requestId,
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }

    logger.info("Request completed", {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id,
    });
  });

  next();
}

// Security headers configuration
function getHelmetConfig() {
  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for API
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  };
}

// CORS configuration
function getCorsConfig() {
  const origins = env.CORS_ORIGIN.split(",").map(origin => origin.trim());
  
  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (origins.includes(origin) || env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        logger.security("CORS violation attempt", { origin, allowedOrigins: origins });
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  };
}

// Rate limiting configuration
function getRateLimitConfig() {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests from this IP, please try again later",
      },
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === env.HEALTH_CHECK_PATH;
    },
    handler: (req) => {
      logger.security("Rate limit exceeded", {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        url: req.url,
      });
    },
  });
}

// 404 handler
function notFoundHandler(req: Request, res: Response) {
  logger.warn("Route not found", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}

// Health check handler with detailed status
function healthCheckHandler(req: Request, res: Response) {
  const healthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "unknown",
    ...monitoring.getHealthMetrics(),
  };

  res.json(healthStatus);
}

export function createApp(): Express {
  const app = express();

  // Trust proxy configuration
  if (env.TRUST_PROXY) {
    app.set("trust proxy", 1);
  }

  // Compression middleware (should be early in the stack)
  app.use(compression());

  // Security headers
  app.use(helmet(getHelmetConfig()));

  // Request logging (skip in test environment)
  if (env.NODE_ENV !== "test") {
    app.use(requestLogger);
    app.use(createMonitoringMiddleware());
  }

  // CORS configuration
  app.use(cors(getCorsConfig()));

  // Body parsing middleware with size limits
  app.use(express.json({ 
    limit: "10mb",
    verify: (req, res, buf) => {
      // Store raw body for webhook verification if needed
      (req as any).rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Rate limiting
  app.use(getRateLimitConfig());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Root endpoint with API information
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "UIMP Backend API 🚀",
      status: "running",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || "0.1.0",
      server: "Unified Internship & Mentorship Portal",
      endpoints: {
        health: env.HEALTH_CHECK_PATH,
        api: "/api",
        docs: "/api/docs (coming soon)"
      },
      features: [
        "Authentication & Authorization",
        "Application Tracking",
        "Mentor-Student Matching",
        "Feedback System",
        "OTP Password Reset",
        "File Upload",
        "Real-time Notifications"
      ]
    });
  });

  // Health check endpoint
  app.get(env.HEALTH_CHECK_PATH, healthCheckHandler);

  // API routes
  app.use("/api", routes);

  // 404 handler for unmatched routes
  app.use(notFoundHandler);

  // Global error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

