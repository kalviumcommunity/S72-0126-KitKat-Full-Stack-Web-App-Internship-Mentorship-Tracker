// My Students Page - Mentor Dashboard
// Comprehensive student management for mentors

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MentorDashboardLayout } from '@/components/dashboard/mentor/MentorDashboardLayout';
import { StudentsToolbar } from '@/components/dashboard/mentor/students/StudentsToolbar';
import { StudentsGridView } from '@/components/dashboard/mentor/students/StudentsGridView';
import { StudentsListView } from '@/components/dashboard/mentor/students/StudentsListView';
import { StudentsPerformanceView } from '@/components/dashboard/mentor/students/StudentsPerformanceView';
import { NewMentorshipRequests } from '@/components/dashboard/mentor/students/NewMentorshipRequests';

export default function MyStudentsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'performance'>('grid');
  const [filterStatus, setFilterStatus] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent_activity');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

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

  return (
    <MentorDashboardLayout currentPage="students">
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
                <p className="text-gray-600 mt-1">Manage and track your mentees' progress</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">23</span> Active Students
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">5</span> Pending Requests
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Toolbar */}
          <StudentsToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* New Mentorship Requests */}
          {filterStatus === 'new_requests' && (
            <div className="mb-8">
              <NewMentorshipRequests />
            </div>
          )}

          {/* Students Content */}
          <div className="mt-6">
            {viewMode === 'grid' && (
              <StudentsGridView
                filterStatus={filterStatus}
                searchQuery={searchQuery}
                sortBy={sortBy}
                onStudentSelect={setSelectedStudent}
              />
            )}
            {viewMode === 'list' && (
              <StudentsListView
                students={[]} // Will be populated with actual data
                onStudentSelect={setSelectedStudent}
                selectedStudent={selectedStudent}
              />
            )}
            {viewMode === 'performance' && (
              <StudentsPerformanceView
                filterStatus={filterStatus}
                searchQuery={searchQuery}
                sortBy={sortBy}
              />
            )}
          </div>
        </div>
      </div>
    </MentorDashboardLayout>
  );
}