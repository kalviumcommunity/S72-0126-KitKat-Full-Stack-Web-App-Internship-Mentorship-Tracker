// Student Analytics Page
// Comprehensive analytics dashboard with application and mentorship insights

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { AnalyticsHeader } from '@/components/dashboard/student/analytics/AnalyticsHeader';
import { ApplicationAnalytics } from '@/components/dashboard/student/analytics/ApplicationAnalytics';
import { PerformanceInsights } from '@/components/dashboard/student/analytics/PerformanceInsights';
import { MentorshipAnalytics } from '@/components/dashboard/student/analytics/MentorshipAnalytics';
import { SkillDevelopment } from '@/components/dashboard/student/analytics/SkillDevelopment';
import { RecommendationsInsights } from '@/components/dashboard/student/analytics/RecommendationsInsights';

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

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
    <StudentDashboardLayout currentPage="analytics">
      <div className="p-6 space-y-6">
        {/* Header with Time Range Selector */}
        <AnalyticsHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
        />

        {/* Application Analytics */}
        <ApplicationAnalytics timeRange={timeRange} />

        {/* Performance Insights */}
        <PerformanceInsights timeRange={timeRange} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Mentorship Analytics */}
            <MentorshipAnalytics timeRange={timeRange} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Skill Development */}
            <SkillDevelopment timeRange={timeRange} />
          </div>
        </div>

        {/* AI Recommendations & Insights */}
        <RecommendationsInsights timeRange={timeRange} />
      </div>
    </StudentDashboardLayout>
  );
}