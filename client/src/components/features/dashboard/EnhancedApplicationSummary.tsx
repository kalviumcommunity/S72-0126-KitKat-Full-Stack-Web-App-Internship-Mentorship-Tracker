// Enhanced Application Summary Component
// Improved version with better performance and UI polish

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, isAfter, isBefore, addDays } from 'date-fns';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ApplicationWithFeedback, ApplicationStatus } from '@/lib/types';

interface EnhancedApplicationSummaryProps {
  applications: ApplicationWithFeedback[];
  maxItems?: number;
  showFilters?: boolean;
}

type FilterType = 'all' | 'urgent' | 'recent' | 'needs-attention';

export function EnhancedApplicationSummary({ 
  applications, 
  maxItems = 5,
  showFilters = true 
}: EnhancedApplicationSummaryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Memoized filtered applications for performance
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    switch (activeFilter) {
      case 'urgent':
        filtered = applications.filter(app => {
          if (!app.deadline) return false;
          const deadline = new Date(app.deadline);
          const threeDaysFromNow = addDays(new Date(), 3);
          return isBefore(deadline, threeDaysFromNow) && isAfter(deadline, new Date());
        });
        break;
      
      case 'recent':
        filtered = applications.filter(app => {
          const sevenDaysAgo = addDays(new Date(), -7);
          const updatedAt = new Date(app.updatedAt);
          return isAfter(updatedAt, sevenDaysAgo);
        });
        break;
      
      case 'needs-attention':
        filtered = applications.filter(app => 
          app.status === 'INTERVIEW' || 
          (app.status === 'APPLIED' && app.feedback.length === 0)
        );
        break;
      
      default:
        // 'all' - no filtering
        break;
    }

    // Sort by priority: urgent deadlines first, then by update date
    return filtered
      .sort((a, b) => {
        // Priority 1: Urgent deadlines
        const aUrgent = a.deadline && isBefore(new Date(a.deadline), addDays(new Date(), 3));
        const bUrgent = b.deadline && isBefore(new Date(b.deadline), addDays(new Date(), 3));
        
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        
        // Priority 2: Recent updates
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
      .slice(0, maxItems);
  }, [applications, activeFilter, maxItems]);

  const getStatusConfig = (status: ApplicationStatus) => {
    const configs = {
      DRAFT: { color: 'gray', label: 'Draft', priority: 1 },
      APPLIED: { color: 'blue', label: 'Applied', priority: 2 },
      SHORTLISTED: { color: 'yellow', label: 'Shortlisted', priority: 3 },
      INTERVIEW: { color: 'purple', label: 'Interview', priority: 4 },
      OFFER: { color: 'green', label: 'Offer', priority: 5 },
      REJECTED: { color: 'red', label: 'Rejected', priority: 0 },
    };
    return configs[status] || configs.DRAFT;
  };

  const getUrgencyIndicator = (deadline?: string) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);
    const oneWeekFromNow = addDays(now, 7);

    if (isBefore(deadlineDate, now)) {
      return { icon: '🔴', label: 'Overdue', color: 'text-red-600' };
    } else if (isBefore(deadlineDate, threeDaysFromNow)) {
      return { icon: '🟡', label: 'Urgent', color: 'text-orange-600' };
    } else if (isBefore(deadlineDate, oneWeekFromNow)) {
      return { icon: '🟢', label: 'Soon', color: 'text-yellow-600' };
    }
    
    return null;
  };

  const filterOptions = [
    { key: 'all', label: 'All', count: applications.length },
    { 
      key: 'urgent', 
      label: 'Urgent', 
      count: applications.filter(app => {
        if (!app.deadline) return false;
        const deadline = new Date(app.deadline);
        const threeDaysFromNow = addDays(new Date(), 3);
        return isBefore(deadline, threeDaysFromNow) && isAfter(deadline, new Date());
      }).length 
    },
    { 
      key: 'recent', 
      label: 'Recent', 
      count: applications.filter(app => {
        const sevenDaysAgo = addDays(new Date(), -7);
        const updatedAt = new Date(app.updatedAt);
        return isAfter(updatedAt, sevenDaysAgo);
      }).length 
    },
    { 
      key: 'needs-attention', 
      label: 'Needs Attention', 
      count: applications.filter(app => 
        app.status === 'INTERVIEW' || 
        (app.status === 'APPLIED' && app.feedback.length === 0)
      ).length 
    },
  ];

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600 text-sm mb-4">No applications yet</p>
            <Link href="/student/applications/new">
              <Button size="sm">Create Your First Application</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
          <Link href="/student/applications">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveFilter(option.key as FilterType)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeFilter === option.key
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {filteredApplications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No applications match the current filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const urgency = getUrgencyIndicator(application.deadline);
              
              return (
                <Link
                  key={application.id}
                  href={`/student/applications/${application.id}`}
                  className="block hover:bg-gray-50 -mx-4 px-4 py-3 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {application.company}
                        </h4>
                        {urgency && (
                          <span className={`text-xs ${urgency.color}`}>
                            {urgency.icon} {urgency.label}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {application.role}
                      </p>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <Badge variant={statusConfig.color as any} size="sm">
                          {statusConfig.label}
                        </Badge>
                        
                        {application.deadline && (
                          <span>
                            Due: {format(new Date(application.deadline), 'MMM dd')}
                          </span>
                        )}
                        
                        {application.feedback.length > 0 && (
                          <span className="flex items-center space-x-1">
                            <span>💬</span>
                            <span>{application.feedback.length} feedback</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}