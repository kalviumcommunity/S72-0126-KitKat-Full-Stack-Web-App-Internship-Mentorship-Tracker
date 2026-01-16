'use client';

import { ResumeUpload } from './ResumeUpload';

export function ResumeUploadClient({ 
  applicationId, 
  currentResumeUrl 
}: { 
  applicationId: string; 
  currentResumeUrl?: string;
}) {
  const handleUploadComplete = (url: string) => {
    // Show success message
    alert('Resume uploaded successfully!');
    // Redirect back to application page
    window.location.href = `/student/applications/${applicationId}`;
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <ResumeUpload
      applicationId={applicationId}
      currentResumeUrl={currentResumeUrl}
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
    />
  );
}
