// Optimized Dashboard Components
// Performance-tuned dashboard with visual polish

'use client';

import React, { memo, useMemo, useCallback, Suspense } from 'react';
import { FadeIn, SlideIn, StaggeredList, AnimatedCounter } from '@/components/ui/AnimatedComponents';
import { OptimizedCard, VirtualizedList } from '@/components/ui/OptimizedComponents';
import { LoadingWrapper, StatsSkeleton, ChartSkeleton } from '@/components/ui/LoadingStates';
import { usePerformanceMonitor } from '@/lib/performance-monitor';
import type { StudentDashboardData, MentorDashboardData } from '@/lib/types';

// Optimized Stats Card with animations
const OptimizedStatsCard = memo(function OptimizedStatsCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  delay = 0,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
}) {
  const { trackInteraction } = usePerformanceMonitor('OptimizedStatsCard');

  const colorClasses = useMemo(() => {
    const colors = {
      gray: 'text-gray-900',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  }, [color]);

  const trendIcon = useMemo(() => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '';
    }
  }, [trend]);

  const handleClick = useCallback(() => {
    const endTracking = trackInteraction('stats-card-click');
    // Add click logic here
    endTracking();
  }, [trackInteraction]);

  return (
    <SlideIn direction="up" delay={delay} duration={400}>
      <OptimizedCard 
        className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        onClick={handleClick}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
              <div className="flex items-baseline space-x-2">
                <AnimatedCounter 
                  value={value} 
                  className={`text-3xl font-bold ${colorClasses}`}
                  duration={1000}
                />
                {trendIcon && (
                  <span className="text-sm opacity-75">{trendIcon}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            </div>
            <div className="text-4xl ml-4 opacity-80">{icon}</div>
          </div>
        </div>
      </OptimizedCard>
    </SlideIn>
  );
});

// Optimized Dashboard Stats Grid
export const OptimizedDashboardStats = memo(function OptimizedDashboardStats({
  data,
  type,
}: {
  data: StudentDashboardData | MentorDashboardData;
  type: 'student' | 'mentor';
}) {
  const { trackInteraction } = usePerformanceMonitor('OptimizedDashboardStats');

  const statsData = useMemo(() => {
    if (type === 'student') {
      const studentData = data as StudentDashboardData;
      const activeApplications = 
        (studentData.applications.byStatus.APPLIED || 0) + 
        (studentData.applications.byStatus.SHORTLISTED || 0) + 
        (studentData.applications.byStatus.INTERVIEW || 0);

      const successRate = studentData.applications.total > 0
        ? Math.round(((studentData.applications.byStatus.OFFER || 0) / studentData.applications.total) * 100)
        : 0;

      return [
        {
          id: 'total-apps',
          title: 'Total Applications',
          value: studentData.applications.total,
          subtitle: `${studentData.applications.byStatus.DRAFT || 0} drafts`,
          icon: '📋',
          color: 'gray',
          trend: 'up' as const,
        },
        {
          id: 'active-apps',
          title: 'In Progress',
          value: activeApplications,
          subtitle: 'Active applications',
          icon: '⏳',
          color: 'blue',
          trend: 'stable' as const,
        },
        {
          id: 'offers',
          title: 'Offers',
          value: studentData.applications.byStatus.OFFER || 0,
          subtitle: `${successRate}% success rate`,
          icon: '🎉',
          color: 'green',
          trend: 'up' as const,
        },
        {
          id: 'feedback',
          title: 'Feedback',
          value: studentData.feedback.total,
          subtitle: 'From mentors',
          icon: '💬',
          color: 'purple',
          trend: 'up' as const,
        },
      ];
    } else {
      const mentorData = data as MentorDashboardData;
      const activeApplications = 
        (mentorData.applications.byStatus.APPLIED || 0) + 
        (mentorData.applications.byStatus.SHORTLISTED || 0) + 
        (mentorData.applications.byStatus.INTERVIEW || 0);

      const needsFeedback = mentorData.applications.total - mentorData.feedback.total;

      return [
        {
          id: 'students',
          title: 'My Students',
          value: mentorData.students.length,
          subtitle: 'Active mentees',
          icon: '👥',
          color: 'gray',
          trend: 'stable' as const,
        },
        {
          id: 'applications',
          title: 'Applications',
          value: mentorData.applications.total,
          subtitle: `${activeApplications} in progress`,
          icon: '📋',
          color: 'blue',
          trend: 'up' as const,
        },
        {
          id: 'feedback-given',
          title: 'Feedback Given',
          value: mentorData.feedback.total,
          subtitle: 'Total feedback items',
          icon: '💬',
          color: 'purple',
          trend: 'up' as const,
        },
        {
          id: 'needs-feedback',
          title: 'Needs Feedback',
          value: needsFeedback > 0 ? needsFeedback : 0,
          subtitle: 'Applications pending',
          icon: '⚠️',
          color: 'orange',
          trend: (needsFeedback > 0 ? 'up' : 'stable') as 'up' | 'down' | 'stable',
        },
      ];
    }
  }, [data, type]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <OptimizedStatsCard
          key={stat.id}
          {...stat}
          delay={index * 100}
        />
      ))}
    </div>
  );
});

