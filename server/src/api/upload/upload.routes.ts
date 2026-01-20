import { Router } from "express";
import { uploadController } from "./upload.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  uploadResume,
  uploadImage,
  uploadDocument,
  uploadMultipleDocuments,
  handleMulterError,
} from "../../middlewares/upload.middleware";
import { rateLimit } from "../../middlewares/rate-limit.middleware";

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Rate limiter for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 uploads per 15 minutes
  message: "Too many upload requests, please try again later",
});

/**
 * @route   POST /api/upload/resume
 * @desc    Upload resume file (PDF, DOC, DOCX)
 * @access  Private
 */
router.post(
  "/resume",
  uploadLimiter,
  uploadResume,
  handleMulterError,
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
  uploadImage,
  handleMulterError,
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
  uploadDocument,
  handleMulterError,
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
  uploadMultipleDocuments,
  handleMulterError,
  uploadController.uploadMultipleDocuments
);

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

export default router;
