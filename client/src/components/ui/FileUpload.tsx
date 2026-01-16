import React, { useCallback, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';

export interface FileUploadProps {
    onFileSelect: (file: File) => void;
    acceptedFileTypes?: string[]; // e.g. ['.pdf', '.doc', '.docx']
    maxFileSize?: number; // in bytes
    label?: string;
    className?: string;
    error?: string;
    helperText?: string;
    isUploading?: boolean;
    uploadProgress?: number;
}

export function FileUpload({
    onFileSelect,
    acceptedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'],
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    label = 'Upload File',
    className,
    error,
    helperText,
    isUploading = false,
    uploadProgress = 0,
}: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isUploading) setIsDragOver(true);
    }, [isUploading]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isUploading) setIsDragOver(true);
    }, [isUploading]);

    const validateFile = (file: File): boolean => {
        setLocalError(null);

        // Check size
        if (file.size > maxFileSize) {
            setLocalError(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`);
            return false;
        }

        // Check type (extension based for simplicity, or mime type)
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isExtensionValid = acceptedFileTypes.some(type =>
            type.toLowerCase() === fileExtension || file.type.match(new RegExp(type.replace('.', ''), 'i'))
        );

        if (!isExtensionValid) {
            setLocalError(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
            return false;
        }

        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    }, [isUploading, maxFileSize, acceptedFileTypes, onFileSelect]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    };

    const handleRemoveFile = () => {
        if (isUploading) return;
        setSelectedFile(null);
        setLocalError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        if (!isUploading) inputRef.current?.click();
    };

    const effectiveError = error || localError;

    return (
        <div className={cn("w-full space-y-2", className)}>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

            <div
                onClick={triggerFileInput}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-all duration-300",
                    isDragOver
                        ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                        : "border-gray-200 bg-gray-50/30 hover:bg-gray-50 hover:border-blue-300",
                    (effectiveError) && "border-red-300 bg-red-50/30",
                    isUploading && "opacity-75 cursor-not-allowed"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleInputChange}
                    disabled={isUploading}
                />

                {selectedFile ? (
                    <div className="w-full px-6 py-4 flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                            📄
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[200px]">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>

                        {isUploading ? (
                            <div className="w-full max-w-xs mt-2">
                                <ProgressBar value={uploadProgress} showLabel />
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                Remove File
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <div className={cn(
                            "w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-colors duration-300",
                            isDragOver ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                        )}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                            {acceptedFileTypes.join(', ')} (Max {Math.round(maxFileSize / 1024 / 1024)}MB)
                        </p>
                    </div>
                )}
            </div>

            {effectiveError && (
                <p className="text-xs font-medium text-red-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {effectiveError}
                </p>
            )}
            {helperText && !effectiveError && <p className="text-xs text-gray-500">{helperText}</p>}
        </div>
    );
}
