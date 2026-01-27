// Key Metrics Row Component
// Four metric cards showing key statistics

'use client';

import { Card, CardContent } from '@/components/ui/Card';

export function KeyMetricsRow() {
  const metrics = [
    {
      title: 'Total Applications',
      value: 42,
      trend: '+5 this week',
      trendUp: true,
      icon: '📊',
      color: 'blue'
    },
    {
      title: 'Active Applications',
      value: 18,
      subtitle: 'Status breakdown',
      icon: '⚡',
      color: 'green',
      miniChart: true
    },
    {
      title: 'Interviews Scheduled',
      value: 3,
      subtitle: 'Next: Tomorrow 2 PM',
      icon: '🎯',
      color: 'purple'
    },
    {
      title: 'Mentor Sessions',
      value: 12,
      subtitle: 'Next: Jan 30',
      icon: '👨‍🏫',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
      green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
      purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
      orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getColorClasses(metric.color).split(' ')[0]} ${getColorClasses(metric.color).split(' ')[1]} flex items-center justify-center text-white text-xl`}>
                {metric.icon}
              </div>
              {metric.trend && (
                <div className={`flex items-center space-x-1 text-sm ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{metric.trendUp ? '↗️' : '↘️'}</span>
                  <span>{metric.trend}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {metric.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {metric.value}
              </p>
              
              {metric.subtitle && (
                <p className="text-sm text-gray-600">
                  {metric.subtitle}
                </p>
              )}

              {metric.miniChart && (
                <div className="mt-3 flex space-x-1">
                  <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">75%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}