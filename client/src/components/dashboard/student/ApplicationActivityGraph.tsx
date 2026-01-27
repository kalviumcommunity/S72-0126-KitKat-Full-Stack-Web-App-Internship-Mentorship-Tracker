// Application Activity Graph Component
// Line chart showing application activity over time with trends and comparisons

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type TimeFilter = 'week' | 'month' | 'quarter';

export function ApplicationActivityGraph() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  // Mock data for different time periods
  const mockData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      userApplications: [2, 1, 3, 0, 4, 1, 2],
      averageApplications: [1.5, 1.2, 2.1, 0.8, 2.8, 0.9, 1.1],
      successRate: [0, 100, 33, 0, 50, 100, 50]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      userApplications: [8, 12, 6, 10],
      averageApplications: [6, 8, 5, 7],
      successRate: [25, 33, 50, 30]
    },
    quarter: {
      labels: ['Jan', 'Feb', 'Mar'],
      userApplications: [15, 18, 22],
      averageApplications: [12, 14, 16],
      successRate: [20, 28, 36]
    }
  };

  const currentData = mockData[timeFilter];
  const totalApplications = currentData.userApplications.reduce((sum, val) => sum + val, 0);
  const averageTotal = Math.round(currentData.averageApplications.reduce((sum, val) => sum + val, 0));
  const currentSuccessRate = Math.round(currentData.successRate.reduce((sum, val) => sum + val, 0) / currentData.successRate.length);

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...currentData.userApplications,
    ...currentData.averageApplications
  );

  // SVG dimensions
  const width = 400;
  const height = 200;
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  // Create path for user applications line
  const createPath = (data: number[]) => {
    const points = data.map((value, index) => {
      const x = padding + (index * (chartWidth / (data.length - 1)));
      const y = padding + chartHeight - ((value / maxValue) * chartHeight);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const userPath = createPath(currentData.userApplications);
  const averagePath = createPath(currentData.averageApplications);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Application Activity</h2>
            <p className="text-sm text-gray-600">
              Track your application trends and compare with average students
            </p>
          </div>
          
          {/* Time Filter Buttons */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'quarter'] as TimeFilter[]).map((filter) => (
              <Button
                key={filter}
                size="sm"
                variant={timeFilter === filter ? 'default' : 'ghost'}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1 text-xs ${
                  timeFilter === filter 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
            <div className="text-sm text-gray-600">Your Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{averageTotal}</div>
            <div className="text-sm text-gray-600">Average Student</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentSuccessRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <svg width={width} height={height} className="w-full">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={padding + (chartHeight * ratio)}
                x2={width - padding}
                y2={padding + (chartHeight * ratio)}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <text
                key={ratio}
                x={padding - 10}
                y={padding + (chartHeight * ratio) + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {Math.round(maxValue * (1 - ratio))}
              </text>
            ))}

            {/* X-axis labels */}
            {currentData.labels.map((label, index) => (
              <text
                key={label}
                x={padding + (index * (chartWidth / (currentData.labels.length - 1)))}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {label}
              </text>
            ))}

            {/* Average line (dashed) */}
            <path
              d={averagePath}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* User line */}
            <path
              d={userPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            {/* Data points for user line */}
            {currentData.userApplications.map((value, index) => {
              const x = padding + (index * (chartWidth / (currentData.userApplications.length - 1)));
              const y = padding + chartHeight - ((value / maxValue) * chartHeight);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}

            {/* Data points for average line */}
            {currentData.averageApplications.map((value, index) => {
              const x = padding + (index * (chartWidth / (currentData.averageApplications.length - 1)));
              const y = padding + chartHeight - ((value / maxValue) * chartHeight);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#9ca3af"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-blue-600"></div>
              <span className="text-sm text-gray-600">Your Applications</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
              <span className="text-sm text-gray-600">Average Student</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 space-y-3">
          {totalApplications > averageTotal && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600">📈</span>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Great job! You're {totalApplications - averageTotal} applications ahead of the average student.
                </p>
              </div>
            </div>
          )}
          
          {currentSuccessRate > 30 && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600">🎯</span>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Your {currentSuccessRate}% success rate is above average! Keep up the quality applications.
                </p>
              </div>
            </div>
          )}

          {totalApplications < averageTotal && (
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-600">💡</span>
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Consider increasing your application volume. You're {averageTotal - totalApplications} applications behind the average.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}