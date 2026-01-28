// Students Performance View Component
// Table view showing student performance metrics

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface StudentsPerformanceViewProps {
  filterStatus: string;
  searchQuery: string;
  sortBy: string;
}

export function StudentsPerformanceView({ filterStatus, searchQuery, sortBy }: StudentsPerformanceViewProps) {
  const students = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩‍💻',
      email: 'sarah.johnson@ucla.edu',
      joinDate: '2024-01-15',
      sessionsCompleted: 12,
      feedbackGiven: 18,
      applicationSuccessRate: 75,
      lastInteraction: '2 days ago',
      progressTrend: 'up',
      currentApplications: 8,
      interviews: 3,
      offers: 2
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: '👨‍💼',
      email: 'mike.chen@stanford.edu',
      joinDate: '2024-01-20',
      sessionsCompleted: 8,
      feedbackGiven: 12,
      applicationSuccessRate: 60,
      lastInteraction: '1 day ago',
      progressTrend: 'up',
      currentApplications: 5,
      interviews: 2,
      offers: 1
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: '👩‍🎓',
      email: 'emma.davis@berkeley.edu',
      joinDate: '2024-02-01',
      sessionsCompleted: 15,
      feedbackGiven: 22,
      applicationSuccessRate: 85,
      lastInteraction: '3 hours ago',
      progressTrend: 'up',
      currentApplications: 12,
      interviews: 5,
      offers: 3
    },
    {
      id: 4,
      name: 'John Smith',
      avatar: '👨‍💻',
      email: 'john.smith@usc.edu',
      joinDate: '2024-01-10',
      sessionsCompleted: 6,
      feedbackGiven: 8,
      applicationSuccessRate: 40,
      lastInteraction: '1 week ago',
      progressTrend: 'down',
      currentApplications: 3,
      interviews: 1,
      offers: 0
    },
    {
      id: 5,
      name: 'Lisa Wang',
      avatar: '👩‍💼',
      email: 'lisa.wang@caltech.edu',
      joinDate: '2024-02-10',
      sessionsCompleted: 10,
      feedbackGiven: 14,
      applicationSuccessRate: 70,
      lastInteraction: '4 days ago',
      progressTrend: 'stable',
      currentApplications: 6,
      interviews: 2,
      offers: 1
    }
  ];

  const getTrendIcon = (trend: string) => {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };
    return icons[trend as keyof typeof icons] || '➡️';
  };

  const getTrendColor = (trend: string) => {
    const colors = {
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600'
    };
    return colors[trend as keyof typeof colors] || 'text-gray-600';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sessions</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Feedback</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Success Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Applications</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Interaction</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trend</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{student.sessionsCompleted}</div>
                    <div className="text-sm text-gray-600">completed</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{student.feedbackGiven}</div>
                    <div className="text-sm text-gray-600">items given</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`font-semibold ${getSuccessRateColor(student.applicationSuccessRate)}`}>
                      {student.applicationSuccessRate}%
                    </div>
                    <div className="text-sm text-gray-600">success rate</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="font-medium">{student.currentApplications}</span> active
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{student.interviews}</span> interviews
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-green-600">{student.offers}</span> offers
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{student.lastInteraction}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center space-x-1 ${getTrendColor(student.progressTrend)}`}>
                      <span>{getTrendIcon(student.progressTrend)}</span>
                      <span className="text-sm font-medium capitalize">{student.progressTrend}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Session
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <div className="text-sm text-blue-800">Avg Success Rate</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">51</div>
            <div className="text-sm text-green-800">Total Sessions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">74</div>
            <div className="text-sm text-purple-800">Feedback Items</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">7</div>
            <div className="text-sm text-orange-800">Total Offers</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}