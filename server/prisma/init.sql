-- Initial database setup for UIMP
-- This file is used by Docker Compose to initialize the PostgreSQL database

-- Create the database if it doesn't exist
-- Note: This is handled by Docker Compose environment variables

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The actual schema will be created by Prisma migrations
-- This file just ensures the database is ready for Prisma