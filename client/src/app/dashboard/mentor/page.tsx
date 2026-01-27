// Mentor Dashboard Page
// Comprehensive mentor dashboard with sidebar navigation

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { MentorWelcomeHeader } from '@/components/dashboard/mentor/MentorWelcomeHeader';
import { MentorKeyMetrics } from '@/components/dashboard/mentor/MentorKeyMetrics';
import { UpcomingSessionsSection } from '@/components/dashboard/mentor/UpcomingSessionsSection';
import { StudentUpdatesSection } from '@/components/dashboard/mentor/StudentUpdatesSection';
import { PendingReviewsSection } from '@/components/dashboard/mentor/PendingReviewsSection';
import { RecentActivitySection } from '@/components/dashboard/mentor/RecentActivitySection';
import { QuickActionsSection } from '@/components/dashboard/mentor/QuickActionsSection';

export default function MentorDashboardPage() {
  const { user } = useAuth();

  if (!user || user.role !== UserRole.MENTOR) {
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
    <MentorDashboardLayout currentPage="dashboard">
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Header */}
        <MentorWelcomeHeader />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Key Metrics */}
          <MentorKeyMetrics />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              <UpcomingSessionsSection />
              <StudentUpdatesSection />
              <RecentActivitySection />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-8">
              <PendingReviewsSection />
              <QuickActionsSection />
            </div>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}