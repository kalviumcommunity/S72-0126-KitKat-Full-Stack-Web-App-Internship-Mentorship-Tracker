// Mentor Dashboard - Server Component
// Displays mentor-specific dashboard with assigned students

import { Metadata } from 'next';
import { MentorDashboard } from '@/components/dashboard/MentorDashboard';

export const metadata: Metadata = {
  title: 'Mentor Dashboard - UIMP',
  description: 'Manage your assigned students and provide feedback',
};

export default function MentorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Guide your students and provide valuable feedback
          </p>
        </div>
      </div>

      <MentorDashboard />
    </div>
  );
}