// Session Management Component
// Manage upcoming and past sessions

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function SessionManagement() {
  const [filterStatus, setFilterStatus] = useState('all');

  const sessions = [
    {
      id: 1,
      student: {
        name: 'Sarah Johnson',
        avatar: '👩‍💻',
        email: 'sarah.johnson@ucla.edu'
      },
      topic: 'Resume Review for Google Application',
      date: '2024-01-28',
      time: '2:00 PM - 3:00 PM',
      duration: 60,
      type: 'Resume Review',
      status: 'confirmed',
      notes: 'Focus on technical skills section and quantifiable achievements',
      studentNotes: 'Please review my latest resume version. I\'ve added the projects we discussed.',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 2,
      student: {
        name: 'Mike Chen',
        avatar: '👨‍💼',
        email: 'mike.chen@stanford.edu'
      },
      topic: 'Technical Interview Preparation',
      date: '2024-01-28',
      time: '4:30 PM - 5:30 PM',
      duration: 60,
      type: 'Technical Interview',
      status: 'confirmed',
      notes: 'Practice system design questions, focus on scalability',
      studentNotes: 'I have my Microsoft interview next week. Need help with system design.',
      meetingLink: 'https://meet.google.com/xyz-uvwx-yz'
    },
    {
      id: 3,
      student: {
        name: 'Emma Davis',
        avatar: '👩‍🎓',
        email: 'emma.davis@berkeley.edu'
      },
      topic: 'Career Strategy Discussion',
      date: '2024-01-29',
      time: '10:00 AM - 11:00 AM',
      duration: 60,
      type: 'Career Planning',
      status: 'pending',
      notes: 'Discuss transition from academia to industry',
      studentNotes: 'Want to explore different career paths in tech.',
      meetingLink: 'https://meet.google.com/def-ghij-klm'
    },
    {
      id: 4,
      student: {
        name: 'John Smith',
        avatar: '👨‍💻',
        email: 'john.smith@usc.edu'
      },
      topic: 'Mock Technical Interview',
      date: '2024-01-25',
      time: '3:00 PM - 4:00 PM',
      duration: 60,
      type: 'Mock Interview',
      status: 'completed',
      notes: 'Completed - Good problem solving, needs work on optimization',
      studentNotes: 'Thank you for the great session! The feedback was very helpful.',
      meetingLink: null
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.confirmed;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'Resume Review': '📝',
      'Technical Interview': '💻',
      'Career Planning': '🎯',
      'Mock Interview': '🎤',
      'General Guidance': '💬'
    };
    return icons[type as keyof typeof icons] || '💬';
  };

  const filteredSessions = sessions.filter(session => 
    filterStatus === 'all' || session.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Sessions</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
              
              <Button variant="outline">
                Export Schedule
              </Button>
            </div>
            
            <Button className="bg-green-600 hover:bg-green-700">
              Schedule New Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl">
                    {session.student.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                    <p className="text-gray-600">{session.student.name} • {session.student.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>📅 {session.date}</span>
                      <span>🕐 {session.time}</span>
                      <span>⏱️ {session.duration} min</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(session.type)}</span>
                    <span className="text-sm text-gray-600">{session.type}</span>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>
              </div>

              {/* Session Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {session.notes && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Your Notes:</h4>
                    <p className="text-blue-800 text-sm">{session.notes}</p>
                  </div>
                )}
                
                {session.studentNotes && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-1">Student Notes:</h4>
                    <p className="text-green-800 text-sm">{session.studentNotes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {session.status === 'confirmed' && session.meetingLink && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <span className="mr-2">📹</span>
                    Join Call
                  </Button>
                )}
                
                {session.status === 'pending' && (
                  <>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Confirm
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      Decline
                    </Button>
                  </>
                )}
                
                {session.status !== 'completed' && (
                  <Button variant="outline">
                    Reschedule
                  </Button>
                )}
                
                <Button variant="outline">
                  Message Student
                </Button>
                
                {session.status === 'completed' && (
                  <Button variant="outline">
                    View Feedback
                  </Button>
                )}
                
                <Button variant="outline" size="sm">
                  Edit Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Statistics */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Session Statistics</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-green-800">This Month</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-blue-800">Today</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-purple-800">Avg Minutes</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.9⭐</div>
              <div className="text-sm text-orange-800">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}