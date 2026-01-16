// Badge component - Server/Client Component for status indicators
// Displays status, priority, and tag information

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    dot = false,
    children,
    ...props 
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          // Size variants
          size === 'sm' && 'px-2 py-1 text-xs',
          size === 'md' && 'px-2.5 py-1.5 text-xs',
          size === 'lg' && 'px-3 py-2 text-sm',
          // Color variants
          variant === 'default' && 'bg-gray-100 text-gray-800',
          variant === 'success' && 'bg-green-100 text-green-800',
          variant === 'warning' && 'bg-yellow-100 text-yellow-800',
          variant === 'error' && 'bg-red-100 text-red-800',
          variant === 'info' && 'bg-blue-100 text-blue-800',
          variant === 'neutral' && 'bg-gray-100 text-gray-600',
          variant === 'outline' && 'border border-gray-300 bg-transparent text-gray-700',
          variant === 'destructive' && 'bg-red-600 text-white',
          variant === 'secondary' && 'bg-gray-200 text-gray-900',
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full mr-1.5',
              variant === 'default' && 'bg-gray-400',
              variant === 'success' && 'bg-green-400',
              variant === 'warning' && 'bg-yellow-400',
              variant === 'error' && 'bg-red-400',
              variant === 'info' && 'bg-blue-400',
              variant === 'neutral' && 'bg-gray-400',
              variant === 'outline' && 'bg-gray-400',
              variant === 'destructive' && 'bg-white',
              variant === 'secondary' && 'bg-gray-600'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };