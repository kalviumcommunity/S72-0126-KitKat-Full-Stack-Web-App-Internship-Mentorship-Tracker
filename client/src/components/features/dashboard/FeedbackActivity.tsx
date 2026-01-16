// Feedback Activity Component (Mentor View)
// Displays recent feedback activity for mentors

import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FeedbackPriorityBadge } from '@/components/features/feedback/FeedbackPriorityBadge';
import type { FeedbackWithRelations } from '@/lib/types';

interface FeedbackActivityProps {
  feedback: FeedbackWithRelations[];
  maxItems?: number;
}

export function FeedbackActivity({ feedback, maxItems = 5 }: FeedbackActivityProps) {
  const recentFeedback = feedback.slice(0, maxItems);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, h:mm a');
  };

  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-600 text-sm mb-4">No feedback given yet</p>
            <Link href="/mentor/feedback">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Provide Feedback →
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
          <span className="text-sm text-gray-500">{feedback.length} total</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFeedback.map((item) => {
            const studentName = item.application.user.firstName && item.application.user.lastName
              ? `${item.application.user.firstName} ${item.application.user.lastName}`
              : item.application.user.email;

            return (
              <div 
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.application.company} - {item.application.role}
                      </p>
                      <FeedbackPriorityBadge priority={item.priority} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Student: {studentName}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  {item.content}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    {formatDateTime(item.createdAt)}
                  </span>
                  <Link href={`/mentor/applications/${item.applicationId}`}>
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      View Application →
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}