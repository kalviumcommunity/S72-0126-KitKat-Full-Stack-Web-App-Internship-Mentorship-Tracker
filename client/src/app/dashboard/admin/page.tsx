// Admin Dashboard Page
// Professional administrative interface with neutral design

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                Administration Dashboard
              </h1>
              <div className="space-y-1">
                <p className="text-lg text-gray-600">
                  Welcome back, {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Badge variant="neutral" className="inline-flex rounded-full">
                Administrator
              </Badge>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="px-6 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                    <p className="text-3xl font-light text-gray-900">1,247</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Applications</p>
                    <p className="text-3xl font-light text-gray-900">3,456</p>
                    <p className="text-sm text-green-600 mt-1">+8% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">System Health</p>
                    <p className="text-3xl font-light text-emerald-600">99.9%</p>
                    <p className="text-sm text-gray-500 mt-1">All systems operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Support Tickets</p>
                    <p className="text-3xl font-light text-gray-900">23</p>
                    <p className="text-sm text-orange-600 mt-1">5 pending review</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Recent User Activity */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent User Activity</h3>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Alice Johnson</h4>
                      <Badge variant="success" size="sm" className="rounded-full">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Student registration completed</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">TechCorp Inc.</h4>
                      <Badge variant="info" size="sm" className="rounded-full">Company</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">New internship position posted</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">John Mentor</h4>
                      <Badge variant="neutral" size="sm" className="rounded-full">Mentor</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Provided student feedback</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">System Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">All Systems Operational</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Database</h4>
                      <p className="text-xs text-gray-600">All systems operational</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" className="rounded-full">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">API Services</h4>
                      <p className="text-xs text-gray-600">Response time: 120ms</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" className="rounded-full">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Service</h4>
                      <p className="text-xs text-gray-600">Minor delays detected</p>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm" className="rounded-full">Warning</Badge>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>

        {/* Analytics Overview */}
        <div className="mb-12">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Platform Analytics</h3>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">User Growth</h4>
                    <p className="text-3xl font-light text-blue-600 mt-2">+15%</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Job Placements</h4>
                    <p className="text-3xl font-light text-green-600 mt-2">89</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Satisfaction</h4>
                    <p className="text-3xl font-light text-purple-600 mt-2">4.8/5</p>
                    <p className="text-sm text-gray-500">Average rating</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Tickets */}
        <div className="mb-12">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Support Tickets</h3>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  View All Tickets
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Login Issues</h4>
                      <Badge variant="error" size="sm" className="rounded-full">High Priority</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">User unable to access dashboard after password reset</p>
                    <p className="text-xs text-gray-500">Ticket #1234 • 1 hour ago</p>
                  </div>
                  <Button size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                    Resolve
                  </Button>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">Feature Request</h4>
                      <Badge variant="info" size="sm" className="rounded-full">Medium Priority</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Request for bulk application import functionality</p>
                    <p className="text-xs text-gray-500">Ticket #1235 • 3 hours ago</p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4 rounded-lg">
                    Review
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Administrative Actions</h3>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <Button className="h-24 flex flex-col items-center justify-center space-y-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span className="text-sm font-medium">Manage Users</span>
                </Button>

                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm font-medium">View Reports</span>
                </Button>

                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">System Settings</span>
                </Button>

                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                  <span className="text-sm font-medium">Support Tickets</span>
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}