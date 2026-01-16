// Feedback Summary Component
// Displays a summary of recent feedback for dashboard

import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { FeedbackWithRelations } from '@/lib/types';
import { FEEDBACK_PRIORITY_CONFIG, FEEDBACK_TAG_CONFIG } from '@/lib/types';

interface FeedbackSummaryProps {
  feedback: FeedbackWithRelations[];
  maxItems?: number;
}

export function FeedbackSummary({ feedback, maxItems = 5 }: FeedbackSummaryProps) {
  const recentFeedback = feedback
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, h:mm a');
  };

  if (feedback.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Feedback</h3>
            <Link href="/student/feedback">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-600 text-sm">No feedback yet</p>
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
          <Link href="/student/feedback">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentFeedback.map((item) => (
            <div 
              key={item.id}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.mentor.firstName && item.mentor.lastName
                        ? `${item.mentor.firstName} ${item.mentor.lastName}`
                        : item.mentor.email}
                    </p>
                    <Badge 
                      variant={FEEDBACK_PRIORITY_CONFIG[item.priority].color === 'red' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {FEEDBACK_PRIORITY_CONFIG[item.priority].label}
                    </Badge>
                  </div>
                  <Link 
                    href={`/student/applications/${item.application.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {item.application.company} - {item.application.role}
                  </Link>
                </div>
                <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatDateTime(item.createdAt)}
                </p>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {item.content}
              </p>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs"
                    >
                      {FEEDBACK_TAG_CONFIG[tag].label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {feedback.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <Link href="/student/feedback">
              <Button variant="outline" size="sm" className="w-full">
                View All {feedback.length} Feedback Items
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}