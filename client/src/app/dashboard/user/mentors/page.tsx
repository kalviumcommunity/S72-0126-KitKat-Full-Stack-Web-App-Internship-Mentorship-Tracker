// Student My Mentors Page
// Comprehensive mentorship management with active mentors, sessions, and discovery

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { MentorshipHeader } from '@/components/dashboard/student/mentors/MentorshipHeader';
import { ActiveMentorsSection } from '@/components/dashboard/student/mentors/ActiveMentorsSection';
import { PastMentorsSection } from '@/components/dashboard/student/mentors/PastMentorsSection';
import { MentorRequestsSection } from '@/components/dashboard/student/mentors/MentorRequestsSection';
import { UpcomingSessionsSection } from '@/components/dashboard/student/mentors/UpcomingSessionsSection';
import { FeedbackHistorySection } from '@/components/dashboard/student/mentors/FeedbackHistorySection';
import { FindMentorSection } from '@/components/dashboard/student/mentors/FindMentorSection';
import { MentorshipStatsSection } from '@/components/dashboard/student/mentors/MentorshipStatsSection';

export type MentorTab = 'active' | 'past' | 'requests';

export default function MentorsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MentorTab>('active');
  const [showFindMentor, setShowFindMentor] = useState(false);

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
    <StudentDashboardLayout currentPage="mentors">
      <div className="p-6 space-y-6">
        {/* Header */}
        <MentorshipHeader 
          onFindMentor={() => setShowFindMentor(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Mentorship Stats */}
        <MentorshipStatsSection />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tab Content */}
            {activeTab === 'active' && <ActiveMentorsSection />}
            {activeTab === 'past' && <PastMentorsSection />}
            {activeTab === 'requests' && <MentorRequestsSection />}

            {/* Upcoming Sessions */}
            <UpcomingSessionsSection />

            {/* Find New Mentor Section */}
            {showFindMentor && (
              <FindMentorSection onClose={() => setShowFindMentor(false)} />
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Feedback History */}
            <FeedbackHistorySection />
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}