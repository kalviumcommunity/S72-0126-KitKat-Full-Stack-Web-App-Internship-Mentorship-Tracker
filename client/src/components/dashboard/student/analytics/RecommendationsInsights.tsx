// Recommendations & Insights Component
// AI-powered insights and actionable recommendations

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { TimeRange } from '@/app/dashboard/user/analytics/page';

interface RecommendationsInsightsProps {
  timeRange: TimeRange;
}

export function RecommendationsInsights({ timeRange }: RecommendationsInsightsProps) {
  const aiInsights = [
    {
      id: 1,
      type: 'warning',
      priority: 'high',
      title: 'Application Rate Decline',
      message: 'Your application rate dropped 30% this month. Consider setting a weekly goal to maintain momentum.',
      action: 'Set Goal',
      icon: '📉',
      color: 'red'
    },
    {
      id: 2,
      type: 'tip',
      priority: 'medium',
      title: 'Optimal Application Timing',
      message: 'Applications sent on Tuesday have 2x higher success rate. Schedule your applications accordingly.',
      action: 'Schedule Apps',
      icon: '📅',
      color: 'blue'
    },
    {
      id: 3,
      type: 'skill',
      priority: 'high',
      title: 'Skill Gap Identified',
      message: 'Consider updating React skills - 15 new job postings require advanced React knowledge.',
      action: 'Learn React',
      icon: '⚛️',
      color: 'purple'
    },
    {
      id: 4,
      type: 'resume',
      priority: 'medium',
      title: 'Resume Optimization',
      message: 'Your resume scores 85/100. Improve by adding more quantifiable achievements to reach 90+.',
      action: 'Update Resume',
      icon: '📄',
      color: 'green'
    },
    {
      id: 5,
      type: 'networking',
      priority: 'low',
      title: 'Networking Opportunity',
      message: '3 alumni from your university work at companies you\'re targeting. Consider reaching out.',
      action: 'Connect',
      icon: '🤝',
      color: 'orange'
    }
  ];

  const trendAnalysis = {
    applicationTrends: {
      trend: 'declining',
      change: -30,
      recommendation: 'Increase application frequency to 5 per week'
    },
    responseRates: {
      trend: 'improving',
      change: 15,
      recommendation: 'Continue current application strategy'
    },
    interviewSuccess: {
      trend: 'stable',
      change: 2,
      recommendation: 'Focus on technical interview preparation'
    }
  };

  const actionableGoals = [
    {
      goal: 'Apply to 5 companies this week',
      progress: 60,
      dueDate: 'This Friday',
      priority: 'high'
    },
    {
      goal: 'Complete Docker certification',
      progress: 75,
      dueDate: 'Next month',
      priority: 'medium'
    },
    {
      goal: 'Update resume with latest project',
      progress: 0,
      dueDate: 'This week',
      priority: 'high'
    },
    {
      goal: 'Schedule 2 mentor sessions',
      progress: 50,
      dueDate: 'Next week',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors];
  };

  const getInsightColor = (color: string) => {
    const colors = {
      'red': 'border-red-200 bg-red-50',
      'blue': 'border-blue-200 bg-blue-50',
      'purple': 'border-purple-200 bg-purple-50',
      'green': 'border-green-200 bg-green-50',
      'orange': 'border-orange-200 bg-orange-50'
    };
    return colors[color as keyof typeof colors];
  };

  const getTrendIcon = (trend: string) => {
    const icons = {
      'declining': '📉',
      'improving': '📈',
      'stable': '➡️'
    };
    return icons[trend as keyof typeof icons];
  };

  const getTrendColor = (trend: string) => {
    const colors = {
      'declining': 'text-red-600',
      'improving': 'text-green-600',
      'stable': 'text-gray-600'
    };
    return colors[trend as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">AI Recommendations & Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI-Powered Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Smart Insights</h3>
              <Badge className="bg-blue-100 text-blue-800">
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.id} className={`p-4 border rounded-lg ${getInsightColor(insight.color)}`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{insight.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {insight.title}
                        </h4>
                        <Badge className={getPriorityColor(insight.priority)} size="sm">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {insight.message}
                      </p>
                      <Button size="sm" variant="outline">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Trend Analysis</h3>
            <p className="text-sm text-gray-600">Performance trends and recommendations</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Application Rate</span>
                  <div className="flex items-center space-x-2">
                    <span className={getTrendColor(trendAnalysis.applicationTrends.trend)}>
                      {getTrendIcon(trendAnalysis.applicationTrends.trend)}
                    </span>
                    <span className={`font-semibold ${getTrendColor(trendAnalysis.applicationTrends.trend)}`}>
                      {trendAnalysis.applicationTrends.change > 0 ? '+' : ''}{trendAnalysis.applicationTrends.change}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {trendAnalysis.applicationTrends.recommendation}
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Response Rate</span>
                  <div className="flex items-center space-x-2">
                    <span className={getTrendColor(trendAnalysis.responseRates.trend)}>
                      {getTrendIcon(trendAnalysis.responseRates.trend)}
                    </span>
                    <span className={`font-semibold ${getTrendColor(trendAnalysis.responseRates.trend)}`}>
                      +{trendAnalysis.responseRates.change}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {trendAnalysis.responseRates.recommendation}
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Interview Success</span>
                  <div className="flex items-center space-x-2">
                    <span className={getTrendColor(trendAnalysis.interviewSuccess.trend)}>
                      {getTrendIcon(trendAnalysis.interviewSuccess.trend)}
                    </span>
                    <span className={`font-semibold ${getTrendColor(trendAnalysis.interviewSuccess.trend)}`}>
                      +{trendAnalysis.interviewSuccess.change}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {trendAnalysis.interviewSuccess.recommendation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Goals</h3>
            <Button variant="outline" size="sm">
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionableGoals.map((goal, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {goal.goal}
                  </h4>
                  <Badge className={getPriorityColor(goal.priority)} size="sm">
                    {goal.priority}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        goal.progress >= 75 ? 'bg-green-500' :
                        goal.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Due: {goal.dueDate}</span>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}