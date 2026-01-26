// Enhanced Mentor Student Overview Component
// Performance-optimized student management for mentors

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, subDays, isAfter } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { User, ApplicationWithUser, FeedbackWithRelations } from '@/lib/types';

interface MentorStudentOverviewProps {
  students: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>[];
  applications: ApplicationWithUser[];
  feedback: FeedbackWithRelations[];
}

interface StudentMetrics {
  id: string;
  name: string;
  email: string;
  totalApplications: number;
  activeApplications: number;
  offers: number;
  lastActivity: string;
  needsAttention: boolean;
  recentFeedback: number;
}

export function MentorStudentOverview({ 
  students, 
  applications, 
  feedback 
}: MentorStudentOverviewProps) {
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'applications' | 'attention'>('attention');

  // Memoized student metrics for performance
  const studentMetrics = useMemo(() => {
    return students.map(student => {
      const studentApps = applications.filter(app => app.userId === student.id);
      const studentFeedback = feedback.filter(fb => fb.application.userId === student.id);
      
      const activeApps = studentApps.filter(app => 
        ['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(app.status)
      );
      
      const offers = studentApps.filter(app => app.status === 'OFFER');
      
      // Find most recent activity
      const allDates = [
        ...studentApps.map(app => app.updatedAt),
        ...studentFeedback.map(fb => fb.createdAt)
      ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      
      const lastActivity = allDates[0] || student.email; // Fallback
      
      // Check if needs attention (no recent feedback, active applications)
      const recentFeedback = studentFeedback.filter(fb => 
        isAfter(new Date(fb.createdAt), subDays(new Date(), 7))
      );
      
      const needsAttention = activeApps.length > 0 && recentFeedback.length === 0;

      return {
        id: student.id,
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown',
        email: student.email,
        totalApplications: studentApps.length,
        activeApplications: activeApps.length,
        offers: offers.length,
        lastActivity,
        needsAttention,
        recentFeedback: recentFeedback.length,
      };
    });
  }, [students, applications, feedback]);

  // Sorted metrics based on current sort option
  const sortedMetrics = useMemo(() => {
    const sorted = [...studentMetrics];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'activity':
        return sorted.sort((a, b) => 
          new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        );
      
      case 'applications':
        return sorted.sort((a, b) => b.totalApplications - a.totalApplications);
      
      case 'attention':
      default:
        return sorted.sort((a, b) => {
          if (a.needsAttention && !b.needsAttention) return -1;
          if (!a.needsAttention && b.needsAttention) return 1;
          return b.activeApplications - a.activeApplications;
        });
    }
  }, [studentMetrics, sortBy]);

  const getActivityColor = (lastActivity: string) => {
    const activityDate = new Date(lastActivity);
    const threeDaysAgo = subDays(new Date(), 3);
    const weekAgo = subDays(new Date(), 7);
    
    if (isAfter(activityDate, threeDaysAgo)) return 'text-green-600';
    if (isAfter(activityDate, weekAgo)) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityIcon = (lastActivity: string) => {
    const activityDate = new Date(lastActivity);
    const threeDaysAgo = subDays(new Date(), 3);
    const weekAgo = subDays(new Date(), 7);
    
    if (isAfter(activityDate, threeDaysAgo)) return '🟢';
    if (isAfter(activityDate, weekAgo)) return '🟡';
    return '🔴';
  };

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">My Students</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-gray-600 text-sm">No students assigned yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            My Students ({students.length})
          </h3>
          <Link href="/mentor/students">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { key: 'attention', label: 'Needs Attention' },
            { key: 'activity', label: 'Recent Activity' },
            { key: 'applications', label: 'Most Applications' },
            { key: 'name', label: 'Name' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as any)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                sortBy === option.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {sortedMetrics.slice(0, 8).map((student) => (
            <Link
              key={student.id}
              href={`/mentor/students/${student.id}`}
              className="block hover:bg-gray-50 -mx-4 px-4 py-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {student.name}
                    </h4>
                    {student.needsAttention && (
                      <Badge variant="warning" size="sm">
                        Needs Attention
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    {student.email}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      📋 {student.totalApplications} apps
                    </span>
                    
                    {student.activeApplications > 0 && (
                      <span className="text-blue-600">
                        ⏳ {student.activeApplications} active
                      </span>
                    )}
                    
                    {student.offers > 0 && (
                      <span className="text-green-600">
                        🎉 {student.offers} offers
                      </span>
                    )}
                    
                    <span className={`flex items-center space-x-1 ${getActivityColor(student.lastActivity)}`}>
                      <span>{getActivityIcon(student.lastActivity)}</span>
                      <span>
                        {format(new Date(student.lastActivity), 'MMM dd')}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {student.recentFeedback > 0 && (
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      💬 {student.recentFeedback}
                    </span>
                  )}
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {sortedMetrics.length > 8 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <Link href="/mentor/students">
              <Button variant="outline" size="sm">
                View All {students.length} Students
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}