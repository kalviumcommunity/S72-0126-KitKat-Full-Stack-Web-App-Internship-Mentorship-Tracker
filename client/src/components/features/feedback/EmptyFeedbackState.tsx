// Empty Feedback State Component
// Displays when no feedback is available

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface EmptyFeedbackStateProps {
  hasFilters?: boolean;
  message?: string;
  description?: string;
}

export function EmptyFeedbackState({ 
  hasFilters = false,
  message,
  description
}: EmptyFeedbackStateProps) {
  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No feedback found
        </h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters to see more results
        </p>
        <Button variant="outline">
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">💬</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message || 'No feedback yet'}
      </h3>
      <p className="text-gray-600 mb-6">
        {description || 'Your mentors haven\'t provided any feedback yet. Check back later or reach out to your mentors.'}
      </p>
      <Link href="/student/applications">
        <Button variant="outline">
          View Applications
        </Button>
      </Link>
    </div>
  );
}