// Settings Header Component
// Header with title and tab navigation

'use client';

import type { SettingsTab } from '@/app/dashboard/user/settings/page';

interface SettingsHeaderProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsHeader({ activeTab, onTabChange }: SettingsHeaderProps) {
  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: '👤' },
    { id: 'account' as SettingsTab, label: 'Account', icon: '🔐' },
    { id: 'preferences' as SettingsTab, label: 'Preferences', icon: '⚙️' },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: '🔒' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}