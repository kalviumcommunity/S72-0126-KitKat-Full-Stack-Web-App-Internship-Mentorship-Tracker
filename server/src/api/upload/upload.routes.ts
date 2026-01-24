import { Router } from "express";
import { uploadController } from "./upload.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "./upload.service";
import { createUserRateLimit } from "../../middlewares/rate-limit.middleware";

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Rate limiter for uploads
const uploadLimiter = createUserRateLimit(20, 15 * 60 * 1000); // 20 uploads per 15 minutes

/**
 * @route   POST /api/upload/resume
 * @desc    Upload resume file (PDF, DOC, DOCX)
 * @access  Private
 */
router.post(
  "/resume",
  uploadLimiter,
  uploadMiddleware.single('file'),
  uploadController.uploadResume
);

/**
 * @route   POST /api/upload/profile-image
 * @desc    Upload profile image (JPEG, PNG, WebP)
 * @access  Private
 */
router.post(
  "/profile-image",
  uploadLimiter,
  uploadMiddleware.single('file'),
  uploadController.uploadProfileImage
);

/**
 * @route   POST /api/upload/document
 * @desc    Upload document (PDF, DOC, DOCX, XLS, XLSX, TXT)
 * @access  Private
 */
router.post(
  "/document",
  uploadLimiter,
  uploadMiddleware.single('file'),
  uploadController.uploadDocument
);

/**
 * @route   POST /api/upload/documents
 * @desc    Upload multiple documents (max 5)
 * @access  Private
 */
router.post(
  "/documents",
  uploadLimiter,
  uploadMiddleware.array('files', 5),
  uploadController.uploadMultipleDocuments
);

/**
 * @route   GET /api/upload/files/:filename
 * @desc    Get uploaded file
 * @access  Public (files are served directly)
 */
router.get("/files/:filename", uploadController.getFile);

/**
 * @route   DELETE /api/upload/:key
 * @desc    Delete uploaded file
 * @access  Private
 */
router.delete("/:key", uploadController.deleteFile);

/**
 * @route   GET /api/upload/signed-url/:key
 * @desc    Get signed URL for file access
 * @access  Private
 */
router.get("/signed-url/:key", uploadController.getSignedUrl);

/**
 * @route   GET /api/upload/stats
 * @desc    Get upload statistics
 * @access  Private
 */
router.get("/stats", uploadController.getStats);

export default router;
