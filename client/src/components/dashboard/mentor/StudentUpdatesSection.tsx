// Student Updates Section Component
// Recent updates and progress from students

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function StudentUpdatesSection() {
  const studentUpdates = [
    {
      id: 1,
      student: {
        name: 'Alice Johnson',
        avatar: '👩‍💻'
      },
      type: 'application',
      title: 'Applied to Google Software Engineering Intern',
      description: 'Submitted application with the resume we reviewed last week',
      timestamp: '2 hours ago',
      status: 'success',
      icon: '📝',
      actionRequired: false
    },
    {
      id: 2,
      student: {
        name: 'Bob Smith',
        avatar: '👨‍💼'
      },
      type: 'interview',
      title: 'Scheduled interview at Microsoft',
      description: 'Technical interview scheduled for next Friday. Requesting mock interview prep.',
      timestamp: '4 hours ago',
      status: 'action_needed',
      icon: '💼',
      actionRequired: true
    },
    {
      id: 3,
      student: {
        name: 'Carol Davis',
        avatar: '👩‍🎓'
      },
      type: 'achievement',
      title: 'Completed AWS Certification',
      description: 'Successfully passed AWS Cloud Practitioner exam with 92% score',
      timestamp: '1 day ago',
      status: 'success',
      icon: '🏆',
      actionRequired: false
    },
    {
      id: 4,
      student: {
        name: 'David Wilson',
        avatar: '👨‍💻'
      },
      type: 'feedback_request',
      title: 'Requesting resume feedback',
      description: 'Updated resume for data science positions. Looking for your review.',
      timestamp: '1 day ago',
      status: 'action_needed',
      icon: '📄',
      actionRequired: true
    },
    {
      id: 5,
      student: {
        name: 'Emma Brown',
        avatar: '👩‍💼'
      },
      type: 'offer',
      title: 'Received internship offer!',
      description: 'Got offer from TechCorp for summer internship. Thank you for all the help!',
      timestamp: '2 days ago',
      status: 'celebration',
      icon: '🎉',
      actionRequired: false
    },
    {
      id: 6,
      student: {
        name: 'Frank Miller',
        avatar: '👨‍🎓'
      },
      type: 'project',
      title: 'Published new project on GitHub',
      description: 'Machine learning project we discussed is now live with documentation',
      timestamp: '3 days ago',
      status: 'info',
      icon: '🚀',
      actionRequired: false
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      action_needed: 'bg-red-100 text-red-800',
      celebration: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || colors.info;
  };

  const getStatusText = (status: string) => {
    const texts = {
      success: 'Success',
      action_needed: 'Action Needed',
      celebration: 'Celebration',
      info: 'Update'
    };
    return texts[status as keyof typeof texts] || 'Update';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Student Updates</h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-100 text-red-800" size="sm">
              2 Action Required
            </Badge>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentUpdates.map((update, index) => (
            <div key={update.id} className="relative">
              {/* Timeline line */}
              {index < studentUpdates.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Update icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{update.icon}</span>
                </div>
                
                {/* Update content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{update.student.avatar}</span>
                      <span className="font-medium text-gray-900">{update.student.name}</span>
                      <Badge className={getStatusColor(update.status)} size="sm">
                        {getStatusText(update.status)}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {update.timestamp}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {update.title}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {update.description}
                  </p>
                  
                  {update.actionRequired && (
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Take Action
                      </Button>
                      <Button size="sm" variant="outline">
                        Message Student
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline">
            Load More Updates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}