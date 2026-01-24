/**
 * Express Type Augmentation
 * Centralized type definitions for Express.Request extensions
 */

import { RequestUser } from './api';
import { AccessContext, SecurityContext } from './rbac';

declare global {
  namespace Express {
    interface Request {
      // User authentication context
      user?: RequestUser;
      
      // RBAC context (populated by RBAC middleware)
      accessContext?: AccessContext;
      securityContext?: SecurityContext;
      
      // Express-session support
      sessionID?: string;
      session?: any; // Will be properly typed when express-session is added
    }
  }
}

// Ensure this file is treated as a module
export {};