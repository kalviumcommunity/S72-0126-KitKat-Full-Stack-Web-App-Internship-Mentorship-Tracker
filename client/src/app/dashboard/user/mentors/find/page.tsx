// Find Mentor Page
// Professional mentor discovery and connection interface

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { MentorDiscovery } from '@/components/dashboard/student/mentors/MentorDiscovery';

export default function FindMentorPage() {
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
    <StudentDashboardLayout currentPage="mentors">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Find Mentor
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Discover experienced mentors who can guide your career journey
          </p>
        </div>

        {/* Mentor Discovery Component */}
        <MentorDiscovery />
      </div>
    </StudentDashboardLayout>
  );
}