// Upcoming Events Timeline Component
// Vertical timeline showing upcoming events and deadlines

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function UpcomingEventsTimeline() {
  const events = [
    {
      id: 1,
      type: 'interview',
      title: 'Interview with Google',
      subtitle: 'Software Engineer Intern Position',
      datetime: 'Tomorrow 2:00 PM',
      date: '2024-01-28',
      time: '14:00',
      action: 'Prepare',
      actionType: 'primary',
      icon: '🎯',
      color: 'blue'
    },
    {
      id: 2,
      type: 'mentor',
      title: 'Mentor session with John Doe',
      subtitle: 'Resume Review & Career Guidance',
      datetime: 'Jan 30 4:00 PM',
      date: '2024-01-30',
      time: '16:00',
      action: 'Join',
      actionType: 'success',
      icon: '👨‍🏫',
      color: 'green'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Application deadline - TechCorp',
      subtitle: 'Product Manager Intern Application',
      datetime: 'Feb 2',
      date: '2024-02-02',
      time: '23:59',
      action: 'View',
      actionType: 'warning',
      icon: '⏰',
      color: 'orange'
    },
    {
      id: 4,
      type: 'practice',
      title: 'Mock interview practice',
      subtitle: 'System Design & Behavioral Questions',
      datetime: 'Feb 5',
      date: '2024-02-05',
      time: '15:00',
      action: 'Register',
      actionType: 'outline',
      icon: '📚',
      color: 'purple'
    },
    {
      id: 5,
      type: 'followup',
      title: 'Follow up with Microsoft',
      subtitle: 'Check application status',
      datetime: 'Feb 7',
      date: '2024-02-07',
      time: '10:00',
      action: 'Remind',
      actionType: 'outline',
      icon: '📧',
      color: 'gray'
    }
  ];

  const getEventColors = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[color as keyof typeof colors];
  };

  const getButtonVariant = (actionType: string) => {
    switch (actionType) {
      case 'primary': return 'default';
      case 'success': return 'default';
      case 'warning': return 'default';
      case 'outline': return 'outline';
      default: return 'outline';
    }
  };

  const isUpcoming = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Button variant="outline" size="sm">
            <span className="mr-2">📅</span>
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => {
              const daysUntil = isUpcoming(event.date);
              const isToday = daysUntil === 0;
              const isTomorrow = daysUntil === 1;
              const isPast = daysUntil < 0;

              return (
                <div key={event.id} className="relative flex items-start space-x-4">
                  {/* Timeline Dot */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-lg ${getEventColors(event.color)}`}>
                    <span className="text-lg">{event.icon}</span>
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {event.title}
                            </h3>
                            {isToday && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                Today
                              </Badge>
                            )}
                            {isTomorrow && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Tomorrow
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {event.subtitle}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>{event.datetime}</span>
                            </span>
                            {!isPast && (
                              <span className="flex items-center space-x-1">
                                <span>⏱️</span>
                                <span>
                                  {daysUntil === 0 ? 'Today' : 
                                   daysUntil === 1 ? 'Tomorrow' : 
                                   `${daysUntil} days`}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="ml-4 flex-shrink-0">
                          <Button 
                            variant={getButtonVariant(event.actionType)} 
                            size="sm"
                            disabled={isPast}
                            className={
                              event.actionType === 'primary' ? 'bg-blue-600 hover:bg-blue-700' :
                              event.actionType === 'success' ? 'bg-green-600 hover:bg-green-700' :
                              event.actionType === 'warning' ? 'bg-orange-600 hover:bg-orange-700' :
                              ''
                            }
                          >
                            {event.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Events */}
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full">
              View All Events
              <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}