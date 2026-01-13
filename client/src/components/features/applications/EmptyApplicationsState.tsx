// Empty Applications State component - Server Component
// Displays empty state when no applications are found

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface EmptyApplicationsStateProps {
  hasFilters?: boolean;
}

export function EmptyApplicationsState({ hasFilters = false }: EmptyApplicationsStateProps) {
  if (hasFilters) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No applications match your filters
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or clearing the filters to see more results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // Clear filters by reloading without search params
                window.location.href = window.location.pathname;
              }}
            >
              Clear Filters
            </Button>
            <Link href="/student/applications/new">
              <Button>Add New Application</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No applications yet
        </h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first internship application. Track your progress, 
          receive feedback from mentors, and manage your application pipeline.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/student/applications/new">
            <Button>Create Your First Application</Button>
          </Link>
          <Button variant="outline">
            Learn More
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-lg p-6 text-left max-w-md mx-auto">
          <h4 className="text-sm font-medium text-blue-900 mb-3">
            💡 Getting Started Tips:
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Start with companies you're most interested in</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Keep track of application deadlines</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Upload your resume for each application</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Add notes about your application strategy</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}