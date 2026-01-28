// Applicants Filters Component
// Search, filters, and view controls

'use client';

import { Button } from '@/components/ui/Button';

interface ApplicantsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    position: string;
    status: string;
    university: string;
    major: string;
    skills: string;
    rating: string;
    applicationDate: string;
  };
  onFiltersChange: (filters: any) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'cards' | 'table' | 'pipeline';
  onViewModeChange: (mode: 'cards' | 'table' | 'pipeline') => void;
}

export function ApplicantsFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: ApplicantsFiltersProps) {
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'match', label: 'Best Match' },
    { value: 'rating', label: 'Rating' },
    { value: 'university', label: 'University' },
    { value: 'name', label: 'Name' }
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, university, skills..."
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

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <select
          value={filters.position}
          onChange={(e) => onFiltersChange({...filters, position: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Positions</option>
          <option value="software-intern">Software Engineering Intern</option>
          <option value="product-intern">Product Management Intern</option>
          <option value="data-intern">Data Science Intern</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({...filters, status: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="reviewing">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.university}
          onChange={(e) => onFiltersChange({...filters, university: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Universities</option>
          <option value="stanford">Stanford University</option>
          <option value="mit">MIT</option>
          <option value="berkeley">UC Berkeley</option>
          <option value="cmu">Carnegie Mellon</option>
        </select>

        <select
          value={filters.major}
          onChange={(e) => onFiltersChange({...filters, major: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Majors</option>
          <option value="cs">Computer Science</option>
          <option value="ee">Electrical Engineering</option>
          <option value="business">Business</option>
          <option value="data">Data Science</option>
        </select>

        <input
          type="text"
          placeholder="Skills"
          value={filters.skills}
          onChange={(e) => onFiltersChange({...filters, skills: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <select
          value={filters.rating}
          onChange={(e) => onFiltersChange({...filters, rating: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>

        <input
          type="date"
          value={filters.applicationDate}
          onChange={(e) => onFiltersChange({...filters, applicationDate: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* View Mode */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('cards')}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'pipeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('pipeline')}
          >
            Pipeline
          </Button>
        </div>

        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>
    </div>
  );
}