'use client';

// Resume Upload Component - Client Component
// Handles resume file upload with progress tracking

import { useState, useRef, ChangeEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { applications } from '@/lib/api';

interface ResumeUploadProps {
  applicationId: string;
  currentResumeUrl?: string;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function ResumeUpload({ 
  applicationId, 
  currentResumeUrl,
  onUploadComplete,
  onUploadError 
}: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(currentResumeUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (!file) {
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file
      const response = await applications.uploadResume(applicationId, selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data) {
        setUploadedUrl(response.data.url);
        setSelectedFile(null);
        
        if (onUploadComplete) {
          onUploadComplete(response.data.url);
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resume Upload</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload your resume (PDF or Word document, max 5MB)
            </p>
          </div>

          {/* Current Resume */}
          {uploadedUrl && !selectedFile && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📄</div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Resume uploaded</p>
                    <a 
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-800 hover:underline"
                    >
                      View current resume →
                    </a>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Replace
                </Button>
              </div>
            </div>
          )}

          {/* File Input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {!selectedFile && !uploadedUrl && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload resume
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, or DOCX (max 5MB)
                  </p>
                </div>
              </button>
            )}

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">📄</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={handleRemoveFile}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {!isUploading && (
                  <div className="mt-3">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full"
                    >
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{uploadError}</p>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-medium">Upload Guidelines:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Accepted formats: PDF, DOC, DOCX</li>
              <li>Maximum file size: 5MB</li>
              <li>Ensure your resume is up-to-date</li>
              <li>Use a professional file name</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}