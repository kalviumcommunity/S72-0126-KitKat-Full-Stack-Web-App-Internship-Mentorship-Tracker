// Mentor Profile Page
// Public-facing mentor profile and settings

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { MentorProfileHeader } from '@/components/dashboard/mentor/profile/MentorProfileHeader';
import { MentorAboutSection } from '@/components/dashboard/mentor/profile/MentorAboutSection';
import { MentorExperienceSection } from '@/components/dashboard/mentor/profile/MentorExperienceSection';
import { MentorSpecializationsSection } from '@/components/dashboard/mentor/profile/MentorSpecializationsSection';
import { MentorStatsSection } from '@/components/dashboard/mentor/profile/MentorStatsSection';
import { MentorTestimonialsSection } from '@/components/dashboard/mentor/profile/MentorTestimonialsSection';

export default function MentorProfilePage() {
  const { user } = useAuth();
  const [isOwnProfile] = useState(true);

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
    <MentorDashboardLayout currentPage="profile">
      <div className="min-h-screen bg-gray-50">
        {/* Profile Header */}
        <MentorProfileHeader isOwnProfile={isOwnProfile} />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <MentorAboutSection />
              <MentorExperienceSection />
              <MentorTestimonialsSection />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <MentorSpecializationsSection />
              <MentorStatsSection />
            </div>
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}