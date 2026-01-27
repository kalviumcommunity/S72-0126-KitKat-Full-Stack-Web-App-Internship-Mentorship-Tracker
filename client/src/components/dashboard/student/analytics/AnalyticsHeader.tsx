// Analytics Header Component
// Header with title and time range selector

'use client';

import { Button } from '@/components/ui/Button';
import type { TimeRange } from '@/app/dashboard/user/analytics/page';

interface AnalyticsHeaderProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  customDateRange: { start: string; end: string };
  onCustomDateRangeChange: (range: { start: string; end: string }) => void;
}

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
  customDateRange,
  onCustomDateRangeChange
}: AnalyticsHeaderProps) {
  const timeRangeOptions = [
    { id: 'week' as TimeRange, label: 'Last 7 Days' },
    { id: 'month' as TimeRange, label: 'Last Month' },
    { id: 'quarter' as TimeRange, label: 'Last 3 Months' },
    { id: 'year' as TimeRange, label: 'Last Year' },
    { id: 'custom' as TimeRange, label: 'Custom' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and gain insights into your internship journey
          </p>
        </div>
        
        <Button variant="outline">
          <span className="mr-2">📊</span>
          Export Report
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <span className="text-sm font-medium text-gray-700">Time Range:</span>
        
        <div className="flex flex-wrap gap-2">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.id}
              variant={timeRange === option.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Range Inputs */}
        {timeRange === 'custom' && (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => onCustomDateRangeChange({
                ...customDateRange,
                start: e.target.value
              })}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => onCustomDateRangeChange({
                ...customDateRange,
                end: e.target.value
              })}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}