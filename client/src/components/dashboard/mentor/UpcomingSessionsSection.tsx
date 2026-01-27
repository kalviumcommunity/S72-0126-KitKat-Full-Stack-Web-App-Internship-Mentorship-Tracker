// Upcoming Sessions Section Component
// Shows scheduled mentorship sessions

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function UpcomingSessionsSection() {
  const upcomingSessions = [
    {
      id: 1,
      student: {
        name: 'Alice Johnson',
        email: 'alice.johnson@university.edu',
        avatar: '👩‍💻'
      },
      topic: 'Technical Interview Preparation',
      date: 'Today',
      time: '2:00 PM - 3:00 PM',
      type: 'Video Call',
      status: 'confirmed',
      notes: 'Focus on system design questions and coding challenges'
    },
    {
      id: 2,
      student: {
        name: 'Bob Smith',
        email: 'bob.smith@university.edu',
        avatar: '👨‍💼'
      },
      topic: 'Resume Review',
      date: 'Today',
      time: '4:30 PM - 5:30 PM',
      type: 'Video Call',
      status: 'confirmed',
      notes: 'Review updated resume for software engineering positions'
    },
    {
      id: 3,
      student: {
        name: 'Carol Davis',
        email: 'carol.davis@university.edu',
        avatar: '👩‍🎓'
      },
      topic: 'Career Strategy Discussion',
      date: 'Tomorrow',
      time: '10:00 AM - 11:00 AM',
      type: 'Video Call',
      status: 'pending',
      notes: 'Discuss career goals and application strategy for FAANG companies'
    },
    {
      id: 4,
      student: {
        name: 'David Wilson',
        email: 'david.wilson@university.edu',
        avatar: '👨‍💻'
      },
      topic: 'Mock Interview',
      date: 'Jan 30',
      time: '3:00 PM - 4:00 PM',
      type: 'Video Call',
      status: 'confirmed',
      notes: 'Full technical interview simulation for Google application'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.confirmed;
  };

  const getTimeUntil = (date: string, time: string) => {
    if (date === 'Today') return 'In 2 hours';
    if (date === 'Tomorrow') return 'Tomorrow';
    return date;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <Button variant="outline" size="sm">
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg">
                    {session.student.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{session.student.name}</h4>
                    <p className="text-sm text-gray-600">{session.student.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(session.status)} size="sm">
                  {session.status}
                </Badge>
              </div>

              <div className="mb-3">
                <h5 className="font-medium text-gray-900 mb-1">{session.topic}</h5>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🕐</span>
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💻</span>
                    <span>{session.type}</span>
                  </div>
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {getTimeUntil(session.date, session.time)}
                </div>
              </div>

              {session.notes && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Notes:</span> {session.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Join Session
                </Button>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
                <Button size="sm" variant="outline">
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">
            View All Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}