// Recent Activity Section Component
// Recent mentor activities and interactions

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function RecentActivitySection() {
  const recentActivities = [
    {
      id: 1,
      type: 'feedback',
      title: 'Provided feedback to Alice Johnson',
      description: 'Resume review for Google software engineering internship application',
      timestamp: '2 hours ago',
      icon: '💬',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'session',
      title: 'Completed mentorship session',
      description: 'Technical interview preparation with Bob Smith - System design focus',
      timestamp: '4 hours ago',
      icon: '🎓',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'student_success',
      title: 'Student achievement',
      description: 'Emma Brown received internship offer from TechCorp after our interview prep',
      timestamp: '1 day ago',
      icon: '🎉',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      type: 'new_student',
      title: 'New student assigned',
      description: 'Frank Miller joined your mentorship program - Computer Science major',
      timestamp: '1 day ago',
      icon: '👤',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      type: 'review',
      title: 'Reviewed application materials',
      description: 'Cover letter and portfolio review for Carol Davis - Amazon application',
      timestamp: '2 days ago',
      icon: '📝',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 6,
      type: 'session',
      title: 'Mock interview session',
      description: 'Conducted technical interview simulation with David Wilson',
      timestamp: '2 days ago',
      icon: '💼',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 7,
      type: 'feedback',
      title: 'Provided career guidance',
      description: 'Career strategy discussion with Alice Johnson - FAANG application timeline',
      timestamp: '3 days ago',
      icon: '🎯',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 8,
      type: 'resource',
      title: 'Shared learning resources',
      description: 'Sent system design study materials to multiple students',
      timestamp: '3 days ago',
      icon: '📚',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const getActivityBadge = (type: string) => {
    const badges = {
      feedback: { text: 'Feedback', className: 'bg-blue-100 text-blue-800' },
      session: { text: 'Session', className: 'bg-green-100 text-green-800' },
      student_success: { text: 'Success', className: 'bg-yellow-100 text-yellow-800' },
      new_student: { text: 'New Student', className: 'bg-purple-100 text-purple-800' },
      review: { text: 'Review', className: 'bg-indigo-100 text-indigo-800' },
      resource: { text: 'Resource', className: 'bg-pink-100 text-pink-800' }
    };
    return badges[type as keyof typeof badges] || badges.feedback;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Activity
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index < recentActivities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Activity icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${activity.bgColor} flex items-center justify-center`}>
                  <span className="text-lg">{activity.icon}</span>
                </div>
                
                {/* Activity content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {activity.timestamp}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <Badge className={getActivityBadge(activity.type).className} size="sm">
                    {getActivityBadge(activity.type).text}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load more button */}
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Load More Activities
          </button>
        </div>
      </CardContent>
    </Card>
  );
}