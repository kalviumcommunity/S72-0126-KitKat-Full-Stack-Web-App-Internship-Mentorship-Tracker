// Feedback List Component - Server Component
// Displays a list of feedback items with filtering

import { FeedbackCard } from './FeedbackCard';
import { FeedbackFilters } from './FeedbackFilters';
import { EmptyFeedbackState } from './EmptyFeedbackState';
import type { FeedbackWithRelations, FeedbackFilters as FilterType } from '@/lib/types';

interface FeedbackListProps {
  feedback: FeedbackWithRelations[];
  currentFilters?: FilterType;
  showApplications?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function FeedbackList({ 
  feedback,
  currentFilters,
  showApplications = true,
  showActions = true,
  emptyMessage,
  emptyDescription
}: FeedbackListProps) {
  const hasFilters = currentFilters && Object.keys(currentFilters).some(
    key => currentFilters[key as keyof FilterType]
  );

  if (feedback.length === 0) {
    return (
      <EmptyFeedbackState 
        hasFilters={hasFilters}
        message={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <FeedbackCard
          key={item.id}
          feedback={item}
          showApplication={showApplications}
          showActions={showActions}
        />
      ))}
    </div>
  );
}