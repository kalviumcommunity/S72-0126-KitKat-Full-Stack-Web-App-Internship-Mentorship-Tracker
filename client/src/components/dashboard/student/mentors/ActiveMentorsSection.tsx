// Active Mentors Section Component
// Grid of active mentor cards with detailed information

'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  reviewCount: number;
  photo: string;
  specializations: string[];
  progress: {
    sessionsCompleted: number;
    lastSession: string;
    nextSession?: {
      date: string;
      time: string;
    };
  };
  isOnline: boolean;
}

export function ActiveMentorsSection() {
  const activeMentors: Mentor[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Senior Software Engineer',
      company: 'Google',
      rating: 4.9,
      reviewCount: 127,
      photo: '👨‍💻',
      specializations: ['Technical Interviews', 'Resume Review', 'Career Strategy'],
      progress: {
        sessionsCompleted: 8,
        lastSession: '5 days ago',
        nextSession: {
          date: 'Jan 30',
          time: '4:00 PM'
        }
      },
      isOnline: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      title: 'Product Manager',
      company: 'Microsoft',
      rating: 4.8,
      reviewCount: 89,
      photo: '👩‍💼',
      specializations: ['Product Strategy', 'Leadership', 'Interview Prep'],
      progress: {
        sessionsCompleted: 5,
        lastSession: '2 days ago',
        nextSession: {
          date: 'Feb 1',
          time: '2:00 PM'
        }
      },
      isOnline: false
    },
    {
      id: '3',
      name: 'David Rodriguez',
      title: 'Tech Lead',
      company: 'Meta',
      rating: 4.7,
      reviewCount: 156,
      photo: '👨‍🔬',
      specializations: ['System Design', 'Code Review', 'Technical Growth'],
      progress: {
        sessionsCompleted: 12,
        lastSession: '1 week ago'
      },
      isOnline: true
    }
  ];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⭐</span>}
        <span className="text-sm text-gray-600 ml-1">
          {rating} ({reviewCount} reviews)
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Active Mentors</h2>
          <Badge className="bg-green-100 text-green-800">
            {activeMentors.length} Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeMentors.map((mentor) => (
            <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                    {mentor.photo}
                  </div>
                  {mentor.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {mentor.title} @ {mentor.company}
                  </p>
                  {renderStars(mentor.rating)}
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">🎯</span>
                  Specialization:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="mr-2">📊</span>
                  Your Progress:
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>• {mentor.progress.sessionsCompleted} sessions completed</div>
                  <div>• Last session: {mentor.progress.lastSession}</div>
                  {mentor.progress.nextSession && (
                    <div className="text-blue-600 font-medium">
                      • Next session: {mentor.progress.nextSession.date}, {mentor.progress.nextSession.time}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Schedule Session
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Profile
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {activeMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Active Mentors
            </h3>
            <p className="text-gray-600 mb-6">
              Start your mentorship journey by connecting with industry experts.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Find Your First Mentor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}