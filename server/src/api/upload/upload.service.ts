import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../lib/logger';

// File upload configuration
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    logger.info(`Created upload directory: ${UPLOAD_DIR}`);
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${uniqueId}${extension}`;
    cb(null, filename);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Allow only one file per upload
  },
});

// Upload service class
export class UploadService {
  /**
   * Process uploaded file and return file information
   */
  static async processUpload(file: Express.Multer.File, userId: string): Promise<{
    id: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    path: string;
    url: string;
  }> {
    try {
      const fileId = uuidv4();
      const fileUrl = `/api/upload/files/${file.filename}`;
      
      logger.info(`File uploaded successfully: ${file.originalname} by user ${userId}`);
      
      return {
        id: fileId,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        url: fileUrl,
      };
    } catch (error) {
      logger.error('Error processing upload:', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined 
      });
      throw new Error('Failed to process uploaded file');
    }
  }

  /**
   * Get file by filename
   */
  static async getFile(filename: string): Promise<{
    path: string;
    exists: boolean;
  }> {
    try {
      const filePath = path.join(UPLOAD_DIR, filename);
      
      try {
        await fs.access(filePath);
        return { path: filePath, exists: true };
      } catch {
        return { path: filePath, exists: false };
      }
    } catch (error) {
      logger.error('Error getting file:', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined 
      });
      throw new Error('Failed to retrieve file');
    }
  }

  /**
   * Delete file by filename
   */
  static async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(UPLOAD_DIR, filename);
      
      try {
        await fs.unlink(filePath);
        logger.info(`File deleted: ${filename}`);
        return true;
      } catch (error) {
        logger.warn(`Failed to delete file: ${filename}`, { 
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined 
        });
        return false;
      }
    } catch (error) {
      logger.error('Error deleting file:', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined 
      });
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File size ${file.size} exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes` 
      };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return { 
        valid: false, 
        error: `File type ${file.mimetype} not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` 
      };
    }

    return { valid: true };
  }

  /**
   * Get upload statistics
   */
  static async getUploadStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    uploadDir: string;
  }> {
    try {
      await ensureUploadDir();
      const files = await fs.readdir(UPLOAD_DIR);
      let totalSize = 0;

      for (const file of files) {
        try {
          const filePath = path.join(UPLOAD_DIR, file);
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        } catch (error) {
          logger.warn(`Error getting stats for file ${file}:`, { 
            error: error instanceof Error ? error.message : String(error),
            file 
          });
        }
      }

      return {
        totalFiles: files.length,
        totalSize,
        uploadDir: UPLOAD_DIR,
      };
    } catch (error) {
      logger.error('Error getting upload stats:', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined 
      });
      throw new Error('Failed to get upload statistics');
    }
  }

  /**
   * Clean up old files (older than specified days)
   */
  static async cleanupOldFiles(daysOld: number = 30): Promise<number> {
    try {
      await ensureUploadDir();
      const files = await fs.readdir(UPLOAD_DIR);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      let deletedCount = 0;

      for (const file of files) {
        try {
          const filePath = path.join(UPLOAD_DIR, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime < cutoffDate) {
            await fs.unlink(filePath);
            deletedCount++;
            logger.info(`Cleaned up old file: ${file}`);
          }
        } catch (error) {
          logger.warn(`Error cleaning up file ${file}:`, { 
            error: error instanceof Error ? error.message : String(error),
            file 
          });
        }
      }

      logger.info(`Cleanup completed: ${deletedCount} files deleted`);
      return deletedCount;
    } catch (error) {
      logger.error('Error during cleanup:', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined 
      });
      throw new Error('Failed to cleanup old files');
    }
  }
}

// Export multer middleware for use in routes
export { upload as uploadMiddleware };

// Export constants for use in other modules
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  UPLOAD_DIR,
};