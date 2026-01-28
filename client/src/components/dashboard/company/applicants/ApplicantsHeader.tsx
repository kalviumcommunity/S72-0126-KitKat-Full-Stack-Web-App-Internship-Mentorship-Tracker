// Applicants Header Component
// Header with bulk actions and stats

'use client';

import { Button } from '@/components/ui/Button';

interface ApplicantsHeaderProps {
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function ApplicantsHeader({ selectedCount, onBulkAction }: ApplicantsHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
            <p className="text-gray-600 mt-1">Review and manage job applications</p>
          </div>
          
          {selectedCount > 0 && (
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedCount} selected
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onBulkAction('shortlist')}
              >
                Shortlist
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onBulkAction('reject')}
              >
                Reject
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onBulkAction('email')}
              >
                Send Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}