// Optimized Application List with virtualization
export const OptimizedApplicationList = memo(function OptimizedApplicationList({
  applications,
  maxItems = 10,
}: {
  applications: any[];
  maxItems?: number;
}) {
  const { trackInteraction } = usePerformanceMonitor('OptimizedApplicationList');

  const displayApplications = useMemo(() => {
    return applications.slice(0, maxItems);
  }, [applications, maxItems]);

  const renderApplication = useCallback((application: any, index: number) => {
    const handleClick = () => {
      const endTracking = trackInteraction('application-click');
      // Navigate to application details
      endTracking();
    };

    return (
      <div
        key={application.id}
        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {application.company}
            </h4>
            <p className="text-sm text-gray-600 truncate">
              {application.role}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                application.status === 'OFFER' ? 'bg-green-100 text-green-800' :
                application.status === 'INTERVIEW' ? 'bg-purple-100 text-purple-800' :
                application.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {application.status}
              </span>
              {application.deadline && (
                <span className="text-xs text-gray-500">
                  Due: {new Date(application.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="ml-4 text-gray-400">
            →
          </div>
        </div>
      </div>
    );
  }, [trackInteraction]);

  if (displayApplications.length === 0) {
    return (
      <FadeIn>
        <OptimizedCard className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first application</p>
        </OptimizedCard>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <OptimizedCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Applications
          </h3>
          <StaggeredList staggerDelay={50}>
            {displayApplications.map((application, index) => 
              renderApplication(application, index)
            )}
          </StaggeredList>
        </div>
      </OptimizedCard>
    </FadeIn>
  );
});

// Optimized Chart Component with lazy loading
const OptimizedChart = memo(function OptimizedChart({
  data,
  title,
  type = 'bar',
}: {
  data: any;
  title: string;
  type?: 'bar' | 'pie' | 'line';
}) {
  const { trackInteraction } = usePerformanceMonitor('OptimizedChart');

  // Simple placeholder chart component
  const ChartComponent = React.useMemo(() => {
    return ({ data }: { data: any }) => (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Chart visualization coming soon</p>
      </div>
    );
  }, [type]);

  return (
    <SlideIn direction="up" delay={200}>
      <OptimizedCard>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="h-64">
            <ChartComponent data={data} />
          </div>
        </div>
      </OptimizedCard>
    </SlideIn>
  );
});

// Main Optimized Dashboard Layout
export const OptimizedDashboardLayout = memo(function OptimizedDashboardLayout({
  data,
  type,
  isLoading = false,
  error = null,
}: {
  data: StudentDashboardData | MentorDashboardData;
  type: 'student' | 'mentor';
  isLoading?: boolean;
  error?: string | null;
}) {
  const { trackInteraction, getMetrics } = usePerformanceMonitor('OptimizedDashboardLayout');

  const handleRefresh = useCallback(() => {
    const endTracking = trackInteraction('dashboard-refresh');
    // Refresh logic here
    endTracking();
  }, [trackInteraction]);

  if (error) {
    return (
      <FadeIn>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </FadeIn>
    );
  }

  return (
    <LoadingWrapper
      isLoading={isLoading}
      skeleton={<StatsSkeleton />}
      error={error}
      retry={handleRefresh}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <FadeIn>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {data.user.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {type === 'student' 
                  ? "Here's an overview of your internship application journey"
                  : "Here's an overview of your students' progress"
                }
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Refresh
            </button>
          </div>
        </FadeIn>

        {/* Stats Section */}
        <OptimizedDashboardStats data={data} type={type} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <OptimizedApplicationList 
              applications={type === 'student' 
                ? (data as StudentDashboardData).applications.recent
                : (data as MentorDashboardData).applications.recent
              }
            />
            
            <OptimizedChart
              data={type === 'student' 
                ? (data as StudentDashboardData).applications
                : (data as MentorDashboardData).applications
              }
              title="Application Progress"
              type="bar"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <SlideIn direction="right" delay={300}>
              <OptimizedCard>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      ➕ New Application
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      📋 View All Applications
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      💬 View Feedback
                    </button>
                  </div>
                </div>
              </OptimizedCard>
            </SlideIn>

            {/* Performance Metrics (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <SlideIn direction="right" delay={400}>
                <OptimizedCard>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Performance Metrics
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>Render Time: {getMetrics().renderTime.toFixed(2)}ms</div>
                      <div>Components: {getMetrics().componentCount}</div>
                      <div>Memory: {(getMetrics().memoryUsage / 1024 / 1024).toFixed(2)}MB</div>
                    </div>
                  </div>
                </OptimizedCard>
              </SlideIn>
            )}
          </div>
        </div>
      </div>
    </LoadingWrapper>
  );
});