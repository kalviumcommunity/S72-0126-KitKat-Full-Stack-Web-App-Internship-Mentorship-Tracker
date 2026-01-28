// Job Postings Page
// Manage all job postings - create, edit, view applications

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { CompanyDashboardLayout } from '@/components/dashboard/company/CompanyDashboardLayout';
import { JobPostingsHeader } from '@/components/dashboard/company/job-postings/JobPostingsHeader';
import { JobPostingsFilters } from '@/components/dashboard/company/job-postings/JobPostingsFilters';
import { JobPostingsList } from '@/components/dashboard/company/job-postings/JobPostingsList';
import { CreateJobModal } from '@/components/dashboard/company/job-postings/CreateJobModal';

export default function JobPostingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    <CompanyDashboardLayout currentPage="job-postings">
      <div className="min-h-screen bg-gray-50">
        <JobPostingsHeader onCreateJob={() => setShowCreateModal(true)} />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <JobPostingsFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          <JobPostingsList
            activeTab={activeTab}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </div>

        {showCreateModal && (
          <CreateJobModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    </CompanyDashboardLayout>
  );
}