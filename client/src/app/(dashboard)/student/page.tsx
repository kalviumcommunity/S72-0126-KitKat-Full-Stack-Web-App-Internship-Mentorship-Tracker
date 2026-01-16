// Student Dashboard Page - Server Component
// Main dashboard for student users

import Link from 'next/link';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ApplicationSummary } from '@/components/features/dashboard/ApplicationSummary';
import { FeedbackSummary } from '@/components/features/feedback/FeedbackSummary';
import { DashboardStats } from '@/components/features/dashboard/DashboardStats';
import { RecentActivity } from '@/components/features/dashboard/RecentActivity';
import { UpcomingDeadlines } from '@/components/features/dashboard/UpcomingDeadlines';
import { MentorInfo } from '@/components/features/dashboard/MentorInfo';
import type { StudentDashboardData } from '@/lib/types';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority } from '@/lib/types';

// Mock function to get student dashboard data
async function getStudentDashboard(userId: string): Promise<StudentDashboardData> {
  // TODO: Replace with actual API call
  // const response = await dashboard.getStudentData();
  
  // Mock data for development
  return {
    user: {
      id: userId,
      email: 'student@example.com',
      role: UserRole.STUDENT,
      firstName: 'John',
      lastName: 'Student',
      profileImageUrl: undefined,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      lastLoginAt: '2024-01-18T10:00:00Z',
    },
    applications: {
      total: 12,
      byStatus: {
        [ApplicationStatus.DRAFT]: 2,
        [ApplicationStatus.APPLIED]: 4,
        [ApplicationStatus.SHORTLISTED]: 2,
        [ApplicationStatus.INTERVIEW]: 3,
        [ApplicationStatus.OFFER]: 1,
        [ApplicationStatus.REJECTED]: 0,
      },
      recent: [
        {
          id: '1',
          userId: userId,
          company: 'Google',
          role: 'Software Engineer Intern',
          platform: ApplicationPlatform.COMPANY_WEBSITE,
          status: ApplicationStatus.INTERVIEW,
          resumeUrl: '/resumes/resume-google.pdf',
          notes: 'Technical interview scheduled for next week.',
          deadline: '2024-01-20T23:59:59Z',
          appliedDate: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:30:00Z',
          feedback: [
            {
              id: 'f1',
              applicationId: '1',
              mentorId: 'm1',
              content: 'Great progress! Focus on system design.',
              tags: [FeedbackTag.DSA, FeedbackTag.SYSTEM_DESIGN],
              priority: FeedbackPriority.HIGH,
              createdAt: '2024-01-16T09:00:00Z',
              updatedAt: '2024-01-16T09:00:00Z',
              mentor: {
                id: 'm1',
                email: 'john.doe@example.com',
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
          platform: ApplicationPlatform.LINKEDIN,
          status: ApplicationStatus.APPLIED,
          resumeUrl: '/resumes/resume-microsoft.pdf',
          notes: 'Waiting for response.',
          deadline: '2024-01-25T23:59:59Z',
          appliedDate: '2024-01-14T14:30:00Z',
          createdAt: '2024-01-14T14:30:00Z',
          updatedAt: '2024-01-14T14:30:00Z',
          feedback: [],
        },
        {
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
          feedback: [
            {
              id: 'f3',
              applicationId: '3',
              mentorId: 'm2',
              content: 'Excellent technical skills. Prepare for behavioral questions.',
              tags: [FeedbackTag.DSA, FeedbackTag.COMMUNICATION],
              priority: FeedbackPriority.HIGH,
              createdAt: '2024-01-17T10:00:00Z',
              updatedAt: '2024-01-17T10:00:00Z',
              mentor: {
                id: 'm2',
                email: 'jane.smith@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
              },
            },
          ],
        },
      ],
    },
    feedback: {
      total: 8,
      recent: [
        {
          id: 'f1',
          applicationId: '1',
          mentorId: 'm1',
          content: 'Great progress on the technical assessment! Focus on system design concepts.',
          tags: [FeedbackTag.DSA, FeedbackTag.SYSTEM_DESIGN],
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
            notes: 'Technical interview scheduled.',
            deadline: '2024-01-20T23:59:59Z',
            appliedDate: '2024-01-15T10:00:00Z',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-16T14:30:00Z',
            user: {
              id: userId,
              email: 'student@example.com',
              firstName: 'John',
              lastName: 'Student',
            },
          },
        },
      ],
    },
    mentors: [
      {
        id: 'm1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        id: 'm2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      },
    ],
  };
}

export default async function StudentDashboard() {
  // Mock user ID - replace with actual auth
  const userId = 'mock-user-id';
  
  // Fetch dashboard data
  const dashboardData = await getStudentDashboard(userId);

  return (
    <StudentRoute>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {dashboardData.user.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your internship application journey
            </p>
          </div>
          <Link href="/student/applications/new">
            <Button>New Application</Button>
          </Link>
        </div>

        {/* Dashboard Statistics */}
        <DashboardStats 
          applications={dashboardData.applications}
          feedback={dashboardData.feedback}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <ApplicationSummary applications={dashboardData.applications.recent} />

            {/* Recent Activity */}
            <RecentActivity 
              applications={dashboardData.applications.recent}
              feedback={dashboardData.feedback.recent}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <UpcomingDeadlines applications={dashboardData.applications.recent} />

            {/* Recent Feedback */}
            <FeedbackSummary 
              feedback={dashboardData.feedback.recent}
              maxItems={3}
            />

            {/* Mentor Information */}
            <MentorInfo mentors={dashboardData.mentors} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/student/applications/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    ➕ Add Application
                  </Button>
                </Link>
                <Link href="/student/applications" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    📋 View All Applications
                  </Button>
                </Link>
                <Link href="/student/feedback" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    💬 View All Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentRoute>
  );
}