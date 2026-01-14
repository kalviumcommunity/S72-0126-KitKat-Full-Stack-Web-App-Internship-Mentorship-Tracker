import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ValidationError } from "./error.middleware";
import { FileValidation } from "../lib/storage";
import { logger } from "../lib/logger";

// File size limits (in MB)
const FILE_SIZE_LIMITS = {
  resume: 5, // 5MB
  image: 2, // 2MB
  document: 10, // 10MB
};

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const createFileFilter = (category: "resume" | "image" | "document") => {
  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Validate filename
    if (!FileValidation.isValidFileName(file.originalname)) {
      logger.warn("Invalid filename detected", {
        filename: file.originalname,
        userId: (req as any).user?.id,
      });
      return cb(new ValidationError("Invalid filename"));
    }

    // Validate file type
    const allowedTypes = FileValidation.getAllowedMimeTypes(category);
    if (!FileValidation.isValidFileType(file.mimetype, allowedTypes)) {
      logger.warn("Invalid file type", {
        mimeType: file.mimetype,
        allowedTypes,
        userId: (req as any).user?.id,
      });
      return cb(
        new ValidationError(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        )
      );
    }

    cb(null, true);
  };
};

// Create upload middleware for different file types
export const uploadResume = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.resume * 1024 * 1024,
    files: 1,
  },
  fileFilter: createFileFilter("resume"),
}).single("resume");

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.image * 1024 * 1024,
    files: 1,
  },
  fileFilter: createFileFilter("image"),
}).single("image");

export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.document * 1024 * 1024,
    files: 1,
  },
  fileFilter: createFileFilter("document"),
}).single("document");

export const uploadMultipleDocuments = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.document * 1024 * 1024,
    files: 5, // Max 5 files
  },
  fileFilter: createFileFilter("document"),
}).array("documents", 5);

// Error handler for multer errors
export const handleMulterError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    logger.error("Multer error", {
      error: error.message,
      code: error.code,
      field: error.field,
      userId: (req as any).user?.id,
    });

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "File size exceeds the maximum limit",
        },
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: {
          code: "TOO_MANY_FILES",
          message: "Too many files uploaded",
        },
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: {
          code: "UNEXPECTED_FILE",
          message: "Unexpected file field",
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: {
        code: "UPLOAD_ERROR",
        message: error.message,
      },
    });
  }

  next(error);
};
