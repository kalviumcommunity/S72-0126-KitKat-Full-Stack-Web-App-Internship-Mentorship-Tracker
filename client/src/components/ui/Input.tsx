// Input component - Client Component for form inputs
// Supports various input types with validation states

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    helperText,
    startIcon,
    endIcon,
    id,
    ...props
  }, ref) => {
    // Extract non-DOM props that shouldn't be passed to the input element
    const { touched, ...inputProps } = props as any;
    
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-slate-400 text-sm">
                {startIcon}
              </div>
            </div>
          )}

          <input
            type={type}
            id={inputId}
            ref={ref}
            className={cn(
              'block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm sm:leading-6 transition-all duration-200 bg-white',
              startIcon && 'pl-10',
              (endIcon || hasError) && 'pr-10',
              hasError && 'ring-red-300 focus:ring-red-500 text-red-900 placeholder:text-red-300',
              props.disabled && 'bg-slate-50 text-slate-500 cursor-not-allowed ring-slate-200',
              className
            )}
            suppressHydrationWarning={props.suppressHydrationWarning}
            {...inputProps}
          />

          {(endIcon || hasError) && (
            <div className={cn(
              "absolute inset-y-0 right-0 pr-3 flex items-center",
              endIcon && !hasError ? "pointer-events-auto" : "pointer-events-none"
            )}>
              {endIcon ? (
                <div className="text-gray-400 text-sm">
                  {endIcon}
                </div>
              ) : hasError ? (
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              ) : null}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={cn(
            'text-sm mt-1',
            hasError ? 'text-red-600' : 'text-slate-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };