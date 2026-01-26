// Application Card component - Server/Client Component
// Displays individual application information with actions

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationActions } from './ApplicationActions';
import type { ApplicationWithFeedback } from '@/lib/types';

interface ApplicationCardProps {
  application: ApplicationWithFeedback;
  showActions?: boolean;
  compact?: boolean;
}

export function ApplicationCard({ 
  application, 
  showActions = false,
  compact = false 
}: ApplicationCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDeadlineApproaching = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
  };

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {application.company}
                  </h3>
                  <ApplicationStatusBadge status={application.status} />
                  
                  {application.feedback.length > 0 && (
                    <Badge variant="info" size="sm">
                      {application.feedback.length} feedback
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 font-medium">{application.role}</p>
                <p className="text-sm text-gray-500 capitalize">
                  via {application.platform.toLowerCase().replace('_', ' ')}
                </p>
              </div>

              {showActions && (
                <ApplicationActions applicationId={application.id} />
              )}
            </div>

            {/* Dates and Status Info */}
            {!compact && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Applied:</span>
                  <p className="text-gray-600">{application.appliedDate ? formatDate(application.appliedDate) : 'Not specified'}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Deadline:</span>
                  <p className={`${
                    application.deadline && isOverdue(application.deadline) ? 'text-red-600' :
                    application.deadline && isDeadlineApproaching(application.deadline) ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {application.deadline ? formatDate(application.deadline) : 'Not specified'}
                    {application.deadline && isDeadlineApproaching(application.deadline) && !isOverdue(application.deadline) && (
                      <span className="ml-1 text-xs">(Soon)</span>
                    )}
                    {application.deadline && isOverdue(application.deadline) && (
                      <span className="ml-1 text-xs">(Overdue)</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <p className="text-gray-600">{formatDateTime(application.updatedAt)}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && !compact && (
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {application.notes}
                </p>
              </div>
            )}

            {/* Recent Feedback */}
            {application.feedback.length > 0 && !compact && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Feedback:</h4>
                <div className="space-y-2">
                  {application.feedback.slice(0, 2).map((feedback) => (
                    <div key={feedback.id} className="bg-blue-50 rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-blue-900">
                          {feedback.mentor.firstName} {feedback.mentor.lastName}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={
                              feedback.priority === 'HIGH' ? 'error' :
                              feedback.priority === 'MEDIUM' ? 'warning' : 'success'
                            }
                            size="sm"
                          >
                            {feedback.priority}
                          </Badge>
                          <span className="text-xs text-blue-600">
                            {formatDate(feedback.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-800 line-clamp-2">
                        {feedback.content}
                      </p>
                      {feedback.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {feedback.tags.map((tag) => (
                            <Badge key={tag} variant="outline" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {application.feedback.length > 2 && (
                    <Link 
                      href={`/student/applications/${application.id}`}
                      className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      View all {application.feedback.length} feedback →
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Resume */}
            {application.resumeUrl && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Resume:</span>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 transition-colors flex items-center space-x-1"
                >
                  <span>📄</span>
                  <span>View Resume</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
            <Link href={`/student/applications/${application.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Link href={`/student/applications/${application.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}