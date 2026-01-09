// Mentor Dashboard component - Server Component
// Main dashboard view for mentors

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// TODO: Replace with real data from API
const mockData = {
  stats: {
    totalStudents: 8,
    totalApplications: 45,
    feedbackGiven: 23,
    pendingReviews: 5,
  },
  assignedStudents: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      applications: 6,
      lastActivity: '2024-01-16',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      applications: 4,
      lastActivity: '2024-01-15',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      applications: 8,
      lastActivity: '2024-01-14',
    },
  ],
  recentApplications: [
    {
      id: '1',
      student: 'Alice Johnson',
      company: 'Google',
      role: 'Software Engineer Intern',
      status: 'APPLIED',
      needsReview: true,
    },
    {
      id: '2',
      student: 'Bob Smith',
      company: 'Microsoft',
      role: 'Product Manager Intern',
      status: 'INTERVIEW',
      needsReview: false,
    },
    {
      id: '3',
      student: 'Carol Davis',
      company: 'Amazon',
      role: 'SDE Intern',
      status: 'SHORTLISTED',
      needsReview: true,
    },
  ],
};

export function MentorDashboard() {
  const { stats, assignedStudents, recentApplications } = mockData;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feedback Given</p>
                <p className="text-3xl font-bold text-green-600">{stats.feedbackGiven}</p>
              </div>
              <div className="text-2xl">💬</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingReviews}</p>
              </div>
              <div className="text-2xl">⏰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Students */}
        <Card>
          <CardHeader
            title="Assigned Students"
            subtitle="Students under your mentorship"
            action={
              <Link href="/mentor/students">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {assignedStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                      <p className="text-xs text-gray-500">
                        {student.applications} applications • Last active: {student.lastActivity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications Needing Review */}
        <Card>
          <CardHeader
            title="Applications to Review"
            subtitle="Recent applications from your students"
            action={
              <Link href="/mentor/feedback">
                <Button variant="outline" size="sm">Review All</Button>
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{application.company}</h4>
                      <p className="text-sm text-gray-600">{application.role}</p>
                      <p className="text-xs text-gray-500">Student: {application.student}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge 
                        variant={
                          application.status === 'INTERVIEW' ? 'info' :
                          application.status === 'APPLIED' ? 'neutral' :
                          application.status === 'SHORTLISTED' ? 'warning' : 'default'
                        }
                      >
                        {application.status}
                      </Badge>
                      {application.needsReview && (
                        <Badge variant="error" size="sm">
                          Needs Review
                        </Badge>
                      )}
                    </div>
                  </div>
                  {application.needsReview && (
                    <Button size="sm" className="w-full mt-2">
                      Provide Feedback
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" subtitle="Common mentoring tasks" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/mentor/feedback/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">✍️</span>
                <span>Provide Feedback</span>
              </Button>
            </Link>
            <Link href="/mentor/students">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">👥</span>
                <span>View Students</span>
              </Button>
            </Link>
            <Link href="/mentor/feedback">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <span className="text-2xl">📊</span>
                <span>Review History</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}