// Activity Feed Component
// Recent activities, updates, and timeline

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to Software Engineering Intern at Google',
      description: 'Submitted application with updated resume and cover letter',
      timestamp: '2 hours ago',
      icon: '📝',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'mentorship',
      title: 'Completed mentorship session with John Smith',
      description: 'Discussed technical interview preparation and system design concepts',
      timestamp: '1 day ago',
      icon: '🎓',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned AWS Cloud Practitioner Certification',
      description: 'Successfully passed the AWS certification exam with a score of 92%',
      timestamp: '3 days ago',
      icon: '🏆',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      type: 'project',
      title: 'Published new project: AI Study Assistant',
      description: 'Open-sourced machine learning project on GitHub with comprehensive documentation',
      timestamp: '5 days ago',
      icon: '🚀',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      type: 'interview',
      title: 'Completed technical interview at TechCorp',
      description: 'Successfully completed coding interview focusing on algorithms and data structures',
      timestamp: '1 week ago',
      icon: '💼',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 6,
      type: 'skill',
      title: 'Received endorsement for React skills',
      description: 'Sarah Johnson endorsed your React development skills',
      timestamp: '1 week ago',
      icon: '👍',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 7,
      type: 'connection',
      title: 'Connected with 5 new professionals',
      description: 'Expanded network with software engineers from leading tech companies',
      timestamp: '2 weeks ago',
      icon: '🤝',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 8,
      type: 'course',
      title: 'Completed Deep Learning Specialization',
      description: 'Finished 5-course specialization on Coursera with 98% average grade',
      timestamp: '2 weeks ago',
      icon: '📚',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getActivityBadge = (type: string) => {
    const badges = {
      application: { text: 'Application', className: 'bg-blue-100 text-blue-800' },
      mentorship: { text: 'Mentorship', className: 'bg-green-100 text-green-800' },
      achievement: { text: 'Achievement', className: 'bg-yellow-100 text-yellow-800' },
      project: { text: 'Project', className: 'bg-purple-100 text-purple-800' },
      interview: { text: 'Interview', className: 'bg-indigo-100 text-indigo-800' },
      skill: { text: 'Skill', className: 'bg-pink-100 text-pink-800' },
      connection: { text: 'Network', className: 'bg-teal-100 text-teal-800' },
      course: { text: 'Learning', className: 'bg-orange-100 text-orange-800' }
    };
    return badges[type as keyof typeof badges] || badges.application;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index < activities.length - 1 && (
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