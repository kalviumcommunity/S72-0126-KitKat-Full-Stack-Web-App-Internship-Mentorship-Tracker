// My Students Page
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
import { StudentDetailModal } from '@/components/dashboard/mentor/students/StudentDetailModal';

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

  const handleViewModeChange = (mode: 'grid' | 'list' | 'performance') => {
    setViewMode(mode);
  };

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  return (
    <MentorDashboardLayout currentPage="students">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
                <p className="text-gray-600 mt-1">Manage and track your mentees' progress</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  8 Active Students • 3 New Requests
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* New Mentorship Requests */}
          <NewMentorshipRequests />

          {/* Toolbar */}
          <div className="mt-8">
            <StudentsToolbar
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Students Content */}
          <div className="mt-6">
            {viewMode === 'grid' && (
              <StudentsGridView
                filterStatus={filterStatus}
                searchQuery={searchQuery}
                sortBy={sortBy}
                onStudentSelect={handleStudentSelect}
              />
            )}
            {viewMode === 'list' && (
              <StudentsListView
                filterStatus={filterStatus}
                searchQuery={searchQuery}
                sortBy={sortBy}
                onStudentSelect={handleStudentSelect}
              />
            )}
            {viewMode === 'performance' && (
              <StudentsPerformanceView
                filterStatus={filterStatus}
                searchQuery={searchQuery}
                sortBy={sortBy}
                onStudentSelect={handleStudentSelect}
              />
            )}
          </div>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </MentorDashboardLayout>
  );
}