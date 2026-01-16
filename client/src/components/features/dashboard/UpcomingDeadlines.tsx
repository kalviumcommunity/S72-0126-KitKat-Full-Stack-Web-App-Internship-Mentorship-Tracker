// Upcoming Deadlines Component
// Displays applications with approaching deadlines

import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ApplicationWithFeedback } from '@/lib/types';

interface UpcomingDeadlinesProps {
  applications: ApplicationWithFeedback[];
}

export function UpcomingDeadlines({ applications }: UpcomingDeadlinesProps) {
  // Filter applications with deadlines and sort by deadline
  const applicationsWithDeadlines = applications
    .filter(app => app.deadline)
    .map(app => ({
      ...app,
      daysUntilDeadline: differenceInDays(new Date(app.deadline!), new Date()),
    }))
    .filter(app => app.daysUntilDeadline >= 0) // Only future deadlines
    .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 2) return 'destructive';
    if (days <= 7) return 'secondary';
    return 'outline';
  };

  const getUrgencyText = (days: number) => {
    if (days === 0) return 'Today!';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    return `${days} days`;
  };

  if (applicationsWithDeadlines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm text-gray-600">No upcoming deadlines</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {applicationsWithDeadlines.map((application) => (
            <Link 
              key={application.id}
              href={`/student/applications/${application.id}`}
              className="block"
            >
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {application.company}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {application.role}
                    </p>
                  </div>
                  <Badge 
                    variant={getUrgencyColor(application.daysUntilDeadline)}
                    className="ml-2 flex-shrink-0"
                  >
                    {getUrgencyText(application.daysUntilDeadline)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  📅 {formatDate(application.deadline!)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/student/applications">
            <Button variant="outline" size="sm" className="w-full">
              View All Applications
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}