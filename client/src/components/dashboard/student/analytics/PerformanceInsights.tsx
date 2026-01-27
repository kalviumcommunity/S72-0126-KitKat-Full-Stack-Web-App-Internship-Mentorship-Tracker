// Performance Insights Component
// Response time analysis, best performing elements, and interview performance

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TimeRange } from '@/app/dashboard/user/analytics/page';

interface PerformanceInsightsProps {
  timeRange: TimeRange;
}

export function PerformanceInsights({ timeRange }: PerformanceInsightsProps) {
  const responseTimeData = {
    averageResponse: 5,
    fastestResponse: { company: 'TechCorp', days: 1 },
    slowCompanies: [
      { company: 'BigCorp', days: 21, status: 'No Response' },
      { company: 'SlowTech', days: 18, status: 'No Response' },
      { company: 'DelayedInc', days: 15, status: 'No Response' }
    ]
  };

  const bestPerformingElements = {
    skills: [
      { skill: 'React', callbacks: 15, rate: 75 },
      { skill: 'Python', callbacks: 12, rate: 67 },
      { skill: 'AWS', callbacks: 10, rate: 63 }
    ],
    resumeVersions: [
      { version: 'v3.2', applications: 20, success: 25 },
      { version: 'v3.1', applications: 15, success: 20 },
      { version: 'v3.0', applications: 10, success: 15 }
    ],
    applicationTiming: [
      { day: 'Tuesday', time: 'Morning', responseRate: 40 },
      { day: 'Wednesday', time: 'Morning', responseRate: 35 },
      { day: 'Monday', time: 'Afternoon', responseRate: 28 }
    ]
  };

  const interviewPerformance = {
    interviewToOfferRatio: 40,
    averageInterviewsPerOffer: 2.5,
    rejectionReasons: [
      { reason: 'Technical Skills', count: 8, percentage: 35 },
      { reason: 'Cultural Fit', count: 6, percentage: 26 },
      { reason: 'Experience Level', count: 5, percentage: 22 },
      { reason: 'Communication', count: 4, percentage: 17 }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Performance Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Response Time Analysis */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Response Time Analysis</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {responseTimeData.averageResponse} days
                </div>
                <p className="text-sm text-gray-600">Average response time</p>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Fastest Response</span>
                  <Badge className="bg-green-100 text-green-800">
                    {responseTimeData.fastestResponse.days} day
                  </Badge>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  {responseTimeData.fastestResponse.company}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Companies to follow up with (>14 days):
                </h4>
                <div className="space-y-2">
                  {responseTimeData.slowCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{company.company}</span>
                      <span className="text-red-600">{company.days} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Performing Elements */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Best Performing Elements</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Skills</h4>
                <div className="space-y-2">
                  {bestPerformingElements.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{skill.skill}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{skill.callbacks} callbacks</span>
                        <Badge className="bg-blue-100 text-blue-800" size="sm">
                          {skill.rate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Versions</h4>
                <div className="space-y-2">
                  {bestPerformingElements.resumeVersions.map((version, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{version.version}</span>
                      <Badge className="bg-green-100 text-green-800" size="sm">
                        {version.success}% success
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Best Timing</h4>
                <div className="space-y-2">
                  {bestPerformingElements.applicationTiming.map((timing, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{timing.day} {timing.time}</span>
                      <Badge className="bg-purple-100 text-purple-800" size="sm">
                        +{timing.responseRate}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Performance */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Interview Performance</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {interviewPerformance.interviewToOfferRatio}%
                  </div>
                  <p className="text-xs text-gray-600">Interview to offer ratio</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {interviewPerformance.averageInterviewsPerOffer}
                  </div>
                  <p className="text-xs text-gray-600">Avg interviews per offer</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Common Rejection Reasons
                </h4>
                <div className="space-y-2">
                  {interviewPerformance.rejectionReasons.map((reason, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{reason.reason}</span>
                        <span className="text-xs text-gray-500">
                          {reason.count} ({reason.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-red-500 h-1 rounded-full"
                          style={{ width: `${reason.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}