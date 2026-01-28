// Schedule Page - Mentor Dashboard
// Calendar management and session scheduling

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { CalendarView } from '@/components/dashboard/mentor/schedule/CalendarView';
import { AvailabilityManagement } from '@/components/dashboard/mentor/schedule/AvailabilityManagement';
import { SessionManagement } from '@/components/dashboard/mentor/schedule/SessionManagement';
import { SessionTemplates } from '@/components/dashboard/mentor/schedule/SessionTemplates';

export default function SchedulePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('calendar');

  if (!user || user.role !== UserRole.MENTOR) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'availability', label: 'Availability', icon: '🕐' },
    { id: 'sessions', label: 'Sessions', icon: '💼' },
    { id: 'templates', label: 'Templates', icon: '📋' }
  ];

  return (
    <MentorDashboardLayout currentPage="sessions">
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
                <p className="text-gray-600 mt-1">Manage your availability and mentorship sessions</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">18</span> Sessions This Month
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">3</span> Today
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-green-600">24</span> Hours Available
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'availability' && <AvailabilityManagement />}
          {activeTab === 'sessions' && <SessionManagement />}
          {activeTab === 'templates' && <SessionTemplates />}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}