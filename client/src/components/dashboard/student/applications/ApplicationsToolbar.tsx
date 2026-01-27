// Applications Toolbar Component
// Search, filters, sorting, view toggle, and bulk actions

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ViewMode, SortOption, ApplicationFilters } from '@/app/dashboard/user/applications/page';

interface ApplicationsToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function ApplicationsToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
  selectedCount,
  onBulkAction
}: ApplicationsToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'
  ];

  const companyOptions = [
    'Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Netflix', 'Tesla', 'Stripe'
  ];

  const positionOptions = [
    'Software Engineer', 'Product Manager', 'Data Scientist', 'Designer', 'Marketing'
  ];

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value
    });
  };

  const handleFilterChange = (type: keyof ApplicationFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [type]: value
    });
  };

  const toggleFilter = (type: 'status' | 'company' | 'position', value: string) => {
    const currentValues = filters[type] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(type, newValues);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      company: [],
      position: [],
      dateRange: null
    });
  };

  const activeFiltersCount = 
    filters.status.length + 
    filters.company.length + 
    filters.position.length + 
    (filters.dateRange ? 1 : 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Top Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Side - Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <span className="mr-2">🔍</span>
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white" size="sm">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="company">Company Name</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Right Side - View Toggle and Add Button */}
        <div className="flex items-center space-x-4">
          {/* Bulk Actions (when items selected) */}
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('move')}
              >
                Move to Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export')}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('archive')}
              >
                Archive
              </Button>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className="px-3 py-1"
            >
              📋 List
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('kanban')}
              className="px-3 py-1"
            >
              📊 Kanban
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('calendar')}
              className="px-3 py-1"
            >
              📅 Calendar
            </Button>
          </div>

          {/* Add Application Button */}
          <Button className="bg-blue-600 hover:bg-blue-700">
            <span className="mr-2">➕</span>
            Add Application
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('status', status)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.status.includes(status)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <div className="flex flex-wrap gap-2">
                {companyOptions.map((company) => (
                  <button
                    key={company}
                    onClick={() => toggleFilter('company', company)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.company.includes(company)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <div className="flex flex-wrap gap-2">
                {positionOptions.map((position) => (
                  <button
                    key={position}
                    onClick={() => toggleFilter('position', position)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.position.includes(position)
                        ? 'bg-purple-100 border-purple-300 text-purple-800'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}