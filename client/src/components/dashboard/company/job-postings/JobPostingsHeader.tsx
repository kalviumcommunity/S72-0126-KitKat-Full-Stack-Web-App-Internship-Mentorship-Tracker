// Job Postings Header Component
// Header with create job button and stats

'use client';

import { Button } from '@/components/ui/Button';

interface JobPostingsHeaderProps {
  onCreateJob: () => void;
}

export function JobPostingsHeader({ onCreateJob }: JobPostingsHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
            <p className="text-gray-600 mt-1">Manage your job postings and track applications</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button onClick={onCreateJob} size="lg">
              + Create New Posting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}