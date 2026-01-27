// Quick Actions Section Component
// Quick action buttons for common mentor tasks

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function QuickActionsSection() {
  const quickActions = [
    {
      id: 1,
      title: 'Schedule Session',
      description: 'Book a mentorship session',
      icon: '📅',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => console.log('Schedule session')
    },
    {
      id: 2,
      title: 'Provide Feedback',
      description: 'Review student materials',
      icon: '💬',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => console.log('Provide feedback')
    },
    {
      id: 3,
      title: 'Send Message',
      description: 'Message a student',
      icon: '✉️',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => console.log('Send message')
    },
    {
      id: 4,
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: '📊',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => console.log('View analytics')
    },
    {
      id: 5,
      title: 'Share Resources',
      description: 'Send learning materials',
      icon: '📚',
      color: 'bg-teal-600 hover:bg-teal-700',
      action: () => console.log('Share resources')
    },
    {
      id: 6,
      title: 'Create Template',
      description: 'Make feedback template',
      icon: '📝',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => console.log('Create template')
    }
  ];

  const mentorTips = [
    {
      id: 1,
      title: 'Weekly Check-ins',
      description: 'Schedule regular check-ins with your students to track their progress and provide consistent support.',
      icon: '💡'
    },
    {
      id: 2,
      title: 'Feedback Quality',
      description: 'Provide specific, actionable feedback rather than general comments to help students improve effectively.',
      icon: '🎯'
    },
    {
      id: 3,
      title: 'Resource Sharing',
      description: 'Curate and share relevant resources based on each student\'s career goals and current needs.',
      icon: '📖'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex items-center justify-start space-x-3`}
              >
                <span className="text-xl">{action.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentor Tips */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Mentor Tips</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentorTips.map((tip) => (
              <div key={tip.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{tip.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">This Week</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✅</span>
                <span className="text-sm font-medium text-gray-900">Sessions Completed</span>
              </div>
              <span className="text-lg font-bold text-green-600">6</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">💬</span>
                <span className="text-sm font-medium text-gray-900">Feedback Provided</span>
              </div>
              <span className="text-lg font-bold text-blue-600">12</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">🎯</span>
                <span className="text-sm font-medium text-gray-900">Student Successes</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}