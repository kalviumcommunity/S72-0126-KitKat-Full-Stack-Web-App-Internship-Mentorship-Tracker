'use client';

// Notification Item Component - Client Component
// Individual notification display with mark as read functionality

import { useState } from 'react';
import { format } from 'date-fns';

import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { notifications as notificationsApi } from '@/lib/api';
import type { Notification, NotificationType } from '@/lib/types';

interface NotificationItemProps {
  notification: Notification;
}

const notificationIcons: Record<NotificationType, string> = {
  FEEDBACK_RECEIVED: '💬',
  APPLICATION_STATUS_CHANGED: '🔄',
  MENTOR_ASSIGNED: '👨‍🏫',
  SYSTEM_ANNOUNCEMENT: '📢',
};

const notificationColors: Record<NotificationType, string> = {
  FEEDBACK_RECEIVED: 'bg-purple-50 border-purple-200',
  APPLICATION_STATUS_CHANGED: 'bg-blue-50 border-blue-200',
  MENTOR_ASSIGNED: 'bg-green-50 border-green-200',
  SYSTEM_ANNOUNCEMENT: 'bg-yellow-50 border-yellow-200',
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.read);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsRead = async () => {
    if (isRead || isMarking) return;

    setIsMarking(true);
    try {
      const response = await notificationsApi.markAsRead(notification.id);
      if (response.success) {
        setIsRead(true);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    } finally {
      setIsMarking(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy at h:mm a');
  };

  const colorClass = notificationColors[notification.type];
  const icon = notificationIcons[notification.type];

  return (
    <Card 
      className={`${!isRead ? colorClass : 'bg-white'} transition-colors cursor-pointer`}
      onClick={handleMarkAsRead}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="text-2xl flex-shrink-0">{icon}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-gray-900 text-sm">
                {notification.title}
              </h4>
              {!isRead && (
                <Badge variant="destructive" className="ml-2 flex-shrink-0">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              {notification.message}
            </p>
            <p className="text-xs text-gray-500">
              {formatDateTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}