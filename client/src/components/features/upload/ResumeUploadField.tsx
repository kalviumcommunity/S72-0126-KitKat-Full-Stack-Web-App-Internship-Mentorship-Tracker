'use client';

// Resume Upload Field Component - Client Component
// Compact resume upload field for forms

import { useState, useRef, ChangeEvent } from 'react';

import { Button } from '@/components/ui/Button';

interface ResumeUploadFieldProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
  currentResumeUrl?: string;
}

export function ResumeUploadField({ 
  value,
  onChange,
  error,
  disabled = false,
  currentResumeUrl
}: ResumeUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValidationError(null);

    if (!file) {
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setValidationError('File size exceeds 5MB limit.');
      return;
    }

    setSelectedFile(file);
    if (onChange) {
      onChange(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const displayError = error || validationError;

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Current Resume Display */}
      {currentResumeUrl && !selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📄</span>
            <div>
              <p className="text-sm font-medium text-gray-900">Current Resume</p>
              <a 
                href={currentResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                View resume →
              </a>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Replace
          </Button>
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="text-lg">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-600">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-600 ml-2"
              title="Remove file"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Upload Button (when no file selected) */}
      {!selectedFile && !currentResumeUrl && (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full"
        >
          📎 Choose Resume File
        </Button>
      )}

      {/* Error Message */}
      {displayError && (
        <p className="text-sm text-red-600">{displayError}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        PDF, DOC, or DOCX (max 5MB)
      </p>
    </div>
  );
}