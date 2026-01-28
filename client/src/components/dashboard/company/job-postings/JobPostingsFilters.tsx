// Job Postings Filters Component
// Tabs, search, and sorting controls

'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface JobPostingsFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function JobPostingsFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}: JobPostingsFiltersProps) {
  const tabs = [
    { id: 'active', label: 'Active', count: 8 },
    { id: 'draft', label: 'Draft', count: 2 },
    { id: 'closed', label: 'Closed', count: 15 },
    { id: 'templates', label: 'Templates', count: 5 }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'applications', label: 'Most Applications' },
    { value: 'expiring', label: 'Expiring Soon' },
    { value: 'views', label: 'Most Views' }
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center space-x-2"
          >
            <span>{tab.label}</span>
            <Badge variant="secondary" size="sm">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search job postings..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}