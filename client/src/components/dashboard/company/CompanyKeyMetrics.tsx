// Company Key Metrics Component
// Key performance indicators cards

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function CompanyKeyMetrics() {
  const metrics = [
    {
      title: 'Active Job Postings',
      number: '8',
      subtitle: 'Total views: 2,450',
      detail: 'Avg applications per job: 23',
      icon: '📢',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Applicants',
      number: '184',
      subtitle: 'New this week: 15',
      detail: 'Reviewed: 120 | In pipeline: 45',
      icon: '👔',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Interviews Scheduled',
      number: '12',
      subtitle: 'This week: 5',
      detail: 'Next: Tomorrow 10 AM',
      icon: '📅',
      trend: '+25%',
      trendUp: true
    },
    {
      title: 'Offers Extended',
      number: '6',
      subtitle: 'Accepted: 4',
      detail: 'Pending: 2',
      icon: '🎯',
      trend: '+50%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{metric.icon}</span>
              <Badge 
                variant={metric.trendUp ? "default" : "secondary"}
                className={metric.trendUp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {metric.trend}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{metric.title}</h3>
              <div className="text-3xl font-bold text-blue-600">{metric.number}</div>
              <p className="text-sm text-gray-600">{metric.subtitle}</p>
              <p className="text-xs text-gray-500">{metric.detail}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}