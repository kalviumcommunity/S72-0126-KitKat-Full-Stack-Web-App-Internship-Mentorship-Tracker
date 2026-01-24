// Feedback Card Component - Display individual feedback item
// Used in feedback lists and application detail views

import { format } from 'date-fns';
import Link from 'next/link';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import type { FeedbackWithRelations } from '@/lib/types';
import { FEEDBACK_PRIORITY_CONFIG, FEEDBACK_TAG_CONFIG } from '@/lib/types';

interface FeedbackCardProps {
  feedback: FeedbackWithRelations;
  showApplication?: boolean;
  showActions?: boolean;
}

export function FeedbackCard({ 
  feedback, 
  showApplication = false,
  showActions = false 
}: FeedbackCardProps) {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy at h:mm a');
  };

  const priorityConfig = FEEDBACK_PRIORITY_CONFIG[feedback.priority];
  const priorityColorClass = {
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
  }[priorityConfig.color];

  return (
    <Card className={`${priorityColorClass} border-l-4`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Mentor Avatar */}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-blue-600">
                {feedback.mentor?.firstName?.[0] || feedback.mentor?.email?.[0]?.toUpperCase() || 'M'}
                {feedback.mentor.lastName?.[0] || ''}
              </span>
            </div>
            
            {/* Mentor Info */}
            <div>
              <p className="font-medium text-gray-900">
                {feedback.mentor.firstName && feedback.mentor.lastName
                  ? `${feedback.mentor.firstName} ${feedback.mentor.lastName}`
                  : feedback.mentor.email}
              </p>
              <p className="text-sm text-gray-500">
                {formatDateTime(feedback.createdAt)}
              </p>
            </div>
          </div>

          {/* Priority Badge */}
          <Badge 
            variant={priorityConfig.color === 'red' ? 'destructive' : 'secondary'}
            className="flex-shrink-0"
          >
            {priorityConfig.label}
          </Badge>
        </div>

        {/* Application Link (if showing) */}
        {showApplication && (
          <div className="mb-3 pb-3 border-b border-gray-200">
            <Link 
              href={`/student/applications/${feedback.application.id}`}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              <span className="font-medium">
                {feedback.application.company} - {feedback.application.role}
              </span>
            </Link>
          </div>
        )}

        {/* Feedback Content */}
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
            {feedback.content}
          </p>
        </div>

        {/* Tags */}
        {feedback.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {feedback.tags.map((tag) => (
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

        {/* Actions (if showing) */}
        {showActions && (
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
            <Link 
              href={`/student/applications/${feedback.applicationId}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Application →
            </Link>
          </div>
        )}

        {/* Updated indicator */}
        {feedback.updatedAt !== feedback.createdAt && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Updated {formatDateTime(feedback.updatedAt)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}