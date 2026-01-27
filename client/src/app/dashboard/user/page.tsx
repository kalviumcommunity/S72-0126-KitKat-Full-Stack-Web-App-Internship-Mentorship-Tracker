// Student/User Dashboard Page
// Comprehensive dashboard with sidebar navigation and detailed sections

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { WelcomeHeader } from '@/components/dashboard/student/WelcomeHeader';
import { KeyMetricsRow } from '@/components/dashboard/student/KeyMetricsRow';
import { ApplicationPipeline } from '@/components/dashboard/student/ApplicationPipeline';
import { UpcomingEventsTimeline } from '@/components/dashboard/student/UpcomingEventsTimeline';
import { RecentMentorFeedback } from '@/components/dashboard/student/RecentMentorFeedback';
import { RecommendedActions } from '@/components/dashboard/student/RecommendedActions';
import { ApplicationActivityGraph } from '@/components/dashboard/student/ApplicationActivityGraph';

export default function UserDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== UserRole.STUDENT) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <StudentDashboardLayout currentPage="dashboard">
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader user={user} />

        {/* Key Metrics Row */}
        <KeyMetricsRow />

        {/* Application Pipeline */}
        <ApplicationPipeline />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Upcoming Events Timeline */}
            <UpcomingEventsTimeline />
            
            {/* Application Activity Graph */}
            <ApplicationActivityGraph />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Recent Mentor Feedback */}
            <RecentMentorFeedback />
            
            {/* Recommended Actions */}
            <RecommendedActions />
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}