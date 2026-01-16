// Recent Applications Component (Mentor View)
// Displays recent applications from students

import Link from 'next/link';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ApplicationStatusBadge } from '@/components/features/applications/ApplicationStatusBadge';
import type { ApplicationWithUser } from '@/lib/types';

interface RecentApplicationsProps {
  applications: ApplicationWithUser[];
  maxItems?: number;
}

export function RecentApplications({ applications, maxItems = 5 }: RecentApplicationsProps) {
  const recentApplications = applications.slice(0, maxItems);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600 text-sm">No recent applications</p>
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
          <span className="text-sm text-gray-500">{applications.length} total</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentApplications.map((application) => {
            const studentName = application.user.firstName && application.user.lastName
              ? `${application.user.firstName} ${application.user.lastName}`
              : application.user.email;

            return (
              <div 
                key={application.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {application.company}
                      </h4>
                      <ApplicationStatusBadge status={application.status} />
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {application.role}
                    </p>
                    <p className="text-xs text-gray-500">
                      Student: {studentName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    📅 Applied: {formatDate(application.appliedDate)}
                  </span>
                  <Link href={`/mentor/applications/${application.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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