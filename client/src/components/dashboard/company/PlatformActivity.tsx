// Platform Activity Component
// Company profile and platform engagement metrics

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function PlatformActivity() {
  const metrics = [
    { label: 'Profile views this month', value: '1,245', trend: '+12%' },
    { label: 'Company page clicks', value: '456', trend: '+8%' },
    { label: 'Application rate', value: '2.6%', trend: '+0.3%' },
    { label: 'Average time to hire', value: '18 days', trend: '-2 days' }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Platform Activity</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  metric.trend.startsWith('+') ? 'text-green-600' : 
                  metric.trend.startsWith('-') && metric.label.includes('time') ? 'text-green-600' :
                  'text-red-600'
                }`}>
                  {metric.trend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}