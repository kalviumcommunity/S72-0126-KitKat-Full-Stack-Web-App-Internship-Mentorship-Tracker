// Mentor Dashboard component - Server Component
// Main dashboard view for mentors

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, NoStudentsState } from '@/components/ui/EmptyState';
import { DashboardAction } from './DashboardAction';
import Link from 'next/link';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackPriority, NotificationType } from '@/lib/types';

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
      email: 'alice.johnson@university.edu',
      applications: 5,
      lastActivity: '2 hours ago',
    },
    {
      id: '2', 
      name: 'Bob Smith',
      email: 'bob.smith@university.edu',
      applications: 3,
      lastActivity: '1 day ago',
    },
  ] as Array<{
    id: string;
    name: string;
    email: string;
    applications: number;
    lastActivity: string;
  }>,
  recentApplications: [
    {
      id: '1',
      student: 'Alice Johnson',
      company: 'Google',
      role: 'Software Engineer Intern',
      status: ApplicationStatus.APPLIED,
      needsReview: true,
    },
    {
      id: '2',
      student: 'Bob Smith',
      company: 'Microsoft',
      role: 'Product Manager Intern',
      status: ApplicationStatus.INTERVIEW,
      needsReview: false,
    },
    {
      id: '3',
      student: 'Carol Davis',
      company: 'Amazon',
      role: 'SDE Intern',
      status: ApplicationStatus.SHORTLISTED,
      needsReview: true,
    },
  ],
};

export function MentorDashboard() {
  const { stats, assignedStudents, recentApplications } = mockData;

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-light text-white tracking-tight">
          Mentor Dashboard
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
          Guide your students through their career journey with personalized feedback and mentorship.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-light text-white mb-1">{stats.totalStudents}</p>
                <p className="text-sm font-medium text-gray-300">Assigned Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-light text-indigo-400 mb-1">{stats.totalApplications}</p>
                <p className="text-sm font-medium text-gray-300">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-400 bg-green-400/20 backdrop-blur-sm px-3 py-1 rounded-full">+5 this week</span>
              </div>
              <div>
                <p className="text-3xl font-light text-green-400 mb-1">{stats.feedbackGiven}</p>
                <p className="text-sm font-medium text-gray-300">Feedback Given</p>
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
                <p className="text-3xl font-light text-amber-400 mb-1">{stats.pendingReviews}</p>
                <p className="text-sm font-medium text-gray-300">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Students */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader
            title="Assigned Students"
            subtitle="Students under your mentorship"
            action={
              <Link href="/mentor/students">
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
            {assignedStudents.length > 0 ? (
              <div className="space-y-6">
                {assignedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 group border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center font-semibold shadow-sm group-hover:bg-white/30 transition-all">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">{student.name}</h4>
                        <p className="text-sm text-gray-300">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400 space-y-1">
                      <div>
                        <span className="font-medium text-gray-300">{student.applications}</span> applications
                      </div>
                      <div>Last active: {student.lastActivity}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoStudentsState />
            )}
          </CardContent>
        </Card>

        {/* Recent Applications Needing Review */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader
            title="Applications to Review"
            subtitle="Recent applications from your students"
            action={
              <Link href="/mentor/feedback">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl">
                  Review All
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
                  <div key={application.id} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20 group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">{application.company}</h4>
                        <p className="text-sm text-gray-300 mb-2">{application.role}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2 text-[10px] font-semibold text-white">
                            {application.student[0]}
                          </span>
                          <span>{application.student}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-3">
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
                        {application.needsReview && (
                          <div className="flex items-center text-amber-400 text-xs font-medium">
                            <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></span>
                            Needs Review
                          </div>
                        )}
                      </div>
                    </div>
                    {application.needsReview && (
                      <DashboardAction
                        size="sm"
                        className="w-full mt-4 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:border-blue-400/50 hover:text-blue-400 transition-all rounded-xl"
                        label="Provide Feedback"
                        toastTitle="Feedback Form Opened"
                        toastMessage={`Opening feedback form for ${application.student}'s application at ${application.company}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No pending reviews"
                description="You're all caught up! There are no new applications needing your review."
                icon={
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <CardContent className="p-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-3">
              <h3 className="text-2xl font-light tracking-tight">Mentor Actions</h3>
              <p className="text-gray-300 leading-relaxed max-w-md">Quickly manage your students and provide crucial feedback to help them succeed.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/mentor/feedback/new">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 border-none font-medium rounded-2xl px-8">
                  Provide Feedback
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
