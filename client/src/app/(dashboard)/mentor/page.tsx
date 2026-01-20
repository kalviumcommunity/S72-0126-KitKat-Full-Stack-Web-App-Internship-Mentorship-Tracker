// Mentor Dashboard Page - Server Component
// Main dashboard for mentor users

import Link from 'next/link';

import { MentorRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { MentorDashboardStats } from '@/components/features/dashboard/MentorDashboardStats';
import { StudentsList } from '@/components/features/dashboard/StudentsList';
import { RecentApplications } from '@/components/features/dashboard/RecentApplications';
import { FeedbackActivity } from '@/components/features/dashboard/FeedbackActivity';
import { RealTimeStats } from '@/components/features/dashboard/RealTimeStats';
import { PerformanceChart } from '@/components/features/dashboard/PerformanceChart';
import { MentorStudentOverview } from '@/components/features/dashboard/MentorStudentOverview';
import { QuickActions } from '@/components/features/dashboard/QuickActions';
import type { MentorDashboardData } from '@/lib/types';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority } from '@/lib/types';

// Mock function to get mentor dashboard data
async function getMentorDashboard(userId: string): Promise<MentorDashboardData> {
  // TODO: Replace with actual API call
  // const response = await dashboard.getMentorData();
  
  // Mock data for development
  return {
    user: {
      id: userId,
      email: 'mentor@example.com',
      role: UserRole.MENTOR,
      firstName: 'Jane',
      lastName: 'Mentor',
      profileImageUrl: undefined,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      lastLoginAt: '2024-01-18T10:00:00Z',
    },
    students: [
      {
        id: 's1',
        email: 'student1@example.com',
        firstName: 'John',
        lastName: 'Student',
      },
      {
        id: 's2',
        email: 'student2@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
      },
      {
        id: 's3',
        email: 'student3@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
      },
    ],
    applications: {
      total: 24,
      byStatus: {
        DRAFT: 3,
        APPLIED: 8,
        SHORTLISTED: 5,
        INTERVIEW: 6,
        OFFER: 2,
        REJECTED: 0,
      },
      recent: [
        {
          id: '1',
          userId: 's1',
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
            id: 's1',
            email: 'student1@example.com',
            firstName: 'John',
            lastName: 'Student',
          },
        },
        {
          id: '2',
          userId: 's2',
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
          user: {
            id: 's2',
            email: 'student2@example.com',
            firstName: 'Alice',
            lastName: 'Johnson',
          },
        },
        {
          id: '3',
          userId: 's1',
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
            id: 's1',
            email: 'student1@example.com',
            firstName: 'John',
            lastName: 'Student',
          },
        },
      ],
    },
    feedback: {
      total: 15,
      recent: [
        {
          id: 'f1',
          applicationId: '1',
          mentorId: userId,
          content: 'Great progress on the technical assessment! Focus on system design concepts.',
          tags: [FeedbackTag.DSA, FeedbackTag.SYSTEM_DESIGN],
          priority: FeedbackPriority.HIGH,
          createdAt: '2024-01-16T09:00:00Z',
          updatedAt: '2024-01-16T09:00:00Z',
          mentor: {
            id: userId,
            email: 'mentor@example.com',
            firstName: 'Jane',
            lastName: 'Mentor',
          },
          application: {
            id: '1',
            userId: 's1',
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
              id: 's1',
              email: 'student1@example.com',
              firstName: 'John',
              lastName: 'Student',
            },
          },
        },
      ],
    },
  };
}

export default async function MentorDashboard() {
  // Mock user ID - replace with actual auth
  const userId = 'mock-mentor-id';
  
  // Fetch dashboard data
  const dashboardData = await getMentorDashboard(userId);

  return (
    <MentorRoute>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {dashboardData.user.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your students' progress
            </p>
          </div>
          <Link href="/mentor/feedback">
            <Button>Provide Feedback</Button>
          </Link>
        </div>

        {/* Enhanced Dashboard Statistics with Real-time Updates */}
        <RealTimeStats 
          type="mentor"
          data={dashboardData}
          refreshInterval={30000}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Student Overview */}
            <MentorStudentOverview 
              students={dashboardData.students}
              applications={dashboardData.applications.recent}
              feedback={dashboardData.feedback.recent}
            />

            {/* Performance Chart for Students */}
            <PerformanceChart 
              applications={dashboardData.applications}
              title="Students' Application Progress"
              showPercentages={true}
            />

            {/* Feedback Activity */}
            <FeedbackActivity feedback={dashboardData.feedback.recent} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Context-aware Quick Actions */}
            <QuickActions 
              userRole={dashboardData.user.role}
              applications={dashboardData.applications.recent}
              feedback={dashboardData.feedback.recent}
            />

            {/* Statistics Summary */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Applications</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.applications.recent.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Feedback Given</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.feedback.recent.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Students</span>
                  <span className="font-semibold text-gray-900">
                    {dashboardData.students.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MentorRoute>
  );
}