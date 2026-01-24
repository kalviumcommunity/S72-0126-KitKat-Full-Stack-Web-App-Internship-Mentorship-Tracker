// Application Edit Page - Client Component
// Allows students to edit their application details

import { Metadata } from 'next/types';
import { notFound } from 'next/navigation';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { ApplicationEditForm } from '@/components/features/applications/ApplicationEditForm';
import { ApplicationPlatform, ApplicationStatus } from '@/lib/types';

// Mock function to get application by ID for editing
async function getApplicationForEdit(id: string) {
  // TODO: Replace with actual API call
  // const response = await applications.getById(id);
  
  // Mock data for development
  const mockApplication = {
    id: id,
    userId: 'mock-user-id',
    company: 'Google',
    role: 'Software Engineer Intern',
    platform: ApplicationPlatform.COMPANY_WEBSITE,
    status: ApplicationStatus.INTERVIEW,
    resumeUrl: '/resumes/resume-google.pdf',
    notes: 'Applied through university career portal. Completed online assessment successfully. Technical interview scheduled for next week. Need to prepare system design questions and review data structures.',
    deadline: '2024-01-20T23:59:59Z',
    appliedDate: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  };

  // Simulate not found
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
  const application = await getApplicationForEdit(params.id);
  
  if (!application) {
    return {
      title: 'Application Not Found - UIMP',
    };
  }

  return {
    title: `Edit ${application.company} Application | UIMP`,
    description: `Edit your ${application.company} ${application.role} application`,
  };
}

interface ApplicationEditPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationEditPage({ 
  params 
}: ApplicationEditPageProps) {
  const application = await getApplicationForEdit(params.id);

  if (!application) {
    notFound();
  }

  return (
    <StudentRoute>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
          <p className="text-gray-600 mt-1">
            Update your {application.company} {application.role} application details
          </p>
        </div>

        {/* Edit Form */}
        <ApplicationEditForm application={application} />
      </div>
    </StudentRoute>
  );
}