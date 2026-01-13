// Validation Indicator component - Visual feedback for form validation
// Shows real-time validation status with icons and colors

'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface ValidationIndicatorProps {
  status: 'idle' | 'validating' | 'valid' | 'invalid';
  message?: string;
  className?: string;
  children?: ReactNode;
}

const ValidationIndicator = ({ 
  status, 
  message, 
  className, 
  children 
}: ValidationIndicatorProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'validating':
        return (
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
        );
      case 'valid':
        return <span className="text-green-500 text-sm">✅</span>;
      case 'invalid':
        return <span className="text-red-500 text-sm">❌</span>;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'validating':
        return 'text-blue-600';
      case 'valid':
        return 'text-green-600';
      case 'invalid':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  if (status === 'idle' && !message && !children) {
    return null;
  }

  return (
    <div className={cn('flex items-center space-x-2 text-sm', getStatusColor(), className)}>
      {getStatusIcon()}
      {message && <span>{message}</span>}
      {children}
    </div>
  );
};

export { ValidationIndicator };