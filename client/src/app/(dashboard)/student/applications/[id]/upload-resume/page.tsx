// Resume Upload Page - Server Component
// Dedicated page for uploading resume to an application

import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { ResumeUploadClient } from '@/components/features/upload/ResumeUploadClient';

// Mock function to get application
async function getApplication(id: string) {
  // TODO: Replace with actual API call
  
  // Mock data
  const mockApplication = {
    id: id,
    company: 'Google',
    role: 'Software Engineer Intern',
    resumeUrl: undefined, // or existing resume URL
  };

  if (id === 'not-found') {
    return null;
  }

  return mockApplication;
}

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const application = await getApplication(params.id);
  
  if (!application) {
    return {
      title: 'Application Not Found - UIMP',
    };
  }

  return {
    title: `Upload Resume - ${application.company} | UIMP`,
    description: `Upload your resume for ${application.company} ${application.role} application`,
  };
}

interface ResumeUploadPageProps {
  params: {
    id: string;
  };
}

export default async function ResumeUploadPage({ params }: ResumeUploadPageProps) {
  const application = await getApplication(params.id);

  if (!application) {
    notFound();
  }

  return (
    <StudentRoute>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link href={`/student/applications/${application.id}`}>
            <Button variant="outline" size="sm" className="mb-4">
              ← Back to Application
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Resume</h1>
          <p className="text-gray-600 mt-1">
            {application.company} - {application.role}
          </p>
        </div>

        {/* Upload Component */}
        <ResumeUploadClient 
          applicationId={application.id}
          currentResumeUrl={application.resumeUrl}
        />

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Resume Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tailor your resume to match the job description</li>
            <li>• Highlight relevant skills and experiences</li>
            <li>• Keep it concise (1-2 pages)</li>
            <li>• Use action verbs and quantify achievements</li>
            <li>• Proofread for errors and formatting</li>
          </ul>
        </div>
      </div>
    </StudentRoute>
  );
}
