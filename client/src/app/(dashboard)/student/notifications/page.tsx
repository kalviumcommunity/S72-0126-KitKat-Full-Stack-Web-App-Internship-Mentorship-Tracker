// Notifications Page - Server Component
// Displays all notifications for the student

import Link from 'next/link';

import { StudentRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { NotificationList } from '@/components/features/notifications/NotificationList';
import { MarkAllAsReadButton } from '@/components/features/notifications/MarkAllAsReadButton';
import type { Notification } from '@/lib/types';
import { NotificationType } from '@/lib/types';

// Mock function to get notifications
async function getNotifications(userId: string): Promise<Notification[]> {
  // TODO: Replace with actual API call
  // const response = await notifications.getAll();
  
  // Mock data
  return [
    {
      id: 'n1',
      userId: userId,
      type: NotificationType.FEEDBACK_RECEIVED,
      title: 'New Feedback Received',
      message: 'John Doe provided feedback on your Google Software Engineer Intern application.',
      read: false,
      expiresAt: undefined,
      createdAt: '2024-01-18T10:30:00Z',
    },
    {
      id: 'n2',
      userId: userId,
      type: NotificationType.APPLICATION_STATUS_CHANGED,
      title: 'Application Status Updated',
      message: 'Your Microsoft Product Manager Intern application status changed to INTERVIEW.',
      read: false,
      expiresAt: undefined,
      createdAt: '2024-01-17T15:45:00Z',
    },
    {
      id: 'n3',
      userId: userId,
      type: NotificationType.MENTOR_ASSIGNED,
      title: 'New Mentor Assigned',
      message: 'Jane Smith has been assigned as your mentor. They will help guide you through your internship applications.',
      read: true,
      expiresAt: undefined,
      createdAt: '2024-01-16T09:00:00Z',
    },
    {
      id: 'n4',
      userId: userId,
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: 'System Maintenance Scheduled',
      message: 'The platform will undergo maintenance on January 20th from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable.',
      read: true,
      expiresAt: '2024-01-20T09:00:00Z',
      createdAt: '2024-01-15T12:00:00Z',
    },
    {
      id: 'n5',
      userId: userId,
      type: NotificationType.FEEDBACK_RECEIVED,
      title: 'New Feedback Received',
      message: 'Jane Smith provided feedback on your Amazon SDE Intern application.',
      read: true,
      expiresAt: undefined,
      createdAt: '2024-01-14T14:20:00Z',
    },
  ];
}

export default async function NotificationsPage() {
  // Mock user ID - replace with actual auth
  const userId = 'mock-user-id';
  
  // Fetch notifications
  const allNotifications = await getNotifications(userId);
  
  // Separate read and unread
  const unreadNotifications = allNotifications.filter(n => !n.read);
  const readNotifications = allNotifications.filter(n => n.read);

  return (
    <StudentRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your application progress and feedback
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <MarkAllAsReadButton />
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allNotifications.length}
                  </p>
                </div>
                <div className="text-2xl">🔔</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {unreadNotifications.length}
                  </p>
                </div>
                <div className="text-2xl">📬</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-green-600">
                    {readNotifications.length}
                  </p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Unread ({unreadNotifications.length})
            </h2>
            <NotificationList notifications={unreadNotifications} />
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Earlier
            </h2>
            <NotificationList notifications={readNotifications} />
          </div>
        )}

        {/* Empty State */}
        {allNotifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600 mb-6">
                You'll receive notifications about feedback, application updates, and more.
              </p>
              <Link href="/student/applications">
                <Button>View Applications</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </StudentRoute>
  );
}