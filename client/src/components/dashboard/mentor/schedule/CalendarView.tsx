// Calendar View Component
// Monthly/weekly calendar view for mentor sessions

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function CalendarView() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const sessions = [
    {
      id: 1,
      student: 'Sarah Johnson',
      avatar: '👩‍💻',
      topic: 'Resume Review',
      time: '2:00 PM - 3:00 PM',
      date: '2024-01-28',
      type: 'video',
      status: 'confirmed'
    },
    {
      id: 2,
      student: 'Mike Chen',
      avatar: '👨‍💼',
      topic: 'Technical Interview Prep',
      time: '4:30 PM - 5:30 PM',
      date: '2024-01-28',
      type: 'video',
      status: 'confirmed'
    },
    {
      id: 3,
      student: 'Emma Davis',
      avatar: '👩‍🎓',
      topic: 'Career Strategy',
      time: '10:00 AM - 11:00 AM',
      date: '2024-01-29',
      type: 'video',
      status: 'pending'
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

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                ← Previous
              </Button>
              <h3 className="text-lg font-semibold">January 2024</h3>
              <Button variant="outline" size="sm">
                Next →
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['month', 'week', 'day'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'month' | 'week' | 'day')}
                    className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                      viewMode === mode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                Add Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Weekly View</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Available</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="font-semibold text-gray-900">{day}</div>
                <div className="text-2xl font-bold text-gray-600">{22 + index}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            {Array.from({ length: 12 }, (_, i) => {
              const hour = 9 + i;
              const timeSlot = `${hour}:00`;
              
              return (
                <div key={timeSlot} className="grid grid-cols-8 gap-4 min-h-16">
                  <div className="text-sm text-gray-500 font-medium py-2">
                    {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                  </div>
                  
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const daySession = sessions.find(s => 
                      s.date === `2024-01-${22 + dayIndex}` && 
                      s.time.startsWith(timeSlot.split(':')[0])
                    );
                    
                    return (
                      <div key={dayIndex} className="border border-gray-200 rounded p-1 min-h-14">
                        {daySession ? (
                          <div className="bg-green-50 border border-green-200 rounded p-2 h-full">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm">{daySession.avatar}</span>
                              <span className="text-xs font-medium text-green-800 truncate">
                                {daySession.student}
                              </span>
                            </div>
                            <div className="text-xs text-green-700 truncate">
                              {daySession.topic}
                            </div>
                            <Badge className={getStatusColor(daySession.status)} size="sm">
                              {daySession.status}
                            </Badge>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer rounded">
                            <span className="text-xs">Available</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Sessions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Today's Sessions</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.filter(s => s.date === '2024-01-28').map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                    {session.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{session.student}</h4>
                    <p className="text-sm text-gray-600">{session.topic}</p>
                    <p className="text-sm text-gray-500">{session.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Join Call
                  </Button>
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}