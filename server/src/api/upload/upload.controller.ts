import { Request, Response } from "express";
import { storage } from "../../lib/storage";
import { ApiResponse } from "../../types/api";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, ValidationError } from "../../middlewares/error.middleware";
import { logger } from "../../lib/logger";

export class UploadController {
  /**
   * Upload resume file
   */
  uploadResume = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (!req.file) {
      throw new ValidationError("No file uploaded");
    }

    const result = await storage.upload({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      folder: "resumes",
      userId: req.user.id,
    });

    logger.info("Resume uploaded", {
      userId: req.user.id,
      filename: req.file.originalname,
      size: req.file.size,
      key: result.key,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        file: {
          url: result.url,
          key: result.key,
          size: result.size,
          mimeType: result.mimeType,
          originalName: req.file.originalname,
        },
      },
      message: "Resume uploaded successfully",
    };

    res.status(201).json(response);
  });

  /**
   * Upload profile image
   */
  uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (!req.file) {
      throw new ValidationError("No file uploaded");
    }

    const result = await storage.upload({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      folder: "profile-images",
      userId: req.user.id,
    });

    logger.info("Profile image uploaded", {
      userId: req.user.id,
      filename: req.file.originalname,
      size: req.file.size,
      key: result.key,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        file: {
          url: result.url,
          key: result.key,
          size: result.size,
          mimeType: result.mimeType,
          originalName: req.file.originalname,
        },
      },
      message: "Profile image uploaded successfully",
    };

    res.status(201).json(response);
  });

  /**
   * Upload document
   */
  uploadDocument = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (!req.file) {
      throw new ValidationError("No file uploaded");
    }

    const result = await storage.upload({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      folder: "documents",
      userId: req.user.id,
    });

    logger.info("Document uploaded", {
      userId: req.user.id,
      filename: req.file.originalname,
      size: req.file.size,
      key: result.key,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        file: {
          url: result.url,
          key: result.key,
          size: result.size,
          mimeType: result.mimeType,
          originalName: req.file.originalname,
        },
      },
      message: "Document uploaded successfully",
    };

    res.status(201).json(response);
  });

  /**
   * Upload multiple documents
   */
  uploadMultipleDocuments = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ValidationError("No files uploaded");
    }

    const uploadPromises = req.files.map((file) =>
      storage.upload({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
        folder: "documents",
        userId: req.user!.id,
      })
    );

    const results = await Promise.all(uploadPromises);

    logger.info("Multiple documents uploaded", {
      userId: req.user.id,
      count: results.length,
      totalSize: req.files.reduce((sum, file) => sum + file.size, 0),
    });

    const response: ApiResponse = {
      success: true,
      data: {
        files: results.map((result, index) => ({
          url: result.url,
          key: result.key,
          size: result.size,
          mimeType: result.mimeType,
          originalName: Array.isArray(req.files) ? req.files[index].originalname : 'unknown',
        })),
      },
      message: `${results.length} documents uploaded successfully`,
    };

    res.status(201).json(response);
  });

  /**
   * Delete file
   */
  deleteFile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { key } = req.params;

    if (!key) {
      throw new ValidationError("File key is required");
    }

    // Verify the file belongs to the user (key should contain userId)
    if (!key.includes(req.user.id)) {
      throw new ValidationError("You can only delete your own files");
    }

    await storage.delete(key);

    logger.info("File deleted", {
      userId: req.user.id,
      key,
    });

    const response: ApiResponse = {
      success: true,
      message: "File deleted successfully",
    };

    res.json(response);
  });

  /**
   * Get signed URL for file
   */
  getSignedUrl = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { key } = req.params;
    const expiresIn = parseInt(req.query.expiresIn as string) || 3600;

    if (!key) {
      throw new ValidationError("File key is required");
    }

    const url = await storage.getSignedUrl(key, expiresIn);

    logger.info("Signed URL generated", {
      userId: req.user.id,
      key,
      expiresIn,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        url,
        expiresIn,
      },
    };

    res.json(response);
  });
}

export const uploadController = new UploadController();
