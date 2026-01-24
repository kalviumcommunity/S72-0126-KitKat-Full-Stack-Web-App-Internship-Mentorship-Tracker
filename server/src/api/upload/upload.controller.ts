import { Request, Response } from "express";
import { UploadService } from "./upload.service";
import { ApiResponse } from "../../types/api";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, ValidationError } from "../../middlewares/error.middleware";
import { logger } from "../../lib/logger";
import path from "path";

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

    // Validate file
    const validation = UploadService.validateFile(req.file);
    if (!validation.valid) {
      throw new ValidationError(validation.error || "Invalid file");
    }

    const result = await UploadService.processUpload(req.file, req.user.id);

    logger.info("Resume uploaded", {
      userId: req.user.id,
      filename: req.file.originalname,
      size: req.file.size,
      fileId: result.id,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        file: {
          id: result.id,
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          mimetype: result.mimetype,
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

    // Validate file
    const validation = UploadService.validateFile(req.file);
    if (!validation.valid) {
      throw new ValidationError(validation.error || "Invalid file");
    }

    const result = await UploadService.processUpload(req.file, req.user.id);

    logger.info("Profile image uploaded", {
      userId: req.user.id,
      filename: req.file.originalname,
      size: req.file.size,
      fileId: result.id,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        file: {
          id: result.id,
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          mimetype: result.mimetype,
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

    // Validate file
    const validation = UploadService.validateFile(req.file);
    if (!validation.valid) {
      throw new ValidationError(validation.error || "Invalid file");
    }

    const result = await UploadService.processUpload(req.file, req.user.id);

    logger.info("Document uploaded", {
      userId: req.user.id,
      filename: req.file.originalname,
      size: req.file.size,
      fileId: result.id,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        file: {
          id: result.id,
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          mimetype: result.mimetype,
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

    // Validate all files
    for (const file of req.files) {
      const validation = UploadService.validateFile(file);
      if (!validation.valid) {
        throw new ValidationError(`File ${file.originalname}: ${validation.error}`);
      }
    }

    const uploadPromises = req.files.map((file) =>
      UploadService.processUpload(file, req.user!.id)
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
        files: results.map((result) => ({
          id: result.id,
          url: result.url,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
          mimetype: result.mimetype,
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

    const deleted = await UploadService.deleteFile(key);

    if (!deleted) {
      throw new ValidationError("File not found or could not be deleted");
    }

    logger.info("File deleted", {
      userId: req.user.id,
      filename: key,
    });

    const response: ApiResponse = {
      success: true,
      message: "File deleted successfully",
    };

    res.json(response);
  });

  /**
   * Get file by filename
   */
  getFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;

    if (!filename) {
      throw new ValidationError("Filename is required");
    }

    const file = await UploadService.getFile(filename);

    if (!file.exists) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(file.path);
  });

  /**
   * Get signed URL for file (for compatibility)
   */
  getSignedUrl = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { key } = req.params;

    if (!key) {
      throw new ValidationError("File key is required");
    }

    // For local storage, we'll just return the direct URL
    const url = `/api/upload/files/${key}`;

    logger.info("File URL generated", {
      userId: req.user.id,
      filename: key,
    });

    const response: ApiResponse = {
      success: true,
      data: {
        url,
        expiresIn: 3600, // 1 hour (not enforced for local storage)
      },
    };

    res.json(response);
  });

  /**
   * Get upload statistics
   */
  getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const stats = await UploadService.getUploadStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    res.json(response);
  });
}

export const uploadController = new UploadController();
