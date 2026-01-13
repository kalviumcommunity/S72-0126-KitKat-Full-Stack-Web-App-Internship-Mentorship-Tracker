// FormField component - Enhanced form field with validation states
// Provides comprehensive validation feedback and accessibility

'use client';

import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface FormFieldProps {
  children: ReactNode;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  className?: string;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, error, success, warning, helperText, className, ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;
    const hasWarning = !!warning;
    const hasMessage = hasError || hasSuccess || hasWarning || !!helperText;

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
        
        {hasMessage && (
          <div className="space-y-1">
            {hasError && (
              <div className="flex items-center space-x-2 text-sm text-red-600">
                <span className="text-red-500">❌</span>
                <span>{error}</span>
              </div>
            )}
            
            {hasSuccess && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <span className="text-green-500">✅</span>
                <span>{success}</span>
              </div>
            )}
            
            {hasWarning && (
              <div className="flex items-center space-x-2 text-sm text-yellow-600">
                <span className="text-yellow-500">⚠️</span>
                <span>{warning}</span>
              </div>
            )}
            
            {helperText && !hasError && !hasSuccess && !hasWarning && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };