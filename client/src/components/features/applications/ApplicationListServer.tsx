// Application List Server Component - Server Component
// Fetches and displays applications with server-side rendering

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ApplicationFilters } from './ApplicationFilters';
import { ApplicationCard } from './ApplicationCard';
import { EmptyApplicationsState } from './EmptyApplicationsState';
import type { ApplicationWithFeedback, ApplicationFilters as FilterType } from '@/lib/types';

// Mock data - replace with actual API call
async function getApplications(
  userId: string,
  filters?: FilterType,
  page: number = 1,
  limit: number = 20
): Promise<{
  applications: ApplicationWithFeedback[];
  totalCount: number;
  totalPages: number;
}> {
  // TODO: Replace with actual API call
  // const response = await applications.getAll(filters, page, limit);
  
  // Mock data for development
  const mockApplications: ApplicationWithFeedback[] = [
    {
      id: '1',
      userId: userId,
      company: 'Google',
      role: 'Software Engineer Intern',
      platform: 'COMPANY_WEBSITE',
      status: 'INTERVIEW',
      resumeUrl: '/resumes/resume-google.pdf',
      notes: 'Applied through university career portal. Completed online assessment. Interview scheduled for next week.',
      deadline: '2024-01-20T23:59:59Z',
      appliedDate: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-16T14:30:00Z',
      feedback: [
        {
          id: 'f1',
          applicationId: '1',
          mentorId: 'm1',
          content: 'Great progress on the technical assessment. Focus on system design concepts for the upcoming interview.',
          tags: ['DSA', 'SYSTEM_DESIGN'],
          priority: 'HIGH',
          createdAt: '2024-01-16T09:00:00Z',
          updatedAt: '2024-01-16T09:00:00Z',
          mentor: {
            id: 'm1',
            email: 'mentor1@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ],
    },
    {
      id: '2',
      userId: userId,
      company: 'Microsoft',
      role: 'Product Manager Intern',
      platform: 'LINKEDIN',
      status: 'APPLIED',
      resumeUrl: '/resumes/resume-microsoft.pdf',
      notes: 'Referred by alumni. Submitted cover letter and portfolio. Waiting for response.',
      deadline: '2024-01-25T23:59:59Z',
      appliedDate: '2024-01-14T14:30:00Z',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T14:30:00Z',
      feedback: [
        {
          id: 'f2',
          applicationId: '2',
          mentorId: 'm1',
          content: 'Resume looks good. Consider adding more quantifiable achievements in your project descriptions.',
          tags: ['RESUME'],
          priority: 'MEDIUM',
          createdAt: '2024-01-15T11:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
          mentor: {
            id: 'm1',
            email: 'mentor1@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ],
    },
    {
      id: '3',
      userId: userId,
      company: 'Amazon',
      role: 'SDE Intern',
      platform: 'REFERRAL',
      status: 'SHORTLISTED',
      resumeUrl: '/resumes/resume-amazon.pdf',
      notes: 'Employee referral from previous internship mentor. Strong technical background highlighted.',
      deadline: null,
      appliedDate: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-17T16:45:00Z',
      feedback: [
        {
          id: 'f3',
          applicationId: '3',
          mentorId: 'm2',
          content: 'Excellent technical skills demonstrated. Prepare for behavioral questions focusing on leadership principles.',
          tags: ['DSA', 'COMMUNICATION'],
          priority: 'HIGH',
          createdAt: '2024-01-17T10:00:00Z',
          updatedAt: '2024-01-17T10:00:00Z',
          mentor: {
            id: 'm2',
            email: 'mentor2@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
        {
          id: 'f4',
          applicationId: '3',
          mentorId: 'm1',
          content: 'Great referral connection. Make sure to research Amazon\'s leadership principles thoroughly.',
          tags: ['COMMUNICATION'],
          priority: 'MEDIUM',
          createdAt: '2024-01-16T15:30:00Z',
          updatedAt: '2024-01-16T15:30:00Z',
          mentor: {
            id: 'm1',
            email: 'mentor1@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ],
    },
    {
      id: '4',
      userId: userId,
      company: 'Meta',
      role: 'Data Science Intern',
      platform: 'JOB_BOARD',
      status: 'REJECTED',
      resumeUrl: '/resumes/resume-meta.pdf',
      notes: 'Applied through Indeed. Received rejection after phone screen. Good learning experience.',
      deadline: '2024-01-15T23:59:59Z',
      appliedDate: '2024-01-10T16:45:00Z',
      createdAt: '2024-01-10T16:45:00Z',
      updatedAt: '2024-01-18T10:20:00Z',
      feedback: [
        {
          id: 'f5',
          applicationId: '4',
          mentorId: 'm2',
          content: 'Don\'t be discouraged by the rejection. Your technical skills are strong. Focus on improving data science portfolio projects.',
          tags: ['RESUME'],
          priority: 'MEDIUM',
          createdAt: '2024-01-18T09:00:00Z',
          updatedAt: '2024-01-18T09:00:00Z',
          mentor: {
            id: 'm2',
            email: 'mentor2@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
      ],
    },
    {
      id: '5',
      userId: userId,
      company: 'Apple',
      role: 'iOS Developer Intern',
      platform: 'COMPANY_WEBSITE',
      status: 'DRAFT',
      resumeUrl: null,
      notes: 'Working on application. Need to complete coding challenge and update resume for iOS development focus.',
      deadline: '2024-01-30T23:59:59Z',
      appliedDate: null,
      createdAt: '2024-01-18T12:00:00Z',
      updatedAt: '2024-01-18T12:00:00Z',
      feedback: [],
    },
  ];

  // Apply filters (mock implementation)
  let filteredApplications = mockApplications;
  
  if (filters?.status?.length) {
    filteredApplications = filteredApplications.filter(app => 
      filters.status!.includes(app.status)
    );
  }
  
  if (filters?.platform?.length) {
    filteredApplications = filteredApplications.filter(app => 
      filters.platform!.includes(app.platform)
    );
  }
  
  if (filters?.company) {
    filteredApplications = filteredApplications.filter(app => 
      app.company.toLowerCase().includes(filters.company!.toLowerCase())
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  return {
    applications: paginatedApplications,
    totalCount: filteredApplications.length,
    totalPages: Math.ceil(filteredApplications.length / limit),
  };
}

interface ApplicationListServerProps {
  userId: string;
  searchParams?: {
    status?: string;
    platform?: string;
    company?: string;
    page?: string;
  };
}

export async function ApplicationListServer({ 
  userId, 
  searchParams = {} 
}: ApplicationListServerProps) {
  // Parse search parameters
  const filters: FilterType = {
    status: searchParams.status ? searchParams.status.split(',') as any[] : undefined,
    platform: searchParams.platform ? searchParams.platform.split(',') as any[] : undefined,
    company: searchParams.company || undefined,
  };

  const currentPage = parseInt(searchParams.page || '1', 10);
  const limit = 20;

  // Fetch applications data
  const { applications, totalCount, totalPages } = await getApplications(
    userId,
    filters,
    currentPage,
    limit
  );

  // Calculate statistics
  const stats = {
    total: totalCount,
    byStatus: applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    withFeedback: applications.filter(app => app.feedback.length > 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your internship applications
          </p>
        </div>
        <Link href="/student/applications/new">
          <Button>New Application</Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(stats.byStatus.APPLIED || 0) + (stats.byStatus.SHORTLISTED || 0) + (stats.byStatus.INTERVIEW || 0)}
                </p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offers</p>
                <p className="text-2xl font-bold text-green-600">{stats.byStatus.OFFER || 0}</p>
              </div>
              <div className="text-2xl">🎉</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Feedback</p>
                <p className="text-2xl font-bold text-purple-600">{stats.withFeedback}</p>
              </div>
              <div className="text-2xl">💬</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ApplicationFilters currentFilters={filters} />

      {/* Applications List */}
      {applications.length === 0 ? (
        <EmptyApplicationsState hasFilters={Object.keys(filters).some(key => filters[key as keyof FilterType])} />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard 
              key={application.id} 
              application={application}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center text-sm text-gray-500">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} applications
          </div>
          
          <div className="flex items-center space-x-2">
            <Link 
              href={`?${new URLSearchParams({ ...searchParams, page: (currentPage - 1).toString() }).toString()}`}
              className={currentPage <= 1 ? 'pointer-events-none' : ''}
            >
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
            </Link>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Link 
              href={`?${new URLSearchParams({ ...searchParams, page: (currentPage + 1).toString() }).toString()}`}
              className={currentPage >= totalPages ? 'pointer-events-none' : ''}
            >
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}