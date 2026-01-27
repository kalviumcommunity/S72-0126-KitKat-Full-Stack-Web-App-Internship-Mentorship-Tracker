// Quick Actions Sidebar Component
// Collapsible sidebar with quick actions for the current conversation

'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface QuickActionsSidebarProps {
  conversationId: string;
  onClose: () => void;
}

export function QuickActionsSidebar({ conversationId, onClose }: QuickActionsSidebarProps) {
  const quickActions = [
    {
      id: 'schedule-meeting',
      title: 'Schedule Meeting',
      description: 'Set up a video call or in-person meeting',
      icon: '📅',
      action: () => console.log('Schedule meeting')
    },
    {
      id: 'share-application',
      title: 'Share Application',
      description: 'Share details about a specific job application',
      icon: '📋',
      action: () => console.log('Share application')
    },
    {
      id: 'request-feedback',
      title: 'Request Feedback',
      description: 'Ask for feedback on resume, interview, or project',
      icon: '💬',
      action: () => console.log('Request feedback')
    },
    {
      id: 'send-calendar-invite',
      title: 'Send Calendar Invite',
      description: 'Send a calendar invitation for upcoming sessions',
      icon: '📆',
      action: () => console.log('Send calendar invite')
    }
  ];

  const conversationInfo = {
    sharedFiles: [
      { name: 'Resume_v3.2.pdf', date: '2 days ago', size: '245 KB' },
      { name: 'Portfolio_Link.txt', date: '1 week ago', size: '1 KB' },
      { name: 'Interview_Notes.docx', date: '2 weeks ago', size: '128 KB' }
    ],
    upcomingSessions: [
      { title: 'Resume Review', date: 'Jan 30, 4:00 PM', type: 'Video Call' },
      { title: 'Mock Interview', date: 'Feb 2, 2:00 PM', type: 'In Person' }
    ]
  };

  return (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h4 className="font-medium text-gray-900">Actions</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">{action.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 text-sm">
                        {action.title}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shared Files */}
        <Card>
          <CardHeader>
            <h4 className="font-medium text-gray-900">Shared Files</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversationInfo.sharedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="text-lg">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    ⬇️
                  </Button>
                </div>
              ))}
              
              {conversationInfo.sharedFiles.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No shared files yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <h4 className="font-medium text-gray-900">Upcoming Sessions</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversationInfo.upcomingSessions.map((session, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <h5 className="font-medium text-gray-900 text-sm">
                    {session.title}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">
                    {session.date}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {session.type}
                  </p>
                </div>
              ))}
              
              {conversationInfo.upcomingSessions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming sessions
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <h4 className="font-medium text-gray-900">Contact Info</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm text-gray-900">john.doe@google.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">LinkedIn</span>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View Profile
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time Zone</span>
                <span className="text-sm text-gray-900">PST (UTC-8)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Settings */}
        <Card>
          <CardHeader>
            <h4 className="font-medium text-gray-900">Settings</h4>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Mute notifications
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Archive conversation
              </button>
              <button className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded">
                Block contact
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}