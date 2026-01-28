// Feedback Analytics Component
// Analytics and insights about feedback patterns and impact

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function FeedbackAnalytics() {
  const analyticsData = {
    overview: {
      totalFeedback: 67,
      averageRating: 4.8,
      implementationRate: 85,
      responseTime: 1.2
    },
    categoryBreakdown: [
      { category: 'Resume Review', count: 23, avgRating: 4.9, implementationRate: 92 },
      { category: 'Technical Interview', count: 18, avgRating: 4.7, implementationRate: 78 },
      { category: 'Behavioral Interview', count: 12, avgRating: 4.6, implementationRate: 83 },
      { category: 'Career Strategy', count: 8, avgRating: 5.0, implementationRate: 95 },
      { category: 'General Guidance', count: 6, avgRating: 4.8, implementationRate: 88 }
    ],
    monthlyTrends: [
      { month: 'Sep', feedback: 12, rating: 4.6 },
      { month: 'Oct', feedback: 15, rating: 4.7 },
      { month: 'Nov', feedback: 18, rating: 4.8 },
      { month: 'Dec', feedback: 14, rating: 4.9 },
      { month: 'Jan', feedback: 8, rating: 4.8 }
    ],
    impactMetrics: {
      studentsHelped: 23,
      interviewsSecured: 15,
      offersReceived: 8,
      averageTimeToOffer: 2.3
    },
    topStrengths: [
      'Detailed and actionable feedback',
      'Quick response time',
      'Personalized recommendations',
      'Follow-up and support',
      'Industry expertise'
    ],
    improvementAreas: [
      'More technical deep-dives',
      'System design guidance',
      'Salary negotiation tips',
      'Industry-specific advice'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analyticsData.overview.totalFeedback}
            </div>
            <div className="text-sm text-gray-600">Total Feedback Given</div>
            <div className="text-xs text-green-600 mt-1">+12 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {analyticsData.overview.averageRating}⭐
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="text-xs text-green-600 mt-1">+0.2 from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analyticsData.overview.implementationRate}%
            </div>
            <div className="text-sm text-gray-600">Implementation Rate</div>
            <div className="text-xs text-green-600 mt-1">Above average</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analyticsData.overview.responseTime}
            </div>
            <div className="text-sm text-gray-600">Avg Response Time (weeks)</div>
            <div className="text-xs text-green-600 mt-1">Faster than 90% of mentors</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Feedback by Category</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.categoryBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{category.category}</h4>
                    <Badge className="bg-blue-100 text-blue-800">
                      {category.count} feedback items
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Avg Rating: </span>
                      <span className="font-medium text-yellow-600">{category.avgRating}⭐</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Implementation: </span>
                      <span className="font-medium text-green-600">{category.implementationRate}%</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(category.count / 23) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Monthly Trends</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {analyticsData.monthlyTrends.map((month, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{month.month}</div>
                <div className="text-2xl font-bold text-blue-600 my-2">{month.feedback}</div>
                <div className="text-sm text-gray-600">feedback</div>
                <div className="text-sm text-yellow-600 mt-1">{month.rating}⭐</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Student Success Impact</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.impactMetrics.studentsHelped}
              </div>
              <div className="text-sm text-green-800">Students Helped</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.impactMetrics.interviewsSecured}
              </div>
              <div className="text-sm text-blue-800">Interviews Secured</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData.impactMetrics.offersReceived}
              </div>
              <div className="text-sm text-purple-800">Offers Received</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {analyticsData.impactMetrics.averageTimeToOffer}
              </div>
              <div className="text-sm text-orange-800">Avg Months to Offer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Quality Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Your Feedback Strengths</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topStrengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">{index + 1}</span>
                  </div>
                  <span className="text-green-800 font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Areas for Enhancement</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600">💡</span>
                  </div>
                  <span className="text-yellow-800 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Recommendations for You</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">🎯</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Focus on System Design</h4>
                <p className="text-blue-800 text-sm">
                  Students are requesting more system design guidance. Consider creating templates for this area.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📈</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Excellent Response Time</h4>
                <p className="text-green-800 text-sm">
                  Your 1.2 week average response time is excellent. Keep up the great work!
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🏆</span>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">High Impact Mentoring</h4>
                <p className="text-purple-800 text-sm">
                  Your students have a 35% higher success rate than average. Consider sharing your approach with other mentors.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}