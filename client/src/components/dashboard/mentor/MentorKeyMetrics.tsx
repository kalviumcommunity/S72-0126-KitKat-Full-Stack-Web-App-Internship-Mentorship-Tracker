// Mentor Key Metrics Component
// Key performance indicators and statistics for mentors

'use client';

import { Card, CardContent } from '@/components/ui/Card';

export function MentorKeyMetrics() {
  const metrics = [
    {
      title: 'Active Students',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: '👥',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Sessions This Month',
      value: '24',
      change: '+6',
      changeType: 'increase',
      icon: '📅',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Feedback Given',
      value: '47',
      change: '+12',
      changeType: 'increase',
      icon: '💬',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Student Success Rate',
      value: '85%',
      change: '+5%',
      changeType: 'increase',
      icon: '🎯',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Pending Reviews',
      value: '5',
      change: '-2',
      changeType: 'decrease',
      icon: '⏳',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Average Rating',
      value: '4.9',
      change: '+0.1',
      changeType: 'increase',
      icon: '⭐',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <div className={`text-sm font-medium ${
                metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}