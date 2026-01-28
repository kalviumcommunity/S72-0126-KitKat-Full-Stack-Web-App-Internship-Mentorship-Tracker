// Mentor Notifications Tab Component
// Manage notification preferences

'use client';

import { useState } from 'react';

export function MentorNotificationsTab() {
  const [notifications, setNotifications] = useState({
    email: {
      newBookings: true,
      bookingReminders: true,
      cancellations: true,
      messages: true,
      weeklyReport: false,
      monthlyReport: true
    },
    push: {
      newBookings: true,
      bookingReminders: true,
      cancellations: true,
      messages: false,
      urgentMessages: true
    },
    sms: {
      bookingReminders: false,
      cancellations: false,
      urgentMessages: true
    }
  });

  const handleChange = (category: string, setting: string, checked: boolean) => {
    setNotifications({
      ...notifications,
      [category]: {
        ...notifications[category as keyof typeof notifications],
        [setting]: checked
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating notifications:', notifications);
  };

  const NotificationSection = ({ 
    title, 
    category, 
    settings 
  }: { 
    title: string; 
    category: string; 
    settings: Record<string, boolean> 
  }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      <div className="space-y-3">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-sm text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(category, key, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <NotificationSection
          title="Email Notifications"
          category="email"
          settings={notifications.email}
        />

        <NotificationSection
          title="Push Notifications"
          category="push"
          settings={notifications.push}
        />

        <NotificationSection
          title="SMS Notifications"
          category="sms"
          settings={notifications.sms}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Notification Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Quiet Hours Start
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Quiet Hours End
            </label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          No notifications will be sent during quiet hours except for urgent messages.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save Notification Settings
        </button>
      </div>
    </form>
  );
}