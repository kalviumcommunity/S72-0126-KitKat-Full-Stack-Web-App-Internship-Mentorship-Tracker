// Application Filters component - Client Component
// Provides filtering and search functionality for applications

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { APPLICATION_STATUS_OPTIONS, APPLICATION_PLATFORM_OPTIONS } from '@/lib/constants';
import type { ApplicationFilters as FilterType } from '@/lib/types';

interface ApplicationFiltersProps {
  currentFilters: FilterType;
}

export function ApplicationFilters({ currentFilters }: ApplicationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    status: currentFilters.status?.join(',') || '',
    platform: currentFilters.platform?.join(',') || '',
    company: currentFilters.company || '',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Update local state when URL changes
  useEffect(() => {
    setFilters({
      status: currentFilters.status?.join(',') || '',
      platform: currentFilters.platform?.join(',') || '',
      company: currentFilters.company || '',
    });
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Update or remove filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to first page when filters change
    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      platform: '',
      company: '',
    });

    // Clear all filter parameters from URL
    const params = new URLSearchParams(searchParams);
    params.delete('status');
    params.delete('platform');
    params.delete('company');
    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = Object.values(filters).some(value => value);
  const activeFilterCount = Object.values(filters).filter(value => value).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>Filters</span>
                <span className="text-gray-400">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </button>
              
              {activeFilterCount > 0 && (
                <Badge variant="info" size="sm">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Quick Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search companies..."
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
              />
            </div>
            <Button onClick={applyFilters}>
              Search
            </Button>
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  placeholder="All statuses"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  options={[
                    { value: '', label: 'All Statuses' },
                    ...APPLICATION_STATUS_OPTIONS,
                    // Multiple selection options
                    { value: 'APPLIED,SHORTLISTED,INTERVIEW', label: 'In Progress' },
                    { value: 'OFFER,REJECTED', label: 'Completed' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <Select
                  placeholder="All platforms"
                  value={filters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  options={[
                    { value: '', label: 'All Platforms' },
                    ...APPLICATION_PLATFORM_OPTIONS,
                  ]}
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {filters.company && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span>Company: {filters.company}</span>
                  <button
                    onClick={() => handleFilterChange('company', '')}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.status && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span>Status: {filters.status.split(',').join(', ')}</span>
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {filters.platform && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span>Platform: {filters.platform}</span>
                  <button
                    onClick={() => handleFilterChange('platform', '')}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}