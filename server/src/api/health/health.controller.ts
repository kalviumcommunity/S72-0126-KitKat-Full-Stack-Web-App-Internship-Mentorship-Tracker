import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../../middlewares/async-handler.middleware';
import { ApiResponse } from '../../types/api-response';

const prisma = new PrismaClient();

export const healthController = {
  // GET /api/health
  getHealth: asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    
    // Check database connection
    let databaseStatus = 'disconnected';
    let databaseLatency = 0;
    
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      databaseLatency = Date.now() - dbStart;
      databaseStatus = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
      databaseStatus = 'error';
    }

    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
    };

    const healthData = {
      status: databaseStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: databaseStatus,
        latency: `${databaseLatency}ms`,
      },
      memory: memoryUsageMB,
      responseTime: `${Date.now() - startTime}ms`,
      pid: process.pid,
      platform: process.platform,
      nodeVersion: process.version,
    };

    const response: ApiResponse = {
      success: databaseStatus === 'connected',
      data: healthData,
    };

    // Return 503 if unhealthy for load balancer health checks
    const statusCode = databaseStatus === 'connected' ? 200 : 503;
    
    res.status(statusCode).json(response);
  }),

  // GET /api/health/ready
  getReadiness: asyncHandler(async (req: Request, res: Response) => {
    // Readiness check - more comprehensive than health check
    const checks = {
      database: false,
      memory: false,
      disk: false,
    };

    // Database check
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      console.error('Database readiness check failed:', error);
    }

    // Memory check (fail if using more than 90% of available memory)
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    checks.memory = memoryUsagePercent < 90;

    // Simple disk check (check if we can write to temp)
    try {
      const fs = require('fs');
      const path = require('path');
      const tempFile = path.join('/tmp', `health-check-${Date.now()}`);
      fs.writeFileSync(tempFile, 'test');
      fs.unlinkSync(tempFile);
      checks.disk = true;
    } catch (error) {
      console.error('Disk readiness check failed:', error);
    }

    const allChecksPass = Object.values(checks).every(check => check === true);

    const response: ApiResponse = {
      success: allChecksPass,
      data: {
        ready: allChecksPass,
        checks,
        timestamp: new Date().toISOString(),
      },
    };

    res.status(allChecksPass ? 200 : 503).json(response);
  }),

  // GET /api/health/live
  getLiveness: asyncHandler(async (req: Request, res: Response) => {
    // Liveness check - basic check that the application is running
    const response: ApiResponse = {
      success: true,
      data: {
        alive: true,
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        pid: process.pid,
      },
    };

    res.status(200).json(response);
  }),
};