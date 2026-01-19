// Mentor Dashboard component - Server Component
// Main dashboard view for mentors

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, NoStudentsState } from '@/components/ui/EmptyState';
import { DashboardAction } from './DashboardAction';
import Link from 'next/link';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';

// TODO: Replace with real data from API
const mockData = {
  stats: {
    totalStudents: 8,
    totalApplications: 45,
    feedbackGiven: 23,
    pendingReviews: 5,
  },
  assignedStudents: [],
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="text-3xl bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-indigo-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalApplications}</p>
              </div>
              <div className="text-3xl bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center">📋</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Feedback Given</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-green-600">{stats.feedbackGiven}</p>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+5 this week</span>
                </div>
              </div>
              <div className="text-3xl bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center">💬</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-white to-orange-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingReviews}</p>
              </div>
              <div className="text-3xl bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center">⏰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Students */}
        <Card className="border-none shadow-md">
          <CardHeader
            title="Assigned Students"
            subtitle="Students under your mentorship"
            action={
              <Link href="/mentor/students">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All →</Button>
              </Link>
            }
          />
          <CardContent>
            {assignedStudents.length > 0 ? (
              <div className="space-y-4">
                {assignedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 rounded-full flex items-center justify-center font-bold shadow-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      <div className="mb-1">
                        <span className="font-medium text-gray-600">{student.applications}</span> applications
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
        <Card className="border-none shadow-md">
          <CardHeader
            title="Applications to Review"
            subtitle="Recent applications from your students"
            action={
              <Link href="/mentor/feedback">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">Review All →</Button>
              </Link>
            }
          />
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-orange-100 group">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{application.company}</h4>
                        <p className="text-sm text-gray-500 mb-1">{application.role}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-[10px] font-bold">
                            {application.student[0]}
                          </span>
                          <span>{application.student}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
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
                          <div className="flex items-center text-orange-600 text-xs font-medium animate-pulse">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                            Needs Review
                          </div>
                        )}
                      </div>
                    </div>
                    {application.needsReview && (
                      <DashboardAction
                        size="sm"
                        className="w-full mt-2 bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all"
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
                icon="🎉"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-md bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Mentor Actions</h3>
              <p className="text-slate-300">Quickly manage your students and provide crucial feedback.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/mentor/feedback/new">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-50 border-none font-semibold">
                  ✍️ Provide Feedback
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
