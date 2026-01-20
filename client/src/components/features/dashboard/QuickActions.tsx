// Enhanced Quick Actions Component
// Context-aware action buttons with performance optimizations

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { addDays, isBefore, isAfter } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ApplicationWithFeedback, FeedbackWithRelations, UserRole } from '@/lib/types';

interface QuickActionsProps {
  userRole: UserRole;
  applications?: ApplicationWithFeedback[];
  feedback?: FeedbackWithRelations[];
  studentId?: string;
}

interface ActionItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  variant: 'default' | 'outline' | 'destructive';
  priority: number;
  badge?: string;
  description?: string;
}

export function QuickActions({ 
  userRole, 
  applications = [], 
  feedback = [],
  studentId 
}: QuickActionsProps) {
  // Memoized actions based on user context and data
  const contextualActions = useMemo(() => {
    const actions: ActionItem[] = [];

    if (userRole === 'STUDENT') {
      // Student-specific actions
      actions.push({
        id: 'new-application',
        label: 'New Application',
        href: '/student/applications/new',
        icon: '➕',
        variant: 'default',
        priority: 1,
        description: 'Add a new internship application',
      });

      // Check for urgent deadlines
      const urgentApps = applications.filter(app => {
        if (!app.deadline) return false;
        const deadline = new Date(app.deadline);
        const threeDaysFromNow = addDays(new Date(), 3);
        return isBefore(deadline, threeDaysFromNow) && isAfter(deadline, new Date());
      });

      if (urgentApps.length > 0) {
        actions.push({
          id: 'urgent-deadlines',
          label: 'Urgent Deadlines',
          href: '/student/applications?filter=urgent',
          icon: '⚠️',
          variant: 'destructive',
          priority: 0,
          badge: urgentApps.length.toString(),
          description: 'Applications with upcoming deadlines',
        });
      }

      // Check for applications needing updates
      const needsUpdate = applications.filter(app => 
        app.status === 'APPLIED' && 
        isAfter(addDays(new Date(), -7), new Date(app.updatedAt))
      );

      if (needsUpdate.length > 0) {
        actions.push({
          id: 'update-status',
          label: 'Update Status',
          href: '/student/applications?filter=needs-update',
          icon: '🔄',
          variant: 'outline',
          priority: 2,
          badge: needsUpdate.length.toString(),
          description: 'Applications that may need status updates',
        });
      }

      actions.push(
        {
          id: 'view-applications',
          label: 'All Applications',
          href: '/student/applications',
          icon: '📋',
          variant: 'outline',
          priority: 3,
          description: 'View and manage all applications',
        },
        {
          id: 'view-feedback',
          label: 'View Feedback',
          href: '/student/feedback',
          icon: '💬',
          variant: 'outline',
          priority: 4,
          badge: feedback.length > 0 ? feedback.length.toString() : undefined,
          description: 'Review mentor feedback',
        }
      );

    } else if (userRole === 'MENTOR') {
      // Mentor-specific actions
      
      // Check for applications needing feedback
      const needsFeedback = applications.filter(app => 
        ['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(app.status) &&
        app.feedback.length === 0
      );

      if (needsFeedback.length > 0) {
        actions.push({
          id: 'provide-feedback',
          label: 'Provide Feedback',
          href: '/mentor/feedback/new',
          icon: '✍️',
          variant: 'default',
          priority: 0,
          badge: needsFeedback.length.toString(),
          description: 'Applications waiting for your feedback',
        });
      } else {
        actions.push({
          id: 'provide-feedback',
          label: 'Provide Feedback',
          href: '/mentor/feedback',
          icon: '✍️',
          variant: 'default',
          priority: 1,
          description: 'Give feedback to your students',
        });
      }

      // Check for students needing attention
      const studentsNeedingAttention = applications
        .filter(app => 
          ['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(app.status) &&
          isAfter(addDays(new Date(), -7), new Date(app.updatedAt))
        )
        .map(app => app.userId)
        .filter((userId, index, arr) => arr.indexOf(userId) === index);

      if (studentsNeedingAttention.length > 0) {
        actions.push({
          id: 'check-students',
          label: 'Check Students',
          href: '/mentor/students?filter=needs-attention',
          icon: '👥',
          variant: 'outline',
          priority: 2,
          badge: studentsNeedingAttention.length.toString(),
          description: 'Students who may need your attention',
        });
      }

      actions.push(
        {
          id: 'view-students',
          label: 'All Students',
          href: '/mentor/students',
          icon: '👥',
          variant: 'outline',
          priority: 3,
          description: 'View and manage your students',
        },
        {
          id: 'feedback-history',
          label: 'Feedback History',
          href: '/mentor/feedback',
          icon: '📝',
          variant: 'outline',
          priority: 4,
          description: 'Review your feedback history',
        }
      );
    }

    // Sort by priority (lower number = higher priority)
    return actions.sort((a, b) => a.priority - b.priority);
  }, [userRole, applications, feedback]);

  // Get top priority actions for display
  const displayActions = contextualActions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayActions.map((action) => (
          <Link key={action.id} href={action.href} className="block">
            <Button 
              variant={action.variant} 
              className="w-full justify-start relative group"
              size="sm"
            >
              <div className="flex items-center space-x-2 flex-1">
                <span>{action.icon}</span>
                <span>{action.label}</span>
                {action.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {action.badge}
                  </span>
                )}
              </div>
              
              {/* Tooltip */}
              {action.description && (
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {action.description}
                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </Button>
          </Link>
        ))}
        
        {contextualActions.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No actions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}