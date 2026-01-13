// Application Detail Page - Server Component
// Displays detailed view of a single application

import { Metadata } from 'next/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ApplicationStatusBadge } from '@/components/features/applications/ApplicationStatusBadge';
import { ApplicationDetailView } from '@/components/features/applications/ApplicationDetailView';

// Mock function to get application by ID
async function getApplication(id: string) {
  // TODO: Replace with actual API call
  // const response = await applications.getById(id);
  
  // Mock data for development
  const mockApplication = {
    id: id,
    userId: 'mock-user-id',
    company: 'Google',
    role: 'Software Engineer Intern',
    platform: 'COMPANY_WEBSITE' as const,
    status: 'INTERVIEW' as const,
    resumeUrl: '/resumes/resume-google.pdf',
    notes: 'Applied through university career portal. Completed online assessment successfully. Technical interview scheduled for next week. Need to prepare system design questions and review data structures.',
    deadline: '2024-01-20T23:59:59Z',
    appliedDate: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    feedback: [
      {
        id: 'f1',
        applicationId: id,
        mentorId: 'm1',
        content: 'Great progress on the technical assessment! Your coding skills are solid. For the upcoming interview, I recommend focusing on system design concepts. Practice designing scalable systems and be prepared to discuss trade-offs. Also, review common data structures and algorithms, especially trees and graphs.',
        tags: ['DSA', 'SYSTEM_DESIGN'] as const,
        priority: 'HIGH' as const,
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
        mentor: {
          id: 'm1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      {
        id: 'f2',
        applicationId: id,
        mentorId: 'm2',
        content: 'Your resume looks great for this position. The projects you\'ve highlighted align well with Google\'s tech stack. One suggestion: add more quantifiable metrics to your achievements. For example, instead of "improved performance," say "improved performance by 40%." This makes your impact more concrete.',
        tags: ['RESUME'] as const,
        priority: 'MEDIUM' as const,
        createdAt: '2024-01-15T14:00:00Z',
        updatedAt: '2024-01-15T14:00:00Z',
        mentor: {
          id: 'm2',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      },
    ],
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
  const application = await getApplication(params.id);
  
  if (!application) {
    return {
      title: 'Application Not Found - UIMP',
    };
  }

  return {
    title: `${application.company} - ${application.role} | UIMP`,
    description: `View details for your ${application.company} ${application.role} application`,
  };
}

interface ApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationDetailPage({ 
  params 
}: ApplicationDetailPageProps) {
  const application = await getApplication(params.id);

  if (!application) {
    notFound();
  }

  return (
    <StudentRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/student/applications">
              <Button variant="outline" size="sm">
                ← Back to Applications
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {application.company}
                </h1>
                <ApplicationStatusBadge 
                  status={application.status} 
                  showIcon={true}
                  size="lg"
                />
              </div>
              <p className="text-xl text-gray-600">{application.role}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href={`/student/applications/${application.id}/edit`}>
              <Button variant="outline">
                Edit Application
              </Button>
            </Link>
            <Button>
              Update Status
            </Button>
          </div>
        </div>

        {/* Application Details */}
        <ApplicationDetailView application={application} />
      </div>
    </StudentRoute>
  );
}