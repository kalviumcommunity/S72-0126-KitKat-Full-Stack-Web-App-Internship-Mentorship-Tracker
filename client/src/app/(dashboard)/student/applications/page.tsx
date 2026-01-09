// Student Applications List - Server Component
// Displays all applications for the student

import { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationList } from '@/components/features/applications/ApplicationList';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'My Applications - UIMP',
  description: 'View and manage your internship applications',
};

export default function StudentApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your internship applications
          </p>
        </div>
        <Link href="/student/applications/new">
          <Button>New Application</Button>
        </Link>
      </div>

      <ApplicationList />
    </div>
  );
}