// Loading Spinner component - Server/Client Component
// Provides loading feedback with customizable size and message

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ 
    className, 
    size = 'md', 
    message, 
    fullScreen = false,
    ...props 
  }, ref) => {
    const spinnerSizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const containerClasses = fullScreen
      ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
      : 'flex items-center justify-center p-4';

    return (
      <div
        ref={ref}
        className={cn(containerClasses, className)}
        {...props}
      >
        <div className="flex flex-col items-center space-y-3">
          {/* Spinner */}
          <div
            className={cn(
              'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
              spinnerSizes[size]
            )}
          />
          
          {/* Message */}
          {message && (
            <p className={cn('text-gray-600 text-center', textSizes[size])}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// Convenience components for common use cases
export function PageLoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return <LoadingSpinner size="lg" message={message} fullScreen />;
}

export function ComponentLoadingSpinner({ message }: { message?: string }) {
  return <LoadingSpinner size="md" message={message} />;
}

export function ButtonLoadingSpinner() {
  return <LoadingSpinner size="sm" className="p-0" />;
}

export { LoadingSpinner };