import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./lib/logger";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

// Request logging middleware
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  // Log request
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).user?.id,
    });
  });

  next();
}



// 404 handler
function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}

export function createApp(): Express {
  const app = express();

  // Trust proxy (for accurate IP addresses behind load balancers)
  app.set("trust proxy", 1);

  // Security headers (Helmet)
  app.use(helmet());

  // Request logging
  if (env.NODE_ENV !== "test") {
    app.use(requestLogger);
  }

  // CORS configuration
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }));

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again later",
  });
  app.use(limiter);

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Root endpoint - Hello from backend
  app.get("/", (_req, res) => {
    res.json({
      message: "Hello from backend! 🚀",
      status: "running",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || "0.1.0",
      server: "UIMP Backend API",
      endpoints: {
        health: "/health",
        api: "/api",
        docs: "/api/docs (coming soon)"
      }
    });
  });

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || "unknown",
    });
  });

  // API routes
  app.use("/api", routes);

  // 404 handler for unmatched routes
  app.use(notFoundHandler);

  // Global error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

