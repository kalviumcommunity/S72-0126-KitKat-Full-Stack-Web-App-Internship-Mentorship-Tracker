'use client';

// Mark All As Read Button - Client Component
// Button to mark all notifications as read

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { notifications } from '@/lib/api';

export function MarkAllAsReadButton() {
  const [isMarking, setIsMarking] = useState(false);
  const router = useRouter();

  const handleMarkAllAsRead = async () => {
    setIsMarking(true);
    try {
      const response = await notifications.markAllAsRead();
      if (response.success) {
        // Refresh the page to show updated notifications
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleMarkAllAsRead}
      disabled={isMarking}
    >
      {isMarking ? 'Marking...' : 'Mark All as Read'}
    </Button>
  );
}