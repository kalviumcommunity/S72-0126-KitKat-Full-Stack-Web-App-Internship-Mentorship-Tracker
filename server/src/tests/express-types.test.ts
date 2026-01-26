/**
 * Type validation tests for Express Request augmentation
 * These tests ensure our type definitions are working correctly
 */

import { Request } from 'express';
import { RequestUser } from '../api';
import { AccessContext, SecurityContext } from '../rbac';
import '../express.d'; // Import our type augmentation

describe('Express Type Augmentation', () => {
  it('should have correct RequestUser type with organizationId', () => {
    const mockUser: RequestUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'STUDENT' as any,
      organizationId: 'org-456', // This should not cause TypeScript error
      iat: 1234567890,
      exp: 1234567890
    };

    // Type assertion to ensure req.user accepts our RequestUser type
    const mockReq = {} as Request;
    mockReq.user = mockUser; // This should not cause TypeScript error

    expect(mockUser.organizationId).toBe('org-456');
    expect(mockReq.user?.organizationId).toBe('org-456');
  });

  it('should have optional sessionID property', () => {
    const mockReq = {} as Request;
    mockReq.sessionID = 'session-123'; // This should not cause TypeScript error
    
    expect(typeof mockReq.sessionID).toBe('string');
  });

  it('should have optional accessContext and securityContext', () => {
    const mockReq = {} as Request;
    
    const mockAccessContext: AccessContext = {
      userId: 'user-123',
      role: 'STUDENT' as any,
      permissions: [],
      organizationId: 'org-456'
    };

    const mockSecurityContext: SecurityContext = {
      sessionId: 'session-123',
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      lastActivity: new Date(),
      riskScore: 0,
      mfaVerified: false
    };

    mockReq.accessContext = mockAccessContext; // Should not cause TypeScript error
    mockReq.securityContext = mockSecurityContext; // Should not cause TypeScript error

    expect(mockReq.accessContext?.userId).toBe('user-123');
    expect(mockReq.securityContext?.sessionId).toBe('session-123');
  });

  it('should allow undefined values for all optional properties', () => {
    const mockReq = {} as Request;
    
    // All these should be undefined by default and not cause TypeScript errors
    expect(mockReq.user).toBeUndefined();
    expect(mockReq.sessionID).toBeUndefined();
    expect(mockReq.accessContext).toBeUndefined();
    expect(mockReq.securityContext).toBeUndefined();
  });
});