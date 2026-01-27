// Notifications Tab Component
// Comprehensive notification preferences organized by category

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export function NotificationsTab() {
  const [notificationSettings, setNotificationSettings] = useState({
    applications: [
      {
        id: 'app_status_change',
        title: 'Application status change',
        description: 'When your application status is updated by a company',
        enabled: true,
        channels: { email: true, push: true, sms: false }
      },
      {
        id: 'company_message',
        title: 'New message from company',
        description: 'When a company sends you a direct message',
        enabled: true,
        channels: { email: true, push: true, sms: false }
      },
      {
        id: 'interview_reminder',
        title: 'Interview reminders',
        description: 'Reminders 1 day before scheduled interviews',
        enabled: true,
        channels: { email: true, push: true, sms: true }
      },
      {
        id: 'app_deadline',
        title: 'Application deadlines',
        description: 'Reminders for upcoming application deadlines',
        enabled: true,
        channels: { email: true, push: true, sms: false }
      }
    ] as NotificationSetting[],
    mentorship: [
      {
        id: 'mentor_feedback',
        title: 'New mentor feedback',
        description: 'When a mentor provides feedback on your progress',
        enabled: true,
        channels: { email: true, push: true, sms: false }
      },
      {
        id: 'session_reminder',
        title: 'Session reminders',
        description: 'Reminders 1 hour before mentorship sessions',
        enabled: true,
        channels: { email: true, push: true, sms: false }
      },
      {
        id: 'mentor_message',
        title: 'Mentor messages',
        description: 'When a mentor sends you a message',
        enabled: true,
        channels: { email: true, push: true, sms: false }
      },
      {
        id: 'new_mentor',
        title: 'New mentor available',
        description: 'When new mentors matching your interests join',
        enabled: false,
        channels: { email: false, push: false, sms: false }
      }
    ] as NotificationSetting[],
    platform: [
      {
        id: 'progress_report',
        title: 'Weekly progress report',
        description: 'Summary of your weekly activity and achievements',
        enabled: true,
        channels: { email: true, push: false, sms: false }
      },
      {
        id: 'feature_updates',
        title: 'Feature updates',
        description: 'Notifications about new platform features',
        enabled: false,
        channels: { email: false, push: false, sms: false }
      },
      {
        id: 'marketing_emails',
        title: 'Marketing emails',
        description: 'Promotional content and platform news',
        enabled: false,
        channels: { email: false, push: false, sms: false }
      }
    ] as NotificationSetting[]
  });

  const [deliverySettings, setDeliverySettings] = useState({
    emailFrequency: 'instant',
    pushEnabled: true,
    smsEnabled: false
  });

  const toggleNotification = (category: keyof typeof notificationSettings, id: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: prev[category].map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    }));
  };

  const toggleChannel = (category: keyof typeof notificationSettings, id: string, channel: keyof NotificationSetting['channels']) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: prev[category].map(setting =>
        setting.id === id
          ? {
              ...setting,
              channels: { ...setting.channels, [channel]: !setting.channels[channel] }
            }
          : setting
      )
    }));
  };

  const renderNotificationCategory = (
    title: string,
    icon: string,
    category: keyof typeof notificationSettings,
    settings: NotificationSetting[]
  ) => (
    <section>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="font-medium text-gray-900">{setting.title}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.enabled}
                      onChange={() => toggleNotification(category, setting.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
            </div>
            
            {setting.enabled && (
              <div className="flex items-center space-x-6 mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Delivery:</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.channels.email}
                      onChange={() => toggleChannel(category, setting.id, 'email')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">📧 Email</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.channels.push && deliverySettings.pushEnabled}
                      onChange={() => toggleChannel(category, setting.id, 'push')}
                      disabled={!deliverySettings.pushEnabled}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-600">📱 Push</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.channels.sms && deliverySettings.smsEnabled}
                      onChange={() => toggleChannel(category, setting.id, 'sms')}
                      disabled={!deliverySettings.smsEnabled}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-600">💬 SMS</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Delivery Channels */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📧</span>
                <h3 className="font-medium text-gray-900">Email</h3>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <select
              value={deliverySettings.emailFrequency}
              onChange={(e) => setDeliverySettings(prev => ({ ...prev, emailFrequency: e.target.value }))}
              className="w-full mt-2 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📱</span>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverySettings.pushEnabled}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, pushEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              {deliverySettings.pushEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">💬</span>
                <h3 className="font-medium text-gray-900">SMS</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliverySettings.smsEnabled}
                  onChange={(e) => setDeliverySettings(prev => ({ ...prev, smsEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              {deliverySettings.smsEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </section>

      {/* Applications Notifications */}
      {renderNotificationCategory(
        'Applications',
        '📋',
        'applications',
        notificationSettings.applications
      )}

      {/* Mentorship Notifications */}
      {renderNotificationCategory(
        'Mentorship',
        '🎓',
        'mentorship',
        notificationSettings.mentorship
      )}

      {/* Platform Notifications */}
      {renderNotificationCategory(
        'Platform',
        '🔔',
        'platform',
        notificationSettings.platform
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              // Enable all notifications
              const enableAll = (settings: NotificationSetting[]) =>
                settings.map(setting => ({ ...setting, enabled: true }));
              
              setNotificationSettings(prev => ({
                applications: enableAll(prev.applications),
                mentorship: enableAll(prev.mentorship),
                platform: enableAll(prev.platform)
              }));
            }}
          >
            Enable All
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Disable all notifications
              const disableAll = (settings: NotificationSetting[]) =>
                settings.map(setting => ({ ...setting, enabled: false }));
              
              setNotificationSettings(prev => ({
                applications: disableAll(prev.applications),
                mentorship: disableAll(prev.mentorship),
                platform: disableAll(prev.platform)
              }));
            }}
          >
            Disable All
          </Button>
          <Button variant="outline">
            Reset to Defaults
          </Button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
}