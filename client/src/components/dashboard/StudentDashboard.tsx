// Student Dashboard component - Server Component
// Main dashboard view for students

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';

// TODO: Replace with real data from API
const mockData = {
  stats: {
    totalApplications: 12,
    pendingApplications: 3,
    interviews: 2,
    offers: 1,
  },
  recentApplications: [
    {
      id: '1',
      company: 'Google',
      role: 'Software Engineer Intern',
      status: ApplicationStatus.INTERVIEW,
      appliedDate: '2024-01-15',
    },
    {
      id: '2',
      company: 'Microsoft',
      role: 'Product Manager Intern',
      status: ApplicationStatus.APPLIED,
      appliedDate: '2024-01-14',
    },
    {
      id: '3',
      company: 'Amazon',
      role: 'SDE Intern',
      status: ApplicationStatus.SHORTLISTED,
      appliedDate: '2024-01-13',
    },
  ],
  recentFeedback: [
    {
      id: '1',
      mentor: 'John Doe',
      content: 'Great improvement in your resume structure. Consider adding more quantifiable achievements.',
      priority: FeedbackPriority.MEDIUM,
      createdAt: '2024-01-16',
    },
    {
      id: '2',
      mentor: 'Jane Smith',
      content: 'Your DSA skills are solid. Focus on system design for upcoming interviews.',
      priority: FeedbackPriority.HIGH,
      createdAt: '2024-01-15',
    },
  ],
};

export function StudentDashboard() {
  const { stats, recentApplications, recentFeedback } = mockData;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-3xl font-bold text-blue-600">{stats.interviews}</p>
              </div>
              <div className="text-2xl">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offers</p>
                <p className="text-3xl font-bold text-green-600">{stats.offers}</p>
              </div>
              <div className="text-2xl">🎉</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader
            title="Recent Applications"
            subtitle="Your latest internship applications"
            action={
              <Link href="/student/applications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{application.company}</h4>
                    <p className="text-sm text-gray-600">{application.role}</p>
                    <p className="text-xs text-gray-500">Applied: {application.appliedDate}</p>
                  </div>
                  <Badge 
                    variant={
                      application.status === 'INTERVIEW' ? 'info' :
                      application.status === 'APPLIED' ? 'neutral' :
                      application.status === 'SHORTLISTED' ? 'warning' : 'default'
                    }
                  >
                    {application.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader
            title="Recent Feedback"
            subtitle="Latest feedback from your mentors"
            action={
              <Link href="/student/feedback">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{feedback.mentor}</p>
                    <Badge 
                      variant={
                        feedback.priority === 'HIGH' ? 'error' :
                        feedback.priority === 'MEDIUM' ? 'warning' : 'success'
                      }
                      size="sm"
                    >
                      {feedback.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{feedback.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{feedback.createdAt}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" subtitle="Common tasks and shortcuts" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/student/applications/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">➕</span>
                <span>New Application</span>
              </Button>
            </Link>
            <Link href="/student/applications">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">📋</span>
                <span>View Applications</span>
              </Button>
            </Link>
            <Link href="/student/feedback">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">💬</span>
                <span>View Feedback</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
