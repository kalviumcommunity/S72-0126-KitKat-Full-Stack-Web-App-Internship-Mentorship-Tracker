// Feedback Statistics Component
// Displays feedback statistics and metrics

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { FeedbackWithRelations, FeedbackPriority, FeedbackTag } from '@/lib/types';

interface FeedbackStatsProps {
  feedback: FeedbackWithRelations[];
}

export function FeedbackStats({ feedback }: FeedbackStatsProps) {
  // Calculate statistics
  const totalFeedback = feedback.length;
  
  const byPriority = feedback.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {} as Record<FeedbackPriority, number>);

  const byTag = feedback.reduce((acc, item) => {
    item.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<FeedbackTag, number>);

  const uniqueMentors = new Set(feedback.map(f => f.mentorId)).size;

  // Get recent feedback (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentFeedback = feedback.filter(
    f => new Date(f.createdAt) >= sevenDaysAgo
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Feedback */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{totalFeedback}</p>
            </div>
            <div className="text-2xl">💬</div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {byPriority.HIGH || 0}
              </p>
            </div>
            <div className="text-2xl">🔴</div>
          </div>
        </CardContent>
      </Card>

      {/* Recent (7 days) */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
              <p className="text-2xl font-bold text-blue-600">{recentFeedback}</p>
            </div>
            <div className="text-2xl">📅</div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Mentors</p>
              <p className="text-2xl font-bold text-purple-600">{uniqueMentors}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}