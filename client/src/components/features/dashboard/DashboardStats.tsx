// Dashboard Statistics Component
// Displays key metrics and statistics

import { Card, CardContent } from '@/components/ui/Card';
import type { StudentDashboardData } from '@/lib/types';

interface DashboardStatsProps {
  applications: StudentDashboardData['applications'];
  feedback: StudentDashboardData['feedback'];
}

export function DashboardStats({ applications, feedback }: DashboardStatsProps) {
  const activeApplications = 
    (applications.byStatus.APPLIED || 0) + 
    (applications.byStatus.SHORTLISTED || 0) + 
    (applications.byStatus.INTERVIEW || 0);

  const successRate = applications.total > 0
    ? Math.round(((applications.byStatus.OFFER || 0) / applications.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Applications */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {applications.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {applications.byStatus.DRAFT || 0} drafts
              </p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </CardContent>
      </Card>

      {/* Active Applications */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {activeApplications}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active applications
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </CardContent>
      </Card>

      {/* Offers Received */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offers</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {applications.byStatus.OFFER || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {successRate}% success rate
              </p>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Received */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feedback</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {feedback.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From mentors
              </p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}