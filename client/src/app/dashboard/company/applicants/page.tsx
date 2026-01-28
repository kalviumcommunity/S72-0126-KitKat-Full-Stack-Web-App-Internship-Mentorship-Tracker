// Applicants Page
// View and manage all job applicants

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { CompanyDashboardLayout } from '@/components/dashboard/company/CompanyDashboardLayout';
import { ApplicantsHeader } from '@/components/dashboard/company/applicants/ApplicantsHeader';
import { ApplicantsFilters } from '@/components/dashboard/company/applicants/ApplicantsFilters';
import { ApplicantsView } from '@/components/dashboard/company/applicants/ApplicantsView';

export default function ApplicantsPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'pipeline'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    position: '',
    status: '',
    university: '',
    major: '',
    skills: '',
    rating: '',
    applicationDate: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);

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
    <CompanyDashboardLayout currentPage="applicants">
      <div className="min-h-screen bg-gray-50">
        <ApplicantsHeader 
          selectedCount={selectedApplicants.length}
          onBulkAction={(action) => console.log('Bulk action:', action)}
        />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <ApplicantsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          <ApplicantsView
            viewMode={viewMode}
            searchQuery={searchQuery}
            filters={filters}
            sortBy={sortBy}
            selectedApplicants={selectedApplicants}
            onSelectionChange={setSelectedApplicants}
          />
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}