import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { env } from "../config/env";
import { logger } from "./logger";
import crypto from "crypto";
import path from "path";

export type StorageProvider = "s3" | "azure" | "local";

export interface UploadOptions {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
  userId?: string;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export interface StorageService {
  upload(options: UploadOptions): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  getPublicUrl(key: string): string;
}

/**
 * AWS S3 Storage Service
 */
class S3StorageService implements StorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = env.AWS_S3_BUCKET;
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      const key = this.generateKey(options.originalName, options.folder, options.userId);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: options.buffer,
        ContentType: options.mimeType,
        Metadata: {
          originalName: options.originalName,
          uploadedBy: options.userId || "unknown",
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);

      logger.info("File uploaded to S3", {
        key,
        size: options.buffer.length,
        mimeType: options.mimeType,
      });

      return {
        url: this.getPublicUrl(key),
        key,
        size: options.buffer.length,
        mimeType: options.mimeType,
      };
    } catch (error) {
      logger.error("S3 upload error", { error, options });
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);

      logger.info("File deleted from S3", { key });
    } catch (error) {
      logger.error("S3 delete error", { error, key });
      throw new Error(`Failed to delete file from S3: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      logger.error("S3 signed URL error", { error, key });
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  private generateKey(originalName: string, folder?: string, userId?: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString("hex");
    const filename = `${timestamp}-${random}${ext}`;

    const parts = [folder, userId, filename].filter(Boolean);
    return parts.join("/");
  }
}

/**
 * Azure Blob Storage Service
 */
class AzureBlobStorageService implements StorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const accountName = env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;
    
    if (!accountName || !accountKey) {
      throw new Error("Azure Storage credentials not configured");
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    this.blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
    this.containerName = env.AZURE_STORAGE_CONTAINER || "uploads";
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      const key = this.generateKey(options.originalName, options.folder, options.userId);
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(key);

      await blockBlobClient.upload(options.buffer, options.buffer.length, {
        blobHTTPHeaders: {
          blobContentType: options.mimeType,
        },
        metadata: {
          originalName: options.originalName,
          uploadedBy: options.userId || "unknown",
          uploadedAt: new Date().toISOString(),
        },
      });

      logger.info("File uploaded to Azure Blob", {
        key,
        size: options.buffer.length,
        mimeType: options.mimeType,
      });

      return {
        url: this.getPublicUrl(key),
        key,
        size: options.buffer.length,
        mimeType: options.mimeType,
      };
    } catch (error) {
      logger.error("Azure Blob upload error", { error, options });
      throw new Error(`Failed to upload file to Azure Blob: ${error}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(key);

      await blockBlobClient.delete();

      logger.info("File deleted from Azure Blob", { key });
    } catch (error) {
      logger.error("Azure Blob delete error", { error, key });
      throw new Error(`Failed to delete file from Azure Blob: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(key);

      const expiresOn = new Date(Date.now() + expiresIn * 1000);
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions: "r",
        expiresOn,
      });

      return sasUrl;
    } catch (error) {
      logger.error("Azure Blob signed URL error", { error, key });
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }

  getPublicUrl(key: string): string {
    const accountName = env.AZURE_STORAGE_ACCOUNT_NAME;
    return `https://${accountName}.blob.core.windows.net/${this.containerName}/${key}`;
  }

  private generateKey(originalName: string, folder?: string, userId?: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString("hex");
    const filename = `${timestamp}-${random}${ext}`;

    const parts = [folder, userId, filename].filter(Boolean);
    return parts.join("/");
  }
}

/**
 * Local File Storage Service (for development)
 */
class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = env.LOCAL_UPLOAD_DIR || "./uploads";
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    // For local storage, we'll just return a mock result
    // In production, you'd save to filesystem
    const key = this.generateKey(options.originalName, options.folder, options.userId);

    logger.info("File uploaded locally (mock)", {
      key,
      size: options.buffer.length,
      mimeType: options.mimeType,
    });

    return {
      url: this.getPublicUrl(key),
      key,
      size: options.buffer.length,
      mimeType: options.mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    logger.info("File deleted locally (mock)", { key });
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return this.getPublicUrl(key);
  }

  getPublicUrl(key: string): string {
    return `http://localhost:${env.PORT}/uploads/${key}`;
  }

  private generateKey(originalName: string, folder?: string, userId?: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString("hex");
    const filename = `${timestamp}-${random}${ext}`;

    const parts = [folder, userId, filename].filter(Boolean);
    return parts.join("/");
  }
}

/**
 * Storage Factory
 */
class StorageFactory {
  private static instance: StorageService | null = null;

  static getStorage(): StorageService {
    if (this.instance) {
      return this.instance;
    }

    const provider = (env.STORAGE_PROVIDER || "local") as StorageProvider;

    switch (provider) {
      case "s3":
        if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET) {
          logger.warn("S3 credentials not configured, falling back to local storage");
          this.instance = new LocalStorageService();
        } else {
          this.instance = new S3StorageService();
          logger.info("Using S3 storage provider");
        }
        break;

      case "azure":
        if (!env.AZURE_STORAGE_ACCOUNT_NAME || !env.AZURE_STORAGE_ACCOUNT_KEY) {
          logger.warn("Azure credentials not configured, falling back to local storage");
          this.instance = new LocalStorageService();
        } else {
          this.instance = new AzureBlobStorageService();
          logger.info("Using Azure Blob storage provider");
        }
        break;

      case "local":
      default:
        this.instance = new LocalStorageService();
        logger.info("Using local storage provider");
        break;
    }

    return this.instance;
  }

  static resetInstance(): void {
    this.instance = null;
  }
}

// Export singleton instance
export const storage = StorageFactory.getStorage();

// File validation helpers
export const FileValidation = {
  isValidFileSize: (size: number, maxSizeMB: number = 5): boolean => {
    return size <= maxSizeMB * 1024 * 1024;
  },

  isValidFileType: (mimeType: string, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(mimeType);
  },

  isValidFileName: (filename: string): boolean => {
    // Check for valid filename (no path traversal)
    return !filename.includes("..") && !filename.includes("/") && !filename.includes("\\");
  },

  getAllowedMimeTypes: (category: "resume" | "image" | "document"): string[] => {
    switch (category) {
      case "resume":
        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
      case "image":
        return ["image/jpeg", "image/png", "image/webp", "image/gif"];
      case "document":
        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
        ];
      default:
        return [];
    }
  },
};
