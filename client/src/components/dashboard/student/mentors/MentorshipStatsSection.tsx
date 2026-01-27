// Mentorship Stats Section Component
// Overview statistics of mentorship journey

'use client';

import { Card, CardContent } from '@/components/ui/Card';

export function MentorshipStatsSection() {
  const stats = [
    {
      label: 'Total Sessions',
      value: 24,
      icon: '📅',
      color: 'blue',
      trend: '+3 this month'
    },
    {
      label: 'Hours of Mentorship',
      value: 18,
      icon: '⏰',
      color: 'green',
      trend: '+2.5 this month'
    },
    {
      label: 'Feedback Received',
      value: 32,
      icon: '💬',
      color: 'purple',
      trend: '+5 this month'
    },
    {
      label: 'Improvement Score',
      value: '+35%',
      icon: '📈',
      color: 'orange',
      trend: 'vs last quarter'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 bg-blue-50',
      green: 'from-green-500 to-green-600 bg-green-50',
      purple: 'from-purple-500 to-purple-600 bg-purple-50',
      orange: 'from-orange-500 to-orange-600 bg-orange-50'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getColorClasses(stat.color).split(' ')[0]} ${getColorClasses(stat.color).split(' ')[1]} flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {stat.trend}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}