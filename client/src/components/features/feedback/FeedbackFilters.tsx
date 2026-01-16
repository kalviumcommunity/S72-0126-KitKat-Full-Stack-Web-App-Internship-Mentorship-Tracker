'use client';

// Feedback Filters Component - Client Component
// Provides filtering options for feedback list

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { FeedbackTag, FeedbackPriority, type FeedbackFilters as FilterType } from '@/lib/types';

interface FeedbackFiltersProps {
  currentFilters?: FilterType;
}

const tagOptions = [
  { value: FeedbackTag.RESUME, label: 'Resume' },
  { value: FeedbackTag.DSA, label: 'DSA' },
  { value: FeedbackTag.SYSTEM_DESIGN, label: 'System Design' },
  { value: FeedbackTag.COMMUNICATION, label: 'Communication' },
];

const priorityOptions = [
  { value: FeedbackPriority.HIGH, label: 'High Priority' },
  { value: FeedbackPriority.MEDIUM, label: 'Medium Priority' },
  { value: FeedbackPriority.LOW, label: 'Low Priority' },
];

export function FeedbackFilters({ currentFilters }: FeedbackFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentFilters?.tags?.map(String) || []
  );
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    currentFilters?.priority?.map(String) || []
  );

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing filter params
    params.delete('tags');
    params.delete('priority');
    params.delete('page');
    
    // Add new filter params
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    }
    if (selectedPriorities.length > 0) {
      params.set('priority', selectedPriorities.join(','));
    }
    
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedPriorities([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tags');
    params.delete('priority');
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedPriorities.length > 0;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => toggleTag(tag.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    selectedTags.includes(tag.value)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => togglePriority(priority.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    selectedPriorities.includes(priority.value)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-2">
            <Button 
              onClick={handleApplyFilters}
              className="w-full"
              disabled={!hasActiveFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}