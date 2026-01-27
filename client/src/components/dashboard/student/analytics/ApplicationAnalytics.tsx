// Application Analytics Component
// Comprehensive application tracking with funnel, trends, and success rates

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TimeRange } from '@/app/dashboard/user/analytics/page';

interface ApplicationAnalyticsProps {
  timeRange: TimeRange;
}

export function ApplicationAnalytics({ timeRange }: ApplicationAnalyticsProps) {
  // Mock data - in real app, this would be fetched based on timeRange
  const funnelData = {
    submitted: { count: 100, percentage: 100 },
    reviewed: { count: 60, percentage: 60 },
    screening: { count: 40, percentage: 40 },
    interview: { count: 25, percentage: 25 },
    offer: { count: 10, percentage: 10 },
    rejected: { count: 50, percentage: 50 },
    noResponse: { count: 40, percentage: 40 }
  };

  const trendsData = [
    { month: 'Oct', submitted: 15, responses: 8, interviews: 4, offers: 1 },
    { month: 'Nov', submitted: 22, responses: 14, interviews: 7, offers: 2 },
    { month: 'Dec', submitted: 18, responses: 12, interviews: 6, offers: 3 },
    { month: 'Jan', submitted: 25, responses: 16, interviews: 8, offers: 4 }
  ];

  const companySuccessRates = [
    { company: 'Google', applications: 5, responses: 4, rate: 80 },
    { company: 'Microsoft', applications: 4, responses: 3, rate: 75 },
    { company: 'Apple', applications: 3, responses: 2, rate: 67 },
    { company: 'Meta', applications: 6, responses: 3, rate: 50 },
    { company: 'Amazon', applications: 8, responses: 3, rate: 38 }
  ];

  const statusDistribution = [
    { status: 'Applied', count: 35, percentage: 35, color: 'bg-blue-500' },
    { status: 'In Review', count: 25, percentage: 25, color: 'bg-yellow-500' },
    { status: 'Interview', count: 15, percentage: 15, color: 'bg-purple-500' },
    { status: 'Offer', count: 10, percentage: 10, color: 'bg-green-500' },
    { status: 'Rejected', count: 15, percentage: 15, color: 'bg-red-500' }
  ];

  const benchmarkData = {
    yourConversionRate: 10,
    industryAverage: 8,
    topPerformers: 15
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Application Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Funnel */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Application Funnel</h3>
            <p className="text-sm text-gray-600">Conversion rates at each stage</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Funnel Visualization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Applications Submitted</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-semibold">{funnelData.submitted.count}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reviewed</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-semibold">{funnelData.reviewed.count} (60%)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Screening</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-sm font-semibold">{funnelData.screening.count} (40%)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Interview</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-semibold">{funnelData.interview.count} (25%)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Offer</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-semibold">{funnelData.offer.count} (10%)</span>
                  </div>
                </div>
              </div>

              {/* Benchmark Comparison */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Conversion Rate Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Your Rate:</span>
                    <span className="font-semibold text-green-600">{benchmarkData.yourConversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Industry Average:</span>
                    <span className="font-semibold">{benchmarkData.industryAverage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Performers:</span>
                    <span className="font-semibold text-blue-600">{benchmarkData.topPerformers}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Over Time */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Applications Over Time</h3>
            <p className="text-sm text-gray-600">Monthly trends and patterns</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple Line Chart Representation */}
              <div className="h-48 flex items-end justify-between space-x-2">
                {trendsData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                    <div className="w-full flex flex-col items-center space-y-1">
                      {/* Offers */}
                      <div 
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(data.offers / 25) * 100}px` }}
                      ></div>
                      {/* Interviews */}
                      <div 
                        className="w-full bg-purple-500"
                        style={{ height: `${(data.interviews / 25) * 100}px` }}
                      ></div>
                      {/* Responses */}
                      <div 
                        className="w-full bg-yellow-500"
                        style={{ height: `${(data.responses / 25) * 100}px` }}
                      ></div>
                      {/* Submitted */}
                      <div 
                        className="w-full bg-blue-500 rounded-b"
                        style={{ height: `${(data.submitted / 25) * 100}px` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{data.month}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Submitted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Responses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Interviews</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Offers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate by Company */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Success Rate by Company</h3>
            <p className="text-sm text-gray-600">Response rates ranked by company</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companySuccessRates.map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{company.company}</span>
                      <span className="text-sm text-gray-600">
                        {company.responses}/{company.applications} ({company.rate}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          company.rate >= 70 ? 'bg-green-500' :
                          company.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${company.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Status Distribution</h3>
            <p className="text-sm text-gray-600">Current application status breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pie Chart Representation */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    {statusDistribution.map((status, index) => {
                      const offset = statusDistribution
                        .slice(0, index)
                        .reduce((sum, s) => sum + s.percentage, 0);
                      
                      return (
                        <circle
                          key={index}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="transparent"
                          stroke={status.color.replace('bg-', '#')}
                          strokeWidth="3"
                          strokeDasharray={`${status.percentage} ${100 - status.percentage}`}
                          strokeDashoffset={-offset}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">100</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {statusDistribution.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${status.color} rounded`}></div>
                      <span className="text-sm">{status.status}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {status.count} ({status.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}