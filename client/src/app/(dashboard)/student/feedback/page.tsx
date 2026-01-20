// Student Feedback Page - Server Component
// Displays all feedback received by the student

import Link from 'next/link';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { FeedbackList } from '@/components/features/feedback/FeedbackList';
import { FeedbackFilters } from '@/components/features/feedback/FeedbackFilters';
import { FeedbackStats } from '@/components/features/feedback/FeedbackStats';
import type { FeedbackWithRelations, FeedbackFilters as FilterType } from '@/lib/types';
import { ApplicationStatus, ApplicationPlatform, FeedbackPriority } from '@/lib/types';

// Mock function to get feedback
async function getFeedback(
  userId: string,
  filters?: FilterType,
  page: number = 1,
  limit: number = 15
): Promise<{
  feedback: FeedbackWithRelations[];
  totalCount: number;
  totalPages: number;
}> {
  // TODO: Replace with actual API call
  // const response = await feedback.getAll(filters, page, limit);
  
  // Mock data for development
  const mockFeedback: FeedbackWithRelations[] = [
    {
      id: 'f1',
      applicationId: '1',
      mentorId: 'm1',
      content: 'Great progress on the technical assessment! Your coding skills are solid. For the upcoming interview, I recommend focusing on system design concepts. Practice designing scalable systems and be prepared to discuss trade-offs. Also, review common data structures and algorithms, especially trees and graphs.',
      tags: [FeedbackTag.DSA.SYSTEM_DESIGN],
      priority: FeedbackPriority.HIGH,
      createdAt: '2024-01-16T09:00:00Z',
      updatedAt: '2024-01-16T09:00:00Z',
      mentor: {
        id: 'm1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      application: {
        id: '1',
        userId: userId,
        company: 'Google',
        role: 'Software Engineer Intern',
        platform: ApplicationPlatform.COMPANY_WEBSITE,
        status: ApplicationStatus.INTERVIEW,
        resumeUrl: '/resumes/resume-google.pdf',
        notes: 'Applied through university career portal.',
        deadline: '2024-01-20T23:59:59Z',
        appliedDate: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-16T14:30:00Z',
        user: {
          id: userId,
          email: 'student@example.com',
          firstName: 'Student',
          lastName: 'User',
        },
      },
    },
    {
      id: 'f2',
      applicationId: '2',
      mentorId: 'm1',
      content: 'Resume looks good. Consider adding more quantifiable achievements in your project descriptions. Instead of saying "improved performance," try "improved performance by 40%." This makes your impact more concrete and impressive to recruiters.',
      tags: [FeedbackTag.RESUME],
      priority: FeedbackPriority.MEDIUM,
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
      mentor: {
        id: 'm1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      application: {
        id: '2',
        userId: userId,
        company: 'Microsoft',
        role: 'Product Manager Intern',
        platform: ApplicationPlatform.LINKEDIN,
        status: ApplicationStatus.APPLIED,
        resumeUrl: '/resumes/resume-microsoft.pdf',
        notes: 'Referred by alumni.',
        deadline: '2024-01-25T23:59:59Z',
        appliedDate: '2024-01-14T14:30:00Z',
        createdAt: '2024-01-14T14:30:00Z',
        updatedAt: '2024-01-14T14:30:00Z',
        user: {
          id: userId,
          email: 'student@example.com',
          firstName: 'Student',
          lastName: 'User',
        },
      },
    },
    {
      id: 'f3',
      applicationId: '3',
      mentorId: 'm2',
      content: 'Excellent technical skills demonstrated. Prepare for behavioral questions focusing on leadership principles. Amazon values their leadership principles highly, so make sure you have specific examples ready for each one.',
      tags: [FeedbackTag.DSA.COMMUNICATION],
      priority: FeedbackPriority.HIGH,
      createdAt: '2024-01-17T10:00:00Z',
      updatedAt: '2024-01-17T10:00:00Z',
      mentor: {
        id: 'm2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      },
      application: {
        id: '3',
        userId: userId,
        company: 'Amazon',
        role: 'SDE Intern',
        platform: ApplicationPlatform.REFERRAL,
        status: ApplicationStatus.SHORTLISTED,
        resumeUrl: '/resumes/resume-amazon.pdf',
        notes: 'Employee referral from previous internship mentor.',
        deadline: undefined,
        appliedDate: '2024-01-13T09:15:00Z',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-17T16:45:00Z',
        user: {
          id: userId,
          email: 'student@example.com',
          firstName: 'Student',
          lastName: 'User',
        },
      },
    },
    {
      id: 'f4',
      applicationId: '3',
      mentorId: 'm1',
      content: 'Great referral connection. Make sure to research Amazon\'s leadership principles thoroughly. Have concrete examples from your experience that demonstrate each principle.',
      tags: [FeedbackTag.COMMUNICATION],
      priority: FeedbackPriority.MEDIUM,
      createdAt: '2024-01-16T15:30:00Z',
      updatedAt: '2024-01-16T15:30:00Z',
      mentor: {
        id: 'm1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      application: {
        id: '3',
        userId: userId,
        company: 'Amazon',
        role: 'SDE Intern',
        platform: ApplicationPlatform.REFERRAL,
        status: ApplicationStatus.SHORTLISTED,
        resumeUrl: '/resumes/resume-amazon.pdf',
        notes: 'Employee referral.',
        deadline: undefined,
        appliedDate: '2024-01-13T09:15:00Z',
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-17T16:45:00Z',
        user: {
          id: userId,
          email: 'student@example.com',
          firstName: 'Student',
          lastName: 'User',
        },
      },
    },
    {
      id: 'f5',
      applicationId: '4',
      mentorId: 'm2',
      content: 'Don\'t be discouraged by the rejection. Your technical skills are strong. Focus on improving data science portfolio projects. Consider adding a project that demonstrates end-to-end ML pipeline development.',
      tags: [FeedbackTag.RESUME],
      priority: FeedbackPriority.MEDIUM,
      createdAt: '2024-01-18T09:00:00Z',
      updatedAt: '2024-01-18T09:00:00Z',
      mentor: {
        id: 'm2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      },
      application: {
        id: '4',
        userId: userId,
        company: 'Meta',
        role: 'Data Science Intern',
        platform: ApplicationPlatform.JOB_BOARD,
        status: ApplicationStatus.REJECTED,
        resumeUrl: '/resumes/resume-meta.pdf',
        notes: 'Applied through Indeed.',
        deadline: '2024-01-15T23:59:59Z',
        appliedDate: '2024-01-10T16:45:00Z',
        createdAt: '2024-01-10T16:45:00Z',
        updatedAt: '2024-01-18T10:20:00Z',
        user: {
          id: userId,
          email: 'student@example.com',
          firstName: 'Student',
          lastName: 'User',
        },
      },
    },
  ];

  // Apply filters
  let filteredFeedback = mockFeedback;
  
  if (filters?.tags?.length) {
    filteredFeedback = filteredFeedback.filter(f => 
      f.tags.some(tag => filters.tags!.includes(tag))
    );
  }
  
  if (filters?.priority?.length) {
    filteredFeedback = filteredFeedback.filter(f => 
      filters.priority!.includes(f.priority)
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

  return {
    feedback: paginatedFeedback,
    totalCount: filteredFeedback.length,
    totalPages: Math.ceil(filteredFeedback.length / limit),
  };
}

interface FeedbackPageProps {
  searchParams?: {
    tags?: string;
    priority?: string;
    page?: string;
  };
}

export default async function FeedbackPage({ searchParams = {} }: FeedbackPageProps) {
  // Parse search parameters
  const filters: FilterType = {
    tags: searchParams.tags ? searchParams.tags.split(',') as any[] : undefined,
    priority: searchParams.priority ? searchParams.priority.split(',') as any[] : undefined,
  };

  const currentPage = parseInt(searchParams.page || '1', 10);
  const limit = 15;

  // Mock user ID - replace with actual auth
  const userId = 'mock-user-id';

  // Fetch feedback data
  const { feedback, totalCount, totalPages } = await getFeedback(
    userId,
    filters,
    currentPage,
    limit
  );

  return (
    <StudentRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentor Feedback</h1>
            <p className="text-gray-600 mt-1">
              Review feedback from your mentors to improve your applications
            </p>
          </div>
          <Link href="/student/applications">
            <Button variant="outline">View Applications</Button>
          </Link>
        </div>

        {/* Statistics */}
        <FeedbackStats feedback={feedback} />

        {/* Filters */}
        <FeedbackFilters currentFilters={filters} />

        {/* Feedback List */}
        <FeedbackList 
          feedback={feedback}
          currentFilters={filters}
          showApplications={true}
          showActions={true}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center text-sm text-gray-500">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} feedback items
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
    </StudentRoute>
  );
}