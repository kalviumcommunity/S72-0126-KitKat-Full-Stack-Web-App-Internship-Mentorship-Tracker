// Student Applications Page
// Comprehensive application management with multiple views and detailed tracking

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { StudentDashboardLayout } from '@/components/dashboard/student/StudentDashboardLayout';
import { ApplicationsToolbar } from '@/components/dashboard/student/applications/ApplicationsToolbar';
import { ApplicationsQuickStats } from '@/components/dashboard/student/applications/ApplicationsQuickStats';
import { ApplicationsListView } from '@/components/dashboard/student/applications/ApplicationsListView';
import { ApplicationsKanbanView } from '@/components/dashboard/student/applications/ApplicationsKanbanView';
import { ApplicationsCalendarView } from '@/components/dashboard/student/applications/ApplicationsCalendarView';
import { ApplicationDetailModal } from '@/components/dashboard/student/applications/ApplicationDetailModal';

export type ViewMode = 'list' | 'kanban' | 'calendar';
export type SortOption = 'recent' | 'company' | 'status';

export interface ApplicationFilters {
  search: string;
  status: string[];
  company: string[];
  position: string[];
  dateRange: {
    start: string;
    end: string;
  } | null;
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ApplicationFilters>({
    search: '',
    status: [],
    company: [],
    position: [],
    dateRange: null
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

  const handleViewApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setDetailModalOpen(true);
  };

  const handleEditApplication = (applicationId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit application:', applicationId);
  };

  const handleBulkAction = (action: string) => {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action, 'on applications:', selectedApplications);
  };

  return (
    <StudentDashboardLayout currentPage="applications">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your internship applications
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <ApplicationsToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={filters}
          onFiltersChange={setFilters}
          selectedCount={selectedApplications.length}
          onBulkAction={handleBulkAction}
        />

        {/* Quick Stats */}
        <ApplicationsQuickStats />

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {viewMode === 'list' && (
            <ApplicationsListView
              filters={filters}
              sortBy={sortBy}
              selectedApplications={selectedApplications}
              onSelectionChange={setSelectedApplications}
              onViewApplication={handleViewApplication}
              onEditApplication={handleEditApplication}
            />
          )}
          
          {viewMode === 'kanban' && (
            <ApplicationsKanbanView
              filters={filters}
              onViewApplication={handleViewApplication}
              onEditApplication={handleEditApplication}
            />
          )}
          
          {viewMode === 'calendar' && (
            <ApplicationsCalendarView
              filters={filters}
              onViewApplication={handleViewApplication}
            />
          )}
        </div>

        {/* Application Detail Modal */}
        <ApplicationDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          applicationId={selectedApplicationId}
        />
      </div>
    </StudentDashboardLayout>
  );
}