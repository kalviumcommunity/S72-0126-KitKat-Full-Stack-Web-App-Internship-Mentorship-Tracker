// Mentor Dashboard Statistics Component
// Displays key metrics for mentors

import { Card, CardContent } from '@/components/ui/Card';
import type { MentorDashboardData } from '@/lib/types';

interface MentorDashboardStatsProps {
  students: MentorDashboardData['students'];
  applications: MentorDashboardData['applications'];
  feedback: MentorDashboardData['feedback'];
}

export function MentorDashboardStats({ students, applications, feedback }: MentorDashboardStatsProps) {
  const activeApplications = 
    (applications.byStatus.APPLIED || 0) + 
    (applications.byStatus.SHORTLISTED || 0) + 
    (applications.byStatus.INTERVIEW || 0);

  const needsFeedback = applications.total - feedback.total;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Students */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {students.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Active mentees
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </CardContent>
      </Card>

      {/* Total Applications */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Applications</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {applications.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {activeApplications} in progress
              </p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Given */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feedback Given</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {feedback.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total feedback items
              </p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </CardContent>
      </Card>

      {/* Needs Attention */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Feedback</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {needsFeedback > 0 ? needsFeedback : 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Applications pending
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}