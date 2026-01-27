// Pending Reviews Section Component
// Applications and materials that need mentor review

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function PendingReviewsSection() {
  const pendingReviews = [
    {
      id: 1,
      student: {
        name: 'Alice Johnson',
        avatar: '👩‍💻'
      },
      type: 'application',
      title: 'Google SWE Intern Application',
      description: 'Resume and cover letter for software engineering internship',
      submittedAt: '2 hours ago',
      priority: 'high',
      deadline: 'Due in 2 days'
    },
    {
      id: 2,
      student: {
        name: 'Bob Smith',
        avatar: '👨‍💼'
      },
      type: 'resume',
      title: 'Updated Resume Review',
      description: 'Revised resume for data science positions',
      submittedAt: '1 day ago',
      priority: 'medium',
      deadline: 'Due in 3 days'
    },
    {
      id: 3,
      student: {
        name: 'Carol Davis',
        avatar: '👩‍🎓'
      },
      type: 'cover_letter',
      title: 'Amazon Cover Letter',
      description: 'Cover letter for SDE internship application',
      submittedAt: '1 day ago',
      priority: 'high',
      deadline: 'Due tomorrow'
    },
    {
      id: 4,
      student: {
        name: 'David Wilson',
        avatar: '👨‍💻'
      },
      type: 'portfolio',
      title: 'Portfolio Website Review',
      description: 'Personal portfolio for frontend developer positions',
      submittedAt: '2 days ago',
      priority: 'low',
      deadline: 'Due in 5 days'
    },
    {
      id: 5,
      student: {
        name: 'Emma Brown',
        avatar: '👩‍💼'
      },
      type: 'interview_prep',
      title: 'Mock Interview Feedback',
      description: 'Technical interview practice session recording',
      submittedAt: '3 days ago',
      priority: 'medium',
      deadline: 'Due in 1 day'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      application: '📝',
      resume: '📄',
      cover_letter: '✉️',
      portfolio: '🌐',
      interview_prep: '🎤'
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getDeadlineColor = (deadline: string) => {
    if (deadline.includes('tomorrow') || deadline.includes('1 day')) {
      return 'text-red-600';
    } else if (deadline.includes('2 days') || deadline.includes('3 days')) {
      return 'text-yellow-600';
    }
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Pending Reviews</h2>
          <Badge className="bg-red-100 text-red-800" size="sm">
            {pendingReviews.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span>{getTypeIcon(review.type)}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{review.student.avatar}</span>
                      <span className="font-medium text-gray-900 text-sm">{review.student.name}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getPriorityColor(review.priority)} size="sm">
                  {review.priority}
                </Badge>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {review.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {review.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Submitted {review.submittedAt}</span>
                  <span className={`font-medium ${getDeadlineColor(review.deadline)}`}>
                    {review.deadline}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Review Now
                </Button>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">
            View All Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}