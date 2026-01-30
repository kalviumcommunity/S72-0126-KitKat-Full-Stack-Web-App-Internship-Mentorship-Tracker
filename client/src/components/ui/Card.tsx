// Card component - Server/Client Component for content containers
// Provides consistent styling for content sections

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    padding = 'md', 
    shadow = 'sm', 
    border = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-3xl',
          // Padding variants
          padding === 'none' && 'p-0',
          padding === 'sm' && 'p-6',
          padding === 'md' && 'p-8',
          padding === 'lg' && 'p-10',
          // Shadow variants
          shadow === 'none' && 'shadow-none',
          shadow === 'sm' && 'shadow-sm shadow-slate-900/5',
          shadow === 'md' && 'shadow-md shadow-slate-900/10',
          shadow === 'lg' && 'shadow-lg shadow-slate-900/15',
          // Border
          border && 'border border-slate-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between pb-6 border-b border-slate-100',
          className
        )}
        {...props}
      >
        <div className="space-y-2">
          {title && (
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-600 leading-relaxed">{subtitle}</p>
          )}
          {children}
        </div>
        {action && <div className="ml-6">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Content Component
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pt-6', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end space-x-3 pt-6 border-t border-slate-100',
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };