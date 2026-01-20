// Performance Chart Component
// Visualizes application progress and success metrics

'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { ApplicationStatus } from '@/lib/types';

interface PerformanceChartProps {
  applications: {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
  };
  title?: string;
  showPercentages?: boolean;
}

interface ChartData {
  status: ApplicationStatus;
  count: number;
  percentage: number;
  color: string;
  label: string;
}

export function PerformanceChart({ 
  applications, 
  title = "Application Progress", 
  showPercentages = true 
}: PerformanceChartProps) {
  const chartData = useMemo(() => {
    const statusConfig = {
      DRAFT: { color: '#6B7280', label: 'Draft' },
      APPLIED: { color: '#3B82F6', label: 'Applied' },
      SHORTLISTED: { color: '#F59E0B', label: 'Shortlisted' },
      INTERVIEW: { color: '#8B5CF6', label: 'Interview' },
      OFFER: { color: '#10B981', label: 'Offer' },
      REJECTED: { color: '#EF4444', label: 'Rejected' },
    };

    return Object.entries(applications.byStatus)
      .map(([status, count]) => ({
        status: status as ApplicationStatus,
        count,
        percentage: applications.total > 0 ? (count / applications.total) * 100 : 0,
        color: statusConfig[status as ApplicationStatus]?.color || '#6B7280',
        label: statusConfig[status as ApplicationStatus]?.label || status,
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [applications]);

  const maxCount = Math.max(...chartData.map(item => item.count), 1);

  if (applications.total === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-600 text-sm">No applications to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">
            Total: {applications.total}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Bar Chart */}
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{item.count}</span>
                    {showPercentages && (
                      <span className="text-gray-500">
                        ({item.percentage.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      backgroundColor: item.color,
                      width: `${(item.count / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Success Metrics */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {applications.byStatus.OFFER || 0}
                </p>
                <p className="text-xs text-gray-600">Offers Received</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {((applications.byStatus.OFFER || 0) + 
                    (applications.byStatus.INTERVIEW || 0) + 
                    (applications.byStatus.SHORTLISTED || 0))}
                </p>
                <p className="text-xs text-gray-600">Positive Responses</p>
              </div>
            </div>
          </div>

          {/* Success Rate */}
          {applications.total > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-gray-900">
                  {(((applications.byStatus.OFFER || 0) / applications.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${((applications.byStatus.OFFER || 0) / applications.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}