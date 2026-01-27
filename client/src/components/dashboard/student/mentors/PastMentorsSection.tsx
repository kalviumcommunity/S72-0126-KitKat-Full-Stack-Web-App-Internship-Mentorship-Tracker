// Past Mentors Section Component
// Display mentors from completed mentorship relationships

'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PastMentor {
  id: string;
  name: string;
  title: string;
  company: string;
  photo: string;
  mentorshipPeriod: {
    start: string;
    end: string;
  };
  totalSessions: number;
  finalRating: number;
  achievements: string[];
  testimonial?: string;
}

export function PastMentorsSection() {
  const pastMentors: PastMentor[] = [
    {
      id: '1',
      name: 'Jennifer Wu',
      title: 'Tech Lead',
      company: 'Meta',
      photo: '👩‍🔬',
      mentorshipPeriod: {
        start: '2023-09-01',
        end: '2023-12-15'
      },
      totalSessions: 16,
      finalRating: 5,
      achievements: ['Improved coding skills', 'Landed internship at Google', 'Built portfolio project'],
      testimonial: 'Jennifer was instrumental in helping me prepare for technical interviews. Her guidance on system design was invaluable.'
    },
    {
      id: '2',
      name: 'Robert Kim',
      title: 'Senior Product Manager',
      company: 'Spotify',
      photo: '👨‍💼',
      mentorshipPeriod: {
        start: '2023-06-01',
        end: '2023-08-30'
      },
      totalSessions: 8,
      finalRating: 4,
      achievements: ['Resume optimization', 'Interview preparation', 'Career planning'],
      testimonial: 'Robert helped me understand the product management landscape and gave great career advice.'
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
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
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Past Mentors</h2>
          <Badge className="bg-gray-100 text-gray-800">
            {pastMentors.length} Completed
          </Badge>
        </div>

        <div className="space-y-6">
          {pastMentors.map((mentor) => (
            <div key={mentor.id} className="border border-gray-200 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-2xl">
                  {mentor.photo}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {mentor.title} @ {mentor.company}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      {formatDate(mentor.mentorshipPeriod.start)} - {formatDate(mentor.mentorshipPeriod.end)}
                    </span>
                    <span>•</span>
                    <span>{mentor.totalSessions} sessions</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(mentor.finalRating)}
                  </div>
                  <div className="text-sm text-gray-500">Final Rating</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Achievements During Mentorship:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.achievements.map((achievement, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      ✓ {achievement}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {mentor.testimonial && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <p className="text-sm text-blue-800 italic">
                    "{mentor.testimonial}"
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  View Full History
                </Button>
                <Button variant="outline" size="sm">
                  Send Thank You
                </Button>
                <Button variant="outline" size="sm">
                  Request Reconnection
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {pastMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Past Mentorships
            </h3>
            <p className="text-gray-600 mb-6">
              Complete your first mentorship to see it here.
            </p>
          </div>
        )}

        {/* Summary */}
        {pastMentors.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Mentorship Journey</h4>
                <p className="text-sm text-gray-600">
                  {pastMentors.reduce((sum, m) => sum + m.totalSessions, 0)} total sessions completed
                  • Average rating: {(pastMentors.reduce((sum, m) => sum + m.finalRating, 0) / pastMentors.length).toFixed(1)} ⭐
                </p>
              </div>
              <Button variant="outline" size="sm">
                Download Certificate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}