import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./lib/logger";

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API routes
  app.use("/api", routes);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

