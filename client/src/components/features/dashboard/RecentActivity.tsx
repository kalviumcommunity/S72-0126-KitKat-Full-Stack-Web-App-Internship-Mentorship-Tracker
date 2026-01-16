// Recent Activity Component
// Displays timeline of recent activities

import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ApplicationWithFeedback, FeedbackWithRelations } from '@/lib/types';

interface RecentActivityProps {
  applications: ApplicationWithFeedback[];
  feedback: FeedbackWithRelations[];
}

interface ActivityItem {
  id: string;
  type: 'application' | 'feedback' | 'status_change';
  timestamp: string;
  title: string;
  description: string;
  link?: string;
  icon: string;
  color: string;
}

export function RecentActivity({ applications, feedback }: RecentActivityProps) {
  // Combine and sort activities
  const activities: ActivityItem[] = [];

  // Add application activities
  applications.forEach((app) => {
    if (app.appliedDate) {
      activities.push({
        id: `app-${app.id}`,
        type: 'application',
        timestamp: app.appliedDate,
        title: `Applied to ${app.company}`,
        description: `${app.role} via ${app.platform.replace('_', ' ')}`,
        link: `/student/applications/${app.id}`,
        icon: '📋',
        color: 'blue',
      });
    }

    // Add status changes
    if (app.updatedAt !== app.createdAt) {
      activities.push({
        id: `status-${app.id}`,
        type: 'status_change',
        timestamp: app.updatedAt,
        title: `${app.company} status updated`,
        description: `Status changed to ${app.status}`,
        link: `/student/applications/${app.id}`,
        icon: '🔄',
        color: 'yellow',
      });
    }
  });

  // Add feedback activities
  feedback.forEach((fb) => {
    activities.push({
      id: `feedback-${fb.id}`,
      type: 'feedback',
      timestamp: fb.createdAt,
      title: 'New feedback received',
      description: `${fb.mentor.firstName} ${fb.mentor.lastName} provided feedback on ${fb.application.company}`,
      link: `/student/applications/${fb.applicationId}`,
      icon: '💬',
      color: 'purple',
    });
  });

  // Sort by timestamp (most recent first)
  const sortedActivities = activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, h:mm a');
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (sortedActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-600 text-sm">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActivities.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(activity.color)}`}>
                  <span className="text-sm">{activity.icon}</span>
                </div>
                {index < sortedActivities.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                )}
              </div>

              {/* Activity content */}
              <div className="flex-1 pb-4">
                {activity.link ? (
                  <Link href={activity.link} className="block hover:bg-gray-50 -m-2 p-2 rounded">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      </div>
                      <span className="text-gray-400 ml-2">→</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </Link>
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}