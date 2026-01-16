// Error State Component
// Reusable error display component

import { Button } from './Button';
import { Card, CardContent } from './Card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  showDetails?: boolean;
  icon?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  error,
  onRetry,
  onGoBack,
  showDetails = false,
  icon = '⚠️',
}: ErrorStateProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-12 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {showDetails && error && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded overflow-auto max-h-40">
              {error}
            </pre>
          </details>
        )}

        <div className="flex items-center justify-center space-x-3">
          {onRetry && (
            <Button onClick={onRetry}>Try Again</Button>
          )}
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              Go Back
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specific error state variants
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      icon="🌐"
      onRetry={onRetry}
    />
  );
}

export function NotFoundErrorState({ onGoBack }: { onGoBack?: () => void }) {
  return (
    <ErrorState
      title="Not Found"
      message="The page or resource you're looking for doesn't exist or has been moved."
      icon="🔍"
      onGoBack={onGoBack}
    />
  );
}

export function UnauthorizedErrorState({ onGoBack }: { onGoBack?: () => void }) {
  return (
    <ErrorState
      title="Unauthorized"
      message="You don't have permission to access this resource. Please log in or contact your administrator."
      icon="🔒"
      onGoBack={onGoBack}
    />
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Server Error"
      message="The server encountered an error. Our team has been notified. Please try again later."
      icon="🔧"
      onRetry={onRetry}
    />
  );
}