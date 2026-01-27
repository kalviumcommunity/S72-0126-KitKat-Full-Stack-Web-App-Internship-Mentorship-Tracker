// Privacy Tab Component
// Profile visibility, data sharing, and privacy controls

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function PrivacyTab() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'mentors',
    showStatistics: true,
    allowCompanyContact: true,
    shareDataWithMentors: true,
    searchEngineIndexing: false,
    analyticsTracking: true,
    marketingEmails: false
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-8">
      {/* Profile Visibility */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Visibility</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Who can see your profile?
            </label>
            <div className="space-y-3">
              {[
                { id: 'public', name: 'Public', description: 'Anyone can view your profile and statistics' },
                { id: 'mentors', name: 'Mentors Only', description: 'Only verified mentors can see your profile' },
                { id: 'private', name: 'Private', description: 'Only you can see your profile information' }
              ].map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSettingChange('profileVisibility', option.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    privacySettings.profileVisibility === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      privacySettings.profileVisibility === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {privacySettings.profileVisibility === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{option.name}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Show Statistics Publicly</h3>
              <p className="text-sm text-gray-600">
                Allow others to see your application success rates and progress
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.showStatistics}
                onChange={(e) => handleSettingChange('showStatistics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Allow Companies to Contact</h3>
              <p className="text-sm text-gray-600">
                Let companies reach out to you directly for opportunities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.allowCompanyContact}
                onChange={(e) => handleSettingChange('allowCompanyContact', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Share Data with Mentors</h3>
              <p className="text-sm text-gray-600">
                Allow mentors to see your application progress and analytics
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.shareDataWithMentors}
                onChange={(e) => handleSettingChange('shareDataWithMentors', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Search Engine Indexing</h3>
              <p className="text-sm text-gray-600">
                Allow search engines to index your public profile
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.searchEngineIndexing}
                onChange={(e) => handleSettingChange('searchEngineIndexing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Analytics & Tracking */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics & Tracking</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Analytics Tracking</h3>
              <p className="text-sm text-gray-600">
                Help us improve the platform by sharing anonymous usage data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.analyticsTracking}
                onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Marketing Communications</h3>
              <p className="text-sm text-gray-600">
                Receive promotional emails about new features and opportunities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.marketingEmails}
                onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Export Your Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download a copy of all your data including profile information, applications, and messages.
            </p>
            <Button variant="outline">
              Request Data Export
            </Button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Data Retention</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your data is retained according to our privacy policy. You can request deletion at any time.
            </p>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">
                Active Account
              </Badge>
              <span className="text-sm text-gray-600">Data retained indefinitely</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Privacy Policy</h3>
            <p className="text-sm text-gray-600 mb-3">
              Learn more about how we collect, use, and protect your personal information.
            </p>
            <Button variant="outline" size="sm">
              Read Privacy Policy
            </Button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Terms of Service</h3>
            <p className="text-sm text-gray-600 mb-3">
              Review the terms and conditions for using our platform.
            </p>
            <Button variant="outline" size="sm">
              Read Terms of Service
            </Button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
}