// Recommended Actions Component
// Smart suggestions based on user activity and data

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function RecommendedActions() {
  const actions = [
    {
      id: 1,
      type: 'update',
      icon: '📝',
      title: 'Update your resume',
      description: "Your resume hasn't been updated in 30 days. Keep it fresh with your latest experiences.",
      priority: 'medium',
      action: 'Update Now',
      color: 'blue'
    },
    {
      id: 2,
      type: 'opportunity',
      icon: '🎯',
      title: '3 companies match your profile',
      description: 'We found new opportunities that align perfectly with your skills and interests.',
      priority: 'high',
      action: 'Apply Now',
      color: 'green'
    },
    {
      id: 3,
      type: 'assessment',
      icon: '📚',
      title: 'Complete your skills assessment',
      description: 'Finish your technical assessment to get better mentor matching and job recommendations.',
      priority: 'medium',
      action: 'Complete',
      color: 'purple'
    },
    {
      id: 4,
      type: 'feedback',
      icon: '💡',
      title: 'Request feedback on recent interview',
      description: 'Get insights on your Google interview performance to improve for future opportunities.',
      priority: 'high',
      action: 'Request',
      color: 'orange'
    },
    {
      id: 5,
      type: 'network',
      icon: '🤝',
      title: 'Connect with alumni',
      description: '5 alumni from your university work at companies you\'re interested in.',
      priority: 'low',
      action: 'Connect',
      color: 'indigo'
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

  const getActionColor = (color: string) => {
    const colors = {
      'blue': 'bg-blue-600 hover:bg-blue-700',
      'green': 'bg-green-600 hover:bg-green-700',
      'purple': 'bg-purple-600 hover:bg-purple-700',
      'orange': 'bg-orange-600 hover:bg-orange-700',
      'indigo': 'bg-indigo-600 hover:bg-indigo-700'
    };
    return colors[color as keyof typeof colors];
  };

  const getIconBg = (color: string) => {
    const colors = {
      'blue': 'bg-blue-100',
      'green': 'bg-green-100',
      'purple': 'bg-purple-100',
      'orange': 'bg-orange-100',
      'indigo': 'bg-indigo-100'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recommended Actions</h2>
          <Badge className="bg-blue-100 text-blue-800">
            AI Powered
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Personalized suggestions to boost your internship success
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`w-10 h-10 ${getIconBg(action.color)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg">{action.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {action.title}
                    </h4>
                    <Badge className={getPriorityColor(action.priority)} size="sm">
                      {action.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {action.description}
                  </p>

                  <Button 
                    size="sm" 
                    className={`${getActionColor(action.color)} text-white`}
                  >
                    {action.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🤖</span>
            <h4 className="font-semibold text-blue-900">AI Insight</h4>
          </div>
          <p className="text-sm text-blue-800">
            Students who complete these actions are <strong>40% more likely</strong> to receive interview invitations. 
            Focus on high-priority items first for maximum impact.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}