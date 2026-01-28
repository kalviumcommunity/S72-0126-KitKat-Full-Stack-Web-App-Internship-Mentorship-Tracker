// Upcoming Interviews Component
// Calendar widget showing scheduled interviews

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function UpcomingInterviews() {
  const interviews = [
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      position: 'Software Engineering Intern',
      type: 'Video',
      date: 'Tomorrow',
      time: '10:00 AM',
      interviewers: ['John Smith', 'Emily Davis'],
      status: 'confirmed'
    },
    {
      id: '2',
      candidateName: 'Michael Chen',
      position: 'Data Science Intern',
      type: 'Phone',
      date: 'Jan 30',
      time: '2:00 PM',
      interviewers: ['Alex Wilson'],
      status: 'confirmed'
    },
    {
      id: '3',
      candidateName: 'Emily Rodriguez',
      position: 'Product Management Intern',
      type: 'On-site',
      date: 'Jan 31',
      time: '11:00 AM',
      interviewers: ['Sarah Lee', 'Mike Johnson'],
      status: 'pending'
    },
    {
      id: '4',
      candidateName: 'David Kim',
      position: 'Software Engineering Intern',
      type: 'Video',
      date: 'Feb 1',
      time: '3:30 PM',
      interviewers: ['John Smith'],
      status: 'confirmed'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return '📹';
      case 'Phone': return '📞';
      case 'On-site': return '🏢';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
          <Button variant="outline" size="sm">
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{interview.candidateName}</h3>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                  </div>
                  <Badge className={getStatusColor(interview.status)} variant="secondary">
                    {interview.status}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>{getTypeIcon(interview.type)}</span>
                    <span>{interview.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{interview.date} at {interview.time}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Interviewers: {interview.interviewers.join(', ')}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="default">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                  {interview.type === 'Video' && (
                    <Button size="sm" variant="outline">
                      Join Video
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}