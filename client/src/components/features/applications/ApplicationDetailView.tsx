// Application Detail View Component - Server Component
// Displays comprehensive view of a single application with feedback

import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import type { ApplicationWithFeedback } from '@/lib/types';
import { FEEDBACK_PRIORITY_CONFIG, FEEDBACK_TAG_CONFIG } from '@/lib/types';

interface ApplicationDetailViewProps {
  application: ApplicationWithFeedback;
}

export function ApplicationDetailView({ application }: ApplicationDetailViewProps) {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy at h:mm a');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Application Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Application Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Application Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Company</label>
                <p className="text-lg font-semibold text-gray-900">{application.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="text-lg font-semibold text-gray-900">{application.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Platform</label>
                <p className="text-gray-900">{application.platform.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <ApplicationStatusBadge status={application.status} showIcon={true} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Applied Date</label>
                <p className="text-gray-900">{formatDate(application.appliedDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Deadline</label>
                <p className="text-gray-900">{formatDate(application.deadline)}</p>
              </div>
            </div>

            {application.notes && (
              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{application.notes}</p>
                </div>
              </div>
            )}

            {application.resumeUrl && (
              <div>
                <label className="text-sm font-medium text-gray-600">Resume</label>
                <div className="mt-1">
                  <Link 
                    href={application.resumeUrl} 
                    target="_blank"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <span>📄</span>
                    <span>View Resume</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Mentor Feedback ({application.feedback.length})
              </h2>
              {application.feedback.length === 0 && (
                <Badge variant="outline">No feedback yet</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {application.feedback.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                <p className="text-gray-600 mb-4">
                  Your mentors haven't provided feedback for this application yet.
                </p>
                <p className="text-sm text-gray-500">
                  Feedback will appear here once your mentors review your application.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {application.feedback
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((feedback) => (
                    <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                      {/* Feedback Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {feedback.mentor.firstName?.[0] || feedback.mentor.email[0].toUpperCase()}
                            </span>
                          </div>
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
                        <Badge 
                          variant={FEEDBACK_PRIORITY_CONFIG[feedback.priority].color === 'red' ? 'destructive' : 'secondary'}
                        >
                          {FEEDBACK_PRIORITY_CONFIG[feedback.priority].label}
                        </Badge>
                      </div>

                      {/* Feedback Content */}
                      <div className="mb-3">
                        <p className="text-gray-900 whitespace-pre-wrap">{feedback.content}</p>
                      </div>

                      {/* Feedback Tags */}
                      {feedback.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {feedback.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {FEEDBACK_TAG_CONFIG[tag].label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={`/student/applications/${application.id}/edit`} className="block">
              <Button variant="outline" className="w-full justify-start">
                ✏️ Edit Application
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              📊 Update Status
            </Button>
            {!application.resumeUrl && (
              <Button variant="outline" className="w-full justify-start">
                📄 Upload Resume
              </Button>
            )}
            <Button variant="outline" className="w-full justify-start">
              💬 Request Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Application Timeline */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Created</p>
                  <p className="text-xs text-gray-500">{formatDateTime(application.createdAt)}</p>
                </div>
              </div>
              
              {application.appliedDate && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDateTime(application.appliedDate)}</p>
                  </div>
                </div>
              )}

              {application.feedback.length > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">First Feedback Received</p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(
                        application.feedback.sort((a, b) => 
                          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        )[0].createdAt
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-500">{formatDateTime(application.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Stats */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Feedback Count</span>
              <span className="font-medium">{application.feedback.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Days Since Applied</span>
              <span className="font-medium">
                {application.appliedDate 
                  ? Math.floor((Date.now() - new Date(application.appliedDate).getTime()) / (1000 * 60 * 60 * 24))
                  : 'N/A'}
              </span>
            </div>
            {application.deadline && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Days to Deadline</span>
                <span className={`font-medium ${
                  new Date(application.deadline) < new Date() 
                    ? 'text-red-600' 
                    : Math.floor((new Date(application.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {Math.floor((new Date(application.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}