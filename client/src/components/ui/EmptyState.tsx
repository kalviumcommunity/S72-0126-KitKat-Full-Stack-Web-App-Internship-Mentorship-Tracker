// Empty State Component
// Reusable empty state display component

import Link from 'next/link';
import { Button } from './Button';
import { Card, CardContent } from './Card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = '📭',
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

        <div className="flex items-center justify-center space-x-3">
          {(actionLabel && (actionHref || onAction)) && (
            <>
              {actionHref ? (
                <Link href={actionHref}>
                  <Button>{actionLabel}</Button>
                </Link>
              ) : (
                <Button onClick={onAction}>{actionLabel}</Button>
              )}
            </>
          )}

          {(secondaryActionLabel && (secondaryActionHref || onSecondaryAction)) && (
            <>
              {secondaryActionHref ? (
                <Link href={secondaryActionHref}>
                  <Button variant="outline">{secondaryActionLabel}</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={onSecondaryAction}>
                  {secondaryActionLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specific empty state variants
export function NoApplicationsState() {
  return (
    <EmptyState
      title="No applications yet"
      description="Start tracking your internship applications by creating your first application."
      icon="📋"
      actionLabel="Create Application"
      actionHref="/student/applications/new"
    />
  );
}

export function NoFeedbackState() {
  return (
    <EmptyState
      title="No feedback yet"
      description="Your mentors haven't provided any feedback yet. Check back later or reach out to your mentors."
      icon="💬"
      actionLabel="View Applications"
      actionHref="/student/applications"
    />
  );
}

export function NoNotificationsState() {
  return (
    <EmptyState
      title="No notifications"
      description="You're all caught up! You'll receive notifications about feedback, application updates, and more."
      icon="🔔"
      actionLabel="View Applications"
      actionHref="/student/applications"
    />
  );
}

export function NoSearchResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description="We couldn't find any results matching your search. Try adjusting your filters or search terms."
      icon="🔍"
      actionLabel="Clear Filters"
      onAction={onClear}
    />
  );
}

export function NoStudentsState() {
  return (
    <EmptyState
      title="No students assigned"
      description="You don't have any students assigned to you yet. Contact your administrator for student assignments."
      icon="👥"
    />
  );
}

export function NoMentorsState() {
  return (
    <EmptyState
      title="No mentors assigned"
      description="You don't have any mentors assigned yet. Your mentors will help guide you through your internship applications."
      icon="👨‍🏫"
    />
  );
}