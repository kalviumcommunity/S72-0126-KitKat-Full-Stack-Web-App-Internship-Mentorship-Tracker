// Recent Mentor Feedback Component
// Shows the 3 most recent feedback from mentors

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function RecentMentorFeedback() {
  const feedbacks = [
    {
      id: 1,
      mentor: {
        name: 'Sarah Chen',
        photo: '👩‍💼',
        title: 'Senior SWE at Google'
      },
      category: 'Resume',
      rating: 4,
      snippet: 'Great improvement in your resume structure. Consider adding more quantifiable achievements to make your impact clearer...',
      timeAgo: '2 hours ago',
      priority: 'medium'
    },
    {
      id: 2,
      mentor: {
        name: 'David Rodriguez',
        photo: '👨‍💻',
        title: 'PM at Microsoft'
      },
      category: 'Interview',
      rating: 5,
      snippet: 'Excellent technical knowledge! Work on explaining your thought process more clearly during problem-solving...',
      timeAgo: '1 day ago',
      priority: 'high'
    },
    {
      id: 3,
      mentor: {
        name: 'Jennifer Wu',
        photo: '👩‍🔬',
        title: 'Tech Lead at Meta'
      },
      category: 'Technical',
      rating: 3,
      snippet: 'Your coding skills are solid, but focus on writing cleaner, more maintainable code. Consider learning design patterns...',
      timeAgo: '3 days ago',
      priority: 'low'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Resume': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-green-100 text-green-800',
      'Technical': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Mentor Feedback</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              {/* Mentor Info */}
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                  {feedback.mentor.photo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {feedback.mentor.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feedback.mentor.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(feedback.category)}>
                        {feedback.category}
                      </Badge>
                      <Badge className={getPriorityColor(feedback.priority)} size="sm">
                        {feedback.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex space-x-1">
                  {renderStars(feedback.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({feedback.rating}/5)
                </span>
              </div>

              {/* Feedback Content */}
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                {feedback.snippet}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {feedback.timeAgo}
                </span>
                <Button variant="outline" size="sm">
                  View Full Feedback
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Request New Feedback */}
        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
          <Button variant="outline" className="w-full">
            <span className="mr-2">💬</span>
            Request New Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}