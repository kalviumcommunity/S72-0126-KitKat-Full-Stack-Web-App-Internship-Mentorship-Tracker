// Student Dashboard component - Server Component
// Main dashboard view for students

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { NoApplicationsState, NoFeedbackState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackPriority, NotificationType } from '@/lib/types';

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
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
          Track your internship applications, receive mentor feedback, and accelerate your career journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-400 bg-green-400/20 backdrop-blur-sm px-3 py-1 rounded-full">+2 this week</span>
              </div>
              <div>
                <p className="text-3xl font-light text-white mb-1">{stats.totalApplications}</p>
                <p className="text-sm font-medium text-gray-300">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-light text-amber-400 mb-1">{stats.pendingApplications}</p>
                <p className="text-sm font-medium text-gray-300">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-light text-blue-400 mb-1">{stats.interviews}</p>
                <p className="text-sm font-medium text-gray-300">Interviews Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-light text-green-400 mb-1">{stats.offers}</p>
                <p className="text-sm font-medium text-gray-300">Offers Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader
            title="Recent Applications"
            subtitle="Your latest internship applications"
            action={
              <Link href="/dashboard/user/applications">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl">
                  View All
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            }
          />
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-6">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 group border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm text-lg font-semibold text-white group-hover:bg-white/30 transition-all">
                        {application.company[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{application.company}</h4>
                        <p className="text-sm text-gray-300">{application.role}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge
                        variant={
                          application.status === 'INTERVIEW' ? 'info' :
                            application.status === 'APPLIED' ? 'neutral' :
                              application.status === 'SHORTLISTED' ? 'warning' : 'default'
                        }
                        className="rounded-full"
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
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader
            title="Recent Feedback"
            subtitle="Latest feedback from your mentors"
            action={
              <Link href="/dashboard/user/feedback">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl">
                  View All
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            }
          />
          <CardContent>
            {recentFeedback.length > 0 ? (
              <div className="space-y-6">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm font-semibold">
                          {feedback.mentor[0]}
                        </div>
                        <p className="text-sm font-semibold text-white">{feedback.mentor}</p>
                      </div>
                      <span className="text-xs text-gray-400">{feedback.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">{feedback.content}</p>
                    <Badge
                      variant={
                        feedback.priority === 'HIGH' ? 'error' :
                          feedback.priority === 'MEDIUM' ? 'warning' : 'success'
                      }
                      size="sm"
                      className="rounded-full"
                    >
                      {feedback.priority} Priority
                    </Badge>
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
      <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <CardContent className="p-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-3">
              <h3 className="text-2xl font-light tracking-tight">Ready to accelerate your career?</h3>
              <p className="text-gray-300 leading-relaxed max-w-md">Start by tracking a new application, finding a mentor, or reviewing feedback to enhance your profile.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard/user/applications/new">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 border-none font-medium rounded-2xl px-8">
                  New Application
                </Button>
              </Link>
              <Link href="/dashboard/user/mentors/find">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-2xl px-8">
                  Find Mentor
                </Button>
              </Link>
              <Link href="/dashboard/user/feedback">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-2xl px-8">
                  View Feedback
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
