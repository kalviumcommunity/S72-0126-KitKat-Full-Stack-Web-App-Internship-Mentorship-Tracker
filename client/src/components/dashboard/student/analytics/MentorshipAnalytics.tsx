// Mentorship Analytics Component
// Engagement metrics, improvement tracking, and feedback implementation

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TimeRange } from '@/app/dashboard/user/analytics/page';

interface MentorshipAnalyticsProps {
  timeRange: TimeRange;
}

export function MentorshipAnalytics({ timeRange }: MentorshipAnalyticsProps) {
  const engagementMetrics = {
    totalSessions: 24,
    averageRating: 4.7,
    topicsCovered: [
      { topic: 'Resume', sessions: 8, improvement: 20 },
      { topic: 'Interview', sessions: 10, improvement: 25 },
      { topic: 'Technical', sessions: 6, improvement: 15 }
    ]
  };

  const improvementTracking = {
    beforeAfter: [
      { metric: 'Resume Quality Score', before: 65, after: 85, improvement: 20 },
      { metric: 'Interview Confidence', before: 60, after: 80, improvement: 20 },
      { metric: 'Technical Skills', before: 70, after: 85, improvement: 15 }
    ],
    progressOverTime: [
      { month: 'Oct', resume: 65, interview: 60, technical: 70 },
      { month: 'Nov', resume: 72, interview: 68, technical: 75 },
      { month: 'Dec', resume: 78, interview: 74, technical: 80 },
      { month: 'Jan', resume: 85, interview: 80, technical: 85 }
    ]
  };

  const feedbackImplementation = {
    received: 45,
    implemented: 38,
    pending: 7,
    implementationRate: 84,
    impactOnSuccessRate: 20
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Mentorship Analytics</h2>
      
      <div className="space-y-6">
        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Engagement Metrics</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {engagementMetrics.totalSessions}
                </div>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {engagementMetrics.averageRating}/5
                </div>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Topics Covered</h4>
              <div className="space-y-3">
                {engagementMetrics.topicsCovered.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{topic.topic}</span>
                        <span className="text-sm text-gray-600">
                          {topic.sessions} sessions
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(topic.sessions / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <Badge className="ml-3 bg-green-100 text-green-800" size="sm">
                      +{topic.improvement}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Tracking */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Improvement Tracking</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Before/After Comparison */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Before/After Comparison</h4>
                <div className="space-y-3">
                  {improvementTracking.beforeAfter.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <Badge className="bg-green-100 text-green-800" size="sm">
                          +{metric.improvement}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Before: {metric.before}%</span>
                            <span>After: {metric.after}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${metric.after}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Over Time */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Progress Over Time</h4>
                <div className="h-32 flex items-end justify-between space-x-2">
                  {improvementTracking.progressOverTime.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-full flex flex-col items-center space-y-1">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${(data.resume / 100) * 80}px` }}
                        ></div>
                        <div 
                          className="w-full bg-green-500"
                          style={{ height: `${(data.interview / 100) * 80}px` }}
                        ></div>
                        <div 
                          className="w-full bg-purple-500 rounded-b"
                          style={{ height: `${(data.technical / 100) * 80}px` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{data.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Resume</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Interview</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Technical</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Implementation */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Feedback Implementation</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-blue-600 mb-1">
                    {feedbackImplementation.received}
                  </div>
                  <p className="text-xs text-gray-600">Feedback Received</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600 mb-1">
                    {feedbackImplementation.implemented}
                  </div>
                  <p className="text-xs text-gray-600">Implemented</p>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-600 mb-1">
                    {feedbackImplementation.pending}
                  </div>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Implementation Rate</span>
                  <span className="text-sm font-bold text-green-600">
                    {feedbackImplementation.implementationRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${feedbackImplementation.implementationRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Impact on Success Rate
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    +{feedbackImplementation.impactOnSuccessRate}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}