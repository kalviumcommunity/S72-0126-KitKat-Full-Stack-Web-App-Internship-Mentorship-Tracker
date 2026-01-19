// Student Dashboard component - Server Component
// Main dashboard view for students

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { NoApplicationsState, NoFeedbackState } from '@/components/ui/EmptyState';
import Link from 'next/link';

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
      status: 'INTERVIEW',
      appliedDate: '2024-01-15',
    },
    {
      id: '2',
      company: 'Microsoft',
      role: 'Product Manager Intern',
      status: 'APPLIED',
      appliedDate: '2024-01-14',
    },
    {
      id: '3',
      company: 'Amazon',
      role: 'SDE Intern',
      status: 'SHORTLISTED',
      appliedDate: '2024-01-13',
    },
  ],
  recentFeedback: [
    {
      id: '1',
      mentor: 'John Doe',
      content: 'Great improvement in your resume structure. Consider adding more quantifiable achievements.',
      priority: 'MEDIUM',
      createdAt: '2024-01-16',
    },
    {
      id: '2',
      mentor: 'Jane Smith',
      content: 'Your DSA skills are solid. Focus on system design for upcoming interviews.',
      priority: 'HIGH',
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
        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+2 this week</span>
                </div>
              </div>
              <div className="text-3xl bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center">📊</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingApplications}</p>
              </div>
              <div className="text-3xl bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center">⏳</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-indigo-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Interviews Scheduled</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.interviews}</p>
              </div>
              <div className="text-3xl bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center">🎯</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Offers Received</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.offers}</p>
              </div>
              <div className="text-3xl bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center">🎉</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="border-none shadow-md">
          <CardHeader
            title="Recent Applications"
            subtitle="Your latest internship applications"
            action={
              <Link href="/student/applications">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All →</Button>
              </Link>
            }
          />
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm text-lg font-bold text-gray-700">
                        {application.company[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{application.company}</h4>
                        <p className="text-sm text-gray-500">{application.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          application.status === 'INTERVIEW' ? 'info' :
                            application.status === 'APPLIED' ? 'neutral' :
                              application.status === 'SHORTLISTED' ? 'warning' : 'default'
                        }
                        className="mb-1"
                      >
                        {application.status}
                      </Badge>
                      <p className="text-xs text-gray-400">Applied {application.appliedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoApplicationsState />
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="border-none shadow-md">
          <CardHeader
            title="Recent Feedback"
            subtitle="Latest feedback from your mentors"
            action={
              <Link href="/student/feedback">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All →</Button>
              </Link>
            }
          />
          <CardContent>
            {recentFeedback.length > 0 ? (
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {feedback.mentor[0]}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{feedback.mentor}</p>
                      </div>
                      <span className="text-xs text-gray-400">{feedback.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{feedback.content}</p>
                    <div className="mt-3">
                      <Badge
                        variant={
                          feedback.priority === 'HIGH' ? 'error' :
                            feedback.priority === 'MEDIUM' ? 'warning' : 'success'
                        }
                        size="sm"
                      >
                        {feedback.priority} Priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoFeedbackState />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to accelerate your career?</h3>
              <p className="text-blue-100">Start by tracking a new application or requesting mentor feedback.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/student/applications/new">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                  + New Application
                </Button>
              </Link>
              <Link href="/student/feedback/submit">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
                  Request Feedback
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}