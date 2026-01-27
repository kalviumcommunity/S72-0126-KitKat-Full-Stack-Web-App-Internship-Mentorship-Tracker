// Upcoming Sessions Section Component
// Calendar integration showing scheduled sessions with mentors

'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Session {
  id: string;
  mentorName: string;
  mentorPhoto: string;
  mentorCompany: string;
  date: string;
  time: string;
  duration: number; // in minutes
  topic: string;
  focus: string[];
  status: 'upcoming' | 'today' | 'starting-soon';
  meetingLink?: string;
}

export function UpcomingSessionsSection() {
  const upcomingSessions: Session[] = [
    {
      id: '1',
      mentorName: 'John Doe',
      mentorPhoto: '👨‍💻',
      mentorCompany: 'Google',
      date: '2024-01-30',
      time: '4:00 PM',
      duration: 60,
      topic: 'Technical Interview Preparation',
      focus: ['System Design', 'Coding Problems', 'Behavioral Questions'],
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      mentorName: 'Sarah Chen',
      mentorPhoto: '👩‍💼',
      mentorCompany: 'Microsoft',
      date: '2024-02-01',
      time: '2:00 PM',
      duration: 45,
      topic: 'Resume Review & Career Strategy',
      focus: ['Resume Optimization', 'Career Planning', 'Industry Insights'],
      status: 'upcoming'
    },
    {
      id: '3',
      mentorName: 'David Rodriguez',
      mentorPhoto: '👨‍🔬',
      mentorCompany: 'Meta',
      date: '2024-01-27',
      time: '3:45 PM',
      duration: 30,
      topic: 'Quick Code Review Session',
      focus: ['Code Quality', 'Best Practices'],
      status: 'starting-soon',
      meetingLink: 'https://zoom.us/j/123456789'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'upcoming': 'bg-blue-100 text-blue-800',
      'today': 'bg-yellow-100 text-yellow-800',
      'starting-soon': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'upcoming': 'Upcoming',
      'today': 'Today',
      'starting-soon': 'Starting Soon'
    };
    return labels[status as keyof typeof labels];
  };

  const isJoinable = (session: Session) => {
    // In real app, check if session is within 15 minutes
    return session.status === 'starting-soon' && session.meetingLink;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
          <Button variant="outline" size="sm">
            <span className="mr-2">📅</span>
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {session.mentorPhoto}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {session.mentorName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {session.mentorCompany}
                    </p>
                  </div>
                </div>
                
                <Badge className={getStatusColor(session.status)}>
                  {getStatusLabel(session.status)}
                </Badge>
              </div>

              <div className="mb-3">
                <h5 className="font-medium text-gray-900 mb-1">
                  {session.topic}
                </h5>
                <div className="flex flex-wrap gap-2 mb-2">
                  {session.focus.map((item, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{formatDate(session.date)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🕐</span>
                    <span>{session.time}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>{session.duration} min</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isJoinable(session) ? (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <span className="mr-2">🎥</span>
                    Join Video Call
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    <span className="mr-2">🎥</span>
                    Join (15 min before)
                  </Button>
                )}
                
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                
                <Button variant="outline" size="sm">
                  Message Mentor
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {upcomingSessions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📅</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              No Upcoming Sessions
            </h4>
            <p className="text-gray-600 mb-4">
              Schedule a session with your mentors to continue your growth.
            </p>
            <Button variant="outline">
              Schedule New Session
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Session Reminders</h4>
              <p className="text-sm text-blue-700">
                Get notified 15 minutes before your sessions start
              </p>
            </div>
            <Button variant="outline" size="sm">
              Manage Notifications
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}