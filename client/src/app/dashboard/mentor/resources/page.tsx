// Resources Page - Mentor Dashboard
// Manage and share learning resources with students

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { ResourceLibrary } from '@/components/dashboard/mentor/resources/ResourceLibrary';
import { CreateResource } from '@/components/dashboard/mentor/resources/CreateResource';
import { SharedResources } from '@/components/dashboard/mentor/resources/SharedResources';
import { ResourceAnalytics } from '@/components/dashboard/mentor/resources/ResourceAnalytics';

export default function ResourcesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('library');

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
    { id: 'library', label: 'Resource Library', icon: '📚' },
    { id: 'create', label: 'Create Resource', icon: '➕' },
    { id: 'shared', label: 'Shared Resources', icon: '🔗' },
    { id: 'analytics', label: 'Usage Analytics', icon: '📊' }
  ];

  return (
    <MentorDashboardLayout currentPage="resources">
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
                <p className="text-gray-600 mt-1">Curate and share valuable resources with your students</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">156</span> Total Resources
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">89</span> Shared This Month
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-green-600">4.7⭐</span> Avg Rating
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
          {activeTab === 'library' && <ResourceLibrary />}
          {activeTab === 'create' && <CreateResource />}
          {activeTab === 'shared' && <SharedResources />}
          {activeTab === 'analytics' && <ResourceAnalytics />}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}