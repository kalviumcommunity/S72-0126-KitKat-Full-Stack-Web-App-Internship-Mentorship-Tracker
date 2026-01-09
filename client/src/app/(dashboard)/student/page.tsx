// Student Dashboard - Server Component
// Displays student-specific dashboard with applications and feedback

import { Metadata } from 'next';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';

export const metadata: Metadata = {
  title: 'Student Dashboard - UIMP',
  description: 'Your internship applications and feedback dashboard',
};

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your internship applications and receive mentor feedback
          </p>
        </div>
      </div>

      <StudentDashboard />
    </div>
  );
}