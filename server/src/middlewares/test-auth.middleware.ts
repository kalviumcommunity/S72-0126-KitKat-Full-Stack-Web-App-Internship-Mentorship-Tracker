/**
 * Test Authentication Middleware
 * Simplified JWT middleware for testing the RBAC system
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import { getTestUserById } from '../data/test-users';
import { AuthenticationError } from './error.middleware';
import { logger } from '../lib/logger';

/**
 * Simple JWT authentication middleware for testing
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    
    // Get user details from test data
    const user = await getTestUserById(decoded.id);
    
    if (!user || !user.isActive) {
      throw new AuthenticationError('Invalid or inactive user');
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };

    logger.debug('User authenticated', {
      userId: user.id,
      role: user.role,
      path: req.path
    });

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      logger.error('Authentication error', { error });
      next(new AuthenticationError('Invalid authentication token'));
    }
  }
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      const user = await getTestUserById(decoded.id);
      
      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId
        };
      }
    }

    next();
  } catch (error) {
    // Ignore authentication errors for optional auth
    logger.debug('Optional auth failed, continuing without user', { error });
    next();
  }
}