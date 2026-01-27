// Admin Dashboard Page
// Role-based dashboard for administrators

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">Email: {user.email}</p>
            <Badge className="mt-2 bg-red-100 text-red-800">Administrator</Badge>
          </div>
          <Button 
            onClick={logout}
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">1,247</p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Applications</p>
                  <p className="text-3xl font-bold text-gray-900">3,456</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">System Health</p>
                  <p className="text-3xl font-bold text-green-600">99.9%</p>
                </div>
                <div className="text-3xl">💚</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Support Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">23</p>
                </div>
                <div className="text-3xl">🎫</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Recent User Activity</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Alice Johnson</h3>
                    <p className="text-sm text-gray-600">Student • Registered</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">TechCorp Inc.</h3>
                    <p className="text-sm text-gray-600">Company • Posted Job</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Company</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">John Mentor</h3>
                    <p className="text-sm text-gray-600">Mentor • Provided Feedback</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Mentor</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Monitoring */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">System Status</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Database</h3>
                    <p className="text-sm text-gray-600">All systems operational</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">API Services</h3>
                    <p className="text-sm text-gray-600">Response time: 120ms</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Service</h3>
                    <p className="text-sm text-gray-600">Minor delays detected</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Platform Analytics</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📈</div>
                  <h3 className="font-semibold text-lg">User Growth</h3>
                  <p className="text-2xl font-bold text-blue-600">+15%</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">💼</div>
                  <h3 className="font-semibold text-lg">Job Placements</h3>
                  <p className="text-2xl font-bold text-green-600">89</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-semibold text-lg">Satisfaction</h3>
                  <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                  <p className="text-sm text-gray-600">Average rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Support Tickets */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Recent Support Tickets</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Login Issues</h3>
                    <p className="text-sm text-gray-600">User unable to access dashboard</p>
                    <p className="text-xs text-gray-500">Ticket #1234 • 1 hour ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className="bg-red-100 text-red-800">High</Badge>
                    <Button size="sm">Resolve</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Feature Request</h3>
                    <p className="text-sm text-gray-600">Request for bulk application import</p>
                    <p className="text-xs text-gray-500">Ticket #1235 • 3 hours ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Admin Actions</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">👥</span>
                  <span>Manage Users</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <span className="text-2xl">📊</span>
                  <span>View Reports</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <span className="text-2xl">⚙️</span>
                  <span>System Settings</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <span className="text-2xl">🎫</span>
                  <span>Support Tickets</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}