// Feedback Management Page - Mentor Dashboard
// Create, manage, and track feedback for students

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { CreateFeedbackSection } from '@/components/dashboard/mentor/feedback/CreateFeedbackSection';
import { FeedbackTemplates } from '@/components/dashboard/mentor/feedback/FeedbackTemplates';
import { FeedbackHistory } from '@/components/dashboard/mentor/feedback/FeedbackHistory';
import { FeedbackAnalytics } from '@/components/dashboard/mentor/feedback/FeedbackAnalytics';

export default function FeedbackManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');

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
    { id: 'create', label: 'Create Feedback', icon: '✏️' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  return (
    <MentorDashboardLayout currentPage="feedback">
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
                <p className="text-gray-600 mt-1">Create, manage, and track student feedback</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">67</span> Total Feedback Given
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">5</span> Pending Reviews
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-green-600">4.8⭐</span> Average Rating
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
          {activeTab === 'create' && <CreateFeedbackSection />}
          {activeTab === 'templates' && <FeedbackTemplates />}
          {activeTab === 'history' && <FeedbackHistory />}
          {activeTab === 'analytics' && <FeedbackAnalytics />}
        </div>
      </div>
    </MentorDashboardLayout>
  );
}