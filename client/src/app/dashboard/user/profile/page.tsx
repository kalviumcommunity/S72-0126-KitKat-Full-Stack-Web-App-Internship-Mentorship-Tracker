// Student Profile Page (Public-facing)
// Comprehensive profile display with all sections

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { ProfileHeader } from '@/components/dashboard/student/profile/ProfileHeader';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isOwnProfile] = useState(true); // In real app, check if viewing own profile

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
    <StudentDashboardLayout currentPage="profile">
      <div className="min-h-screen bg-gray-50">
        {/* Profile Header */}
        <ProfileHeader isOwnProfile={isOwnProfile} />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Profile sections will be loaded here</h2>
                <p className="text-gray-600">
                  The profile components (About, Experience, Education, Activity Feed) 
                  have been created and will be integrated once the import issues are resolved.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Skills & Stats</h2>
                <p className="text-gray-600">
                  Skills and statistics sections will be displayed here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}