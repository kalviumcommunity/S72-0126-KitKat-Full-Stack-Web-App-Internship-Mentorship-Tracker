import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from '../lib/logger';

/**
 * Mail configuration for Mailtrap Sandbox SMTP
 * Production-ready setup with proper error handling and validation
 */

// Validate email configuration
function validateEmailConfig(): void {
  const requiredFields = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  const missingFields = requiredFields.filter(field => !env[field as keyof typeof env]);
  
  if (missingFields.length > 0) {
    logger.warn(`Missing email configuration: ${missingFields.join(', ')}. Email functionality will be disabled.`);
  }
}

// Create transporter with Mailtrap Sandbox SMTP configuration
export const createMailTransporter = () => {
  validateEmailConfig();
  
  // Return null if email is not configured (graceful degradation)
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn('Email configuration incomplete. Email functionality disabled.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    // Mailtrap Sandbox specific settings
    secure: false, // Mailtrap uses STARTTLS, not SSL
    requireTLS: true,
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      logger.error('SMTP connection verification failed:', error);
    } else {
      logger.info('SMTP server connection verified successfully');
    }
  });

  return transporter;
};

// Singleton transporter instance
let transporterInstance: nodemailer.Transporter | null = null;

export const getMailTransporter = (): nodemailer.Transporter | null => {
  if (!transporterInstance) {
    transporterInstance = createMailTransporter();
  }
  return transporterInstance;
};

// Default mail options
export const getDefaultMailOptions = () => ({
  from: {
    name: env.SMTP_FROM_NAME,
    address: env.SMTP_FROM,
  },
});

// Mail configuration status
export const isMailConfigured = (): boolean => {
  return !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM);
};