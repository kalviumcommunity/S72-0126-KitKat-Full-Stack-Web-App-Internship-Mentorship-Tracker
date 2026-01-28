// Applications Page - Mentor Dashboard
// Track and review student applications

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { ApplicationsOverview } from '@/components/dashboard/mentor/applications/ApplicationsOverview';
import { ApplicationsReview } from '@/components/dashboard/mentor/applications/ApplicationsReview';
import { ApplicationsTracking } from '@/components/dashboard/mentor/applications/ApplicationsTracking';
import { ApplicationsAnalytics } from '@/components/dashboard/mentor/applications/ApplicationsAnalytics';

export default function MentorApplicationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

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
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'review', label: 'Review Queue', icon: '📝' },
    { id: 'tracking', label: 'Tracking', icon: '📈' },
    { id: 'analytics', label: 'Analytics', icon: '🎯' }
  ];

  return (
    <MentorDashboardLayout currentPage="applications">
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Applications</h1>
                <p className="text-gray-600 mt-1">Track and support your students' application journey</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">127</span> Total Applications
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-red-600">5</span> Need Review
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-green-600">78%</span> Success Rate
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
          {activeTab === 'overview' && <ApplicationsOverview />}
          {activeTab === 'review' && <ApplicationsReview />}
          {activeTab === 'tracking' && <ApplicationsTracking />}
          {activeTab === 'analytics' && <ApplicationsAnalytics />}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}