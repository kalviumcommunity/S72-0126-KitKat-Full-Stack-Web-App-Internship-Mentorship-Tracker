// Real-Time Dashboard Statistics Component
// Enhanced stats with live updates and animations

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import type { StudentDashboardData, MentorDashboardData } from '@/lib/types';

interface RealTimeStatsProps {
  type: 'student' | 'mentor';
  data: StudentDashboardData | MentorDashboardData;
  refreshInterval?: number;
}

interface StatCard {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  subtitle: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export function RealTimeStats({ type, data, refreshInterval = 30000 }: RealTimeStatsProps) {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate stats based on dashboard type
  const generateStats = (dashboardData: StudentDashboardData | MentorDashboardData): StatCard[] => {
    if (type === 'student') {
      const studentData = dashboardData as StudentDashboardData;
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
        },
        {
          id: 'active-apps',
          title: 'In Progress',
          value: activeApplications,
          subtitle: 'Active applications',
          icon: '⏳',
          color: 'blue',
        },
        {
          id: 'offers',
          title: 'Offers',
          value: studentData.applications.byStatus.OFFER || 0,
          subtitle: `${successRate}% success rate`,
          icon: '🎉',
          color: 'green',
        },
        {
          id: 'feedback',
          title: 'Feedback',
          value: studentData.feedback.total,
          subtitle: 'From mentors',
          icon: '💬',
          color: 'purple',
        },
      ];
    } else {
      const mentorData = dashboardData as MentorDashboardData;
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
        },
        {
          id: 'applications',
          title: 'Applications',
          value: mentorData.applications.total,
          subtitle: `${activeApplications} in progress`,
          icon: '📋',
          color: 'blue',
        },
        {
          id: 'feedback-given',
          title: 'Feedback Given',
          value: mentorData.feedback.total,
          subtitle: 'Total feedback items',
          icon: '💬',
          color: 'purple',
        },
        {
          id: 'needs-feedback',
          title: 'Needs Feedback',
          value: needsFeedback > 0 ? needsFeedback : 0,
          subtitle: 'Applications pending',
          icon: '⚠️',
          color: 'orange',
        },
      ];
    }
  };

  // Initialize stats
  useEffect(() => {
    setStats(generateStats(data));
  }, [data, type]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(async () => {
      setIsRefreshing(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would fetch fresh data
      // For now, we'll just update the timestamp
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getColorClasses = (color: string) => {
    const colors = {
      gray: 'text-gray-900',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Refresh indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </span>
        {isRefreshing && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Refreshing...</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    {stat.trend && (
                      <span className="text-xs">{getTrendIcon(stat.trend)}</span>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <p className={`text-3xl font-bold ${getColorClasses(stat.color)}`}>
                      {stat.value.toLocaleString()}
                    </p>
                    {stat.previousValue !== undefined && stat.previousValue !== stat.value && (
                      <span className={`text-sm ${
                        stat.value > stat.previousValue ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.value > stat.previousValue ? '+' : ''}
                        {stat.value - stat.previousValue}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className="text-4xl ml-4">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}