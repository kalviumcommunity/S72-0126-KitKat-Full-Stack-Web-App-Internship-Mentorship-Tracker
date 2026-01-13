// Student Applications List - Server Component
// Displays all applications for the student with server-side rendering

import { Metadata } from 'next/types';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { ApplicationListServer } from '@/components/features/applications/ApplicationListServer';

export const metadata: Metadata = {
  title: 'My Applications - UIMP',
  description: 'View and manage your internship applications',
};

interface StudentApplicationsPageProps {
  searchParams?: {
    status?: string;
    platform?: string;
    company?: string;
    page?: string;
  };
}

export default function StudentApplicationsPage({ 
  searchParams 
}: StudentApplicationsPageProps) {
  // TODO: Get actual user ID from authentication context
  // For now, using a mock user ID
  const userId = 'mock-user-id';

  return (
    <StudentRoute>
      <ApplicationListServer 
        userId={userId}
        searchParams={searchParams}
      />
    </StudentRoute>
  );
}