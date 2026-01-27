// Preferences Tab Component
// Language, timezone, display preferences, and theme settings

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function PreferencesTab() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    dashboardLayout: 'default',
    defaultView: 'list',
    theme: 'light'
  });

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Language & Region */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Language & Region</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language Preference
            </label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              <option value="Europe/Paris">Central European Time (CET)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (01/27/2024)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (27/01/2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2024-01-27)</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY (Jan 27, 2024)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Display Preferences */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Display Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dashboard Layout
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'default', name: 'Default', description: 'Standard layout with sidebar' },
                { id: 'compact', name: 'Compact', description: 'Condensed view with more content' },
                { id: 'wide', name: 'Wide', description: 'Full-width layout for large screens' }
              ].map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => handlePreferenceChange('dashboardLayout', layout.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    preferences.dashboardLayout === layout.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{layout.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{layout.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Views
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Applications Page</label>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="list">List View</option>
                  <option value="kanban">Kanban View</option>
                  <option value="calendar">Calendar View</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Settings */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Theme</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'light', name: 'Light', description: 'Clean and bright interface', preview: 'bg-white border-gray-200' },
              { id: 'dark', name: 'Dark', description: 'Easy on the eyes in low light', preview: 'bg-gray-900 border-gray-700' },
              { id: 'auto', name: 'Auto', description: 'Matches your system preference', preview: 'bg-gradient-to-r from-white to-gray-900' }
            ].map((theme) => (
              <div
                key={theme.id}
                onClick={() => handlePreferenceChange('theme', theme.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  preferences.theme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 rounded-lg mb-3 border ${theme.preview}`}></div>
                <h3 className="font-medium text-gray-900">{theme.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Preferences */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Reduce Motion</h3>
              <p className="text-sm text-gray-600">Minimize animations and transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">High Contrast</h3>
              <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}