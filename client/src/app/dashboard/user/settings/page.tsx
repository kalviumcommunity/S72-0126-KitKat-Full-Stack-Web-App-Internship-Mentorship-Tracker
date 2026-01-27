// Student Settings Page
// Comprehensive settings management with tabbed interface

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { SettingsHeader } from '@/components/dashboard/student/settings/SettingsHeader';
import { ProfileTab } from '@/components/dashboard/student/settings/ProfileTab';
import { AccountTab } from '@/components/dashboard/student/settings/AccountTab';
import { PreferencesTab } from '@/components/dashboard/student/settings/PreferencesTab';
import { PrivacyTab } from '@/components/dashboard/student/settings/PrivacyTab';
import { NotificationsTab } from '@/components/dashboard/student/settings/NotificationsTab';

export type SettingsTab = 'profile' | 'account' | 'preferences' | 'privacy' | 'notifications';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  if (!user || user.role !== UserRole.STUDENT) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <StudentDashboardLayout currentPage="settings">
      <div className="p-6 space-y-6">
        {/* Header with Tabs */}
        <SettingsHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
          {activeTab === 'privacy' && <PrivacyTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </StudentDashboardLayout>
  );
}