// View Feedback Page
// Professional feedback management and history interface

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { FeedbackManagement } from '@/components/dashboard/student/feedback/FeedbackManagement';

export default function FeedbackPage() {
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
    <StudentDashboardLayout currentPage="feedback">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Feedback Management
          </h1>
          <p className="text-gray-600 leading-relaxed">
            View and manage feedback from your mentors and track your progress
          </p>
        </div>

        {/* Feedback Management Component */}
        <FeedbackManagement />
      </div>
    </StudentDashboardLayout>
  );
}