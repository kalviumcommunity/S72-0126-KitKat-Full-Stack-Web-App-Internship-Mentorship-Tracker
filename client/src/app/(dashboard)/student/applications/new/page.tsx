// New Application Page - Client Component
// Allows students to create new applications

import { Metadata } from 'next/types';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { ApplicationCreateForm } from '@/components/features/applications/ApplicationCreateForm';

export const metadata: Metadata = {
  title: 'New Application | UIMP',
  description: 'Create a new internship application',
};

export default function NewApplicationPage() {
  return (
    <StudentRoute>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
          <p className="text-gray-600 mt-1">
            Create a new internship application to track your progress
          </p>
        </div>

        {/* Create Form */}
        <ApplicationCreateForm />
      </div>
    </StudentRoute>
  );
}