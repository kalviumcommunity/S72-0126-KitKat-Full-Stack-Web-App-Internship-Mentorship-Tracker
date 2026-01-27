// Students Grid View Component
// Grid layout for student cards with detailed information

'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface StudentsGridViewProps {
  filterStatus: string;
  searchQuery: string;
  sortBy: string;
  onStudentSelect: (student: any) => void;
}

export function StudentsGridView({
  filterStatus,
  searchQuery,
  sortBy,
  onStudentSelect
}: StudentsGridViewProps) {
  const students = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@ucla.edu',
      avatar: '👩‍💻',
      school: 'UCLA',
      major: 'Computer Science',
      year: 'Junior',
      progress: 75,
      status: 'active',
      lastSession: '3 days ago',
      activeApplications: 12,
      upcomingInterviews: 2,
      focusAreas: ['Technical interviews', 'System design'],
      recentActivity: [
        { type: 'application', text: 'Applied to Google', icon: '✅' },
        { type: 'update', text: 'Updated resume', icon: '📝' }
      ],
      joinDate: '2024-01-15',
      sessionsCompleted: 8,
      feedbackGiven: 12,
      successRate: 85,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@stanford.edu',
      avatar: '👨‍💼',
      school: 'Stanford University',
      major: 'Computer Science',
      year: 'Senior',
      progress: 90,
      status: 'active',
      lastSession: '1 day ago',
      activeApplications: 8,
      upcomingInterviews: 3,
      focusAreas: ['Behavioral interviews', 'Negotiation'],
      recentActivity: [
        { type: 'interview', text: 'Completed Microsoft interview', icon: '💼' },
        { type: 'offer', text: 'Received offer from Amazon', icon: '🎉' }
      ],
      joinDate: '2023-11-20',
      sessionsCompleted: 15,
      feedbackGiven: 18,
      successRate: 92,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@berkeley.edu',
      avatar: '👩‍🎓',
      school: 'UC Berkeley',
      major: 'Data Science',
      year: 'Sophomore',
      progress: 45,
      status: 'needs_attention',
      lastSession: '1 week ago',
      activeApplications: 5,
      upcomingInterviews: 0,
      focusAreas: ['Resume building', 'Portfolio development'],
      recentActivity: [
        { type: 'project', text: 'Published ML project', icon: '🚀' },
        { type: 'skill', text: 'Completed Python course', icon: '📚' }
      ],
      joinDate: '2024-02-01',
      sessionsCompleted: 4,
      feedbackGiven: 6,
      successRate: 60,
      trend: 'down'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@mit.edu',
      avatar: '👨‍💻',
      school: 'MIT',
      major: 'Electrical Engineering',
      year: 'Junior',
      progress: 80,
      status: 'active',
      lastSession: '2 days ago',
      activeApplications: 15,
      upcomingInterviews: 4,
      focusAreas: ['System design', 'Coding challenges'],
      recentActivity: [
        { type: 'application', text: 'Applied to Meta', icon: '✅' },
        { type: 'interview', text: 'Scheduled Google interview', icon: '📅' }
      ],
      joinDate: '2023-12-10',
      sessionsCompleted: 12,
      feedbackGiven: 15,
      successRate: 88,
      trend: 'up'
    },
    {
      id: 5,
      name: 'Jessica Wang',
      email: 'jessica.wang@cmu.edu',
      avatar: '👩‍💼',
      school: 'Carnegie Mellon',
      major: 'Software Engineering',
      year: 'Senior',
      progress: 95,
      status: 'active',
      lastSession: '4 hours ago',
      activeApplications: 6,
      upcomingInterviews: 1,
      focusAreas: ['Career strategy', 'Offer negotiation'],
      recentActivity: [
        { type: 'offer', text: 'Received offer from Apple', icon: '🎉' },
        { type: 'decision', text: 'Comparing offers', icon: '⚖️' }
      ],
      joinDate: '2023-10-05',
      sessionsCompleted: 20,
      feedbackGiven: 25,
      successRate: 95,
      trend: 'up'
    },
    {
      id: 6,
      name: 'Alex Thompson',
      email: 'alex.thompson@gatech.edu',
      avatar: '👨‍🎓',
      school: 'Georgia Tech',
      major: 'Computer Science',
      year: 'Junior',
      progress: 60,
      status: 'needs_attention',
      lastSession: '5 days ago',
      activeApplications: 3,
      upcomingInterviews: 0,
      focusAreas: ['Technical skills', 'Interview confidence'],
      recentActivity: [
        { type: 'rejection', text: 'Rejected by Tesla', icon: '❌' },
        { type: 'feedback', text: 'Received interview feedback', icon: '💬' }
      ],
      joinDate: '2024-01-20',
      sessionsCompleted: 6,
      feedbackGiven: 8,
      successRate: 50,
      trend: 'down'
    }
  ];

  // Filter and sort students based on props
  const filteredStudents = students.filter(student => {
    if (filterStatus !== 'active' && student.status !== filterStatus) return false;
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { text: 'Active', className: 'bg-green-100 text-green-800' },
      needs_attention: { text: 'Needs Attention', className: 'bg-red-100 text-red-800' },
      past_student: { text: 'Past Student', className: 'bg-gray-100 text-gray-800' }
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredStudents.map((student) => (
        <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                {student.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.major}, {student.school}</p>
              </div>
            </div>
            <Badge className={getStatusBadge(student.status).className} size="sm">
              {getStatusBadge(student.status).text}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{student.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                style={{ width: `${student.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Last session:</span>
              <span className="font-medium">{student.lastSession}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active applications:</span>
              <span className="font-medium">{student.activeApplications}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Interviews:</span>
              <span className="font-medium">{student.upcomingInterviews} upcoming</span>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Focus Areas:</h4>
            <div className="flex flex-wrap gap-1">
              {student.focusAreas.map((area, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity:</h4>
            <div className="space-y-1">
              {student.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span>{activity.icon}</span>
                  <span className="text-gray-600">{activity.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStudentSelect(student)}
            >
              View Profile
            </Button>
            <Button size="sm">
              Give Feedback
            </Button>
            <Button size="sm" variant="outline">
              Schedule Session
            </Button>
            <Button size="sm" variant="outline">
              Message
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}