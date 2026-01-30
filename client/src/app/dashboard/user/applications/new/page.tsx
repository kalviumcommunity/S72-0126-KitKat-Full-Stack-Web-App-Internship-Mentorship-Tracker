// New Application Page
// Professional form for creating new internship applications

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { NewApplicationForm } from '@/components/dashboard/student/applications/NewApplicationForm';

export default function NewApplicationPage() {
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
    <StudentDashboardLayout currentPage="applications">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            New Application
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Track a new internship application and manage your application pipeline
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <NewApplicationForm />
        </div>
      </div>
    </StudentDashboardLayout>
  );
}