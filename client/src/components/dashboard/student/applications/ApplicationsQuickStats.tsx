// Applications Quick Stats Component
// Shows overview statistics and success rate comparison

'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ApplicationsQuickStats() {
  // Mock data - in real app, this would come from API/context
  const stats = {
    total: 42,
    applied: 15,
    inProgress: 11, // screening + interview
    offers: 2,
    rejected: 14,
    successRate: 14, // (offers / (offers + rejected)) * 100
    averageSuccessRate: 18 // platform average
  };

  const getStatusColor = (status: string) => {
    const colors = {
      total: 'bg-gray-100 text-gray-800',
      applied: 'bg-blue-100 text-blue-800',
      inProgress: 'bg-yellow-100 text-yellow-800',
      offers: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const isAboveAverage = stats.successRate > stats.averageSuccessRate;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <Badge className={getStatusColor('total')} size="lg">
                {stats.total}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Applied:</span>
              <Badge className={getStatusColor('applied')} size="lg">
                {stats.applied}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">In Progress:</span>
              <Badge className={getStatusColor('inProgress')} size="lg">
                {stats.inProgress}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Offers:</span>
              <Badge className={getStatusColor('offers')} size="lg">
                {stats.offers}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Rejected:</span>
              <Badge className={getStatusColor('rejected')} size="lg">
                {stats.rejected}
              </Badge>
            </div>
          </div>

          {/* Success Rate */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Success Rate:</span>
                <span className={`text-lg font-bold ${
                  isAboveAverage ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {stats.successRate}%
                </span>
                {isAboveAverage ? (
                  <span className="text-green-600">↗️</span>
                ) : (
                  <span className="text-orange-600">↘️</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Platform avg: {stats.averageSuccessRate}%
              </div>
            </div>

            {/* Success Rate Indicator */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={isAboveAverage ? "#10b981" : "#f59e0b"}
                  strokeWidth="2"
                  strokeDasharray={`${stats.successRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${
                  isAboveAverage ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {stats.successRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              {isAboveAverage ? (
                <p className="text-sm text-green-800 bg-green-50 rounded-lg p-3">
                  <strong>Great job!</strong> Your success rate is {stats.successRate - stats.averageSuccessRate}% above the platform average. 
                  Keep focusing on quality applications and thorough preparation.
                </p>
              ) : (
                <p className="text-sm text-orange-800 bg-orange-50 rounded-lg p-3">
                  <strong>Room for improvement:</strong> Your success rate is {stats.averageSuccessRate - stats.successRate}% below average. 
                  Consider getting mentor feedback on your applications and interview preparation.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}