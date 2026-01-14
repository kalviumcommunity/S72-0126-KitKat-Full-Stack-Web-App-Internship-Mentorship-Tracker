import { config } from "dotenv";

config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3001", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_URL: process.env.REDIS_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  
  // Storage Configuration
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "local", // s3, azure, local
  
  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "",
  
  // Azure Blob Storage
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
  AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY || "",
  AZURE_STORAGE_CONTAINER: process.env.AZURE_STORAGE_CONTAINER || "uploads",
  
  // Local Storage
  LOCAL_UPLOAD_DIR: process.env.LOCAL_UPLOAD_DIR || "./uploads",
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "",
} as const;

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

if (env.NODE_ENV === "production") {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
}

