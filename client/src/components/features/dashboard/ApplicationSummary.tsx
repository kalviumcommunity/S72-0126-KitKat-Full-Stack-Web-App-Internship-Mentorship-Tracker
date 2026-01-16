// Application Summary Component
// Displays recent applications on dashboard

import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ApplicationStatusBadge } from '@/components/features/applications/ApplicationStatusBadge';
import type { ApplicationWithFeedback } from '@/lib/types';

interface ApplicationSummaryProps {
  applications: ApplicationWithFeedback[];
  maxItems?: number;
}

export function ApplicationSummary({ applications, maxItems = 5 }: ApplicationSummaryProps) {
  const recentApplications = applications.slice(0, maxItems);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <Link href="/student/applications">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600 text-sm mb-4">No applications yet</p>
            <Link href="/student/applications/new">
              <Button size="sm">Create Your First Application</Button>
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
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <Link href="/student/applications">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentApplications.map((application) => (
            <Link 
              key={application.id}
              href={`/student/applications/${application.id}`}
              className="block"
            >
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {application.company}
                      </h4>
                      <ApplicationStatusBadge status={application.status} />
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {application.role}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📅 Applied: {formatDate(application.appliedDate)}</span>
                      {application.feedback.length > 0 && (
                        <span>💬 {application.feedback.length} feedback</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-gray-400">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {applications.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <Link href="/student/applications">
              <Button variant="outline" size="sm" className="w-full">
                View All {applications.length} Applications
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}