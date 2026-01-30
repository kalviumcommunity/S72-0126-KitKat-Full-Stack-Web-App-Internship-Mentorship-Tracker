// Login Form - Client Component
// Handles user authentication with validation

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  
  // Get success message from URL params (e.g., after signup)
  const successMessage = searchParams.get('message');

  // Listen for quick fill events
  useEffect(() => {
    const handleQuickFill = (event: CustomEvent) => {
      const { email: fillEmail, password: fillPassword } = event.detail;
      setEmail(fillEmail);
      setPassword(fillPassword);
      setFieldErrors({}); // Clear any existing errors
    };

    window.addEventListener('quickFillCredentials', handleQuickFill as EventListener);
    
    return () => {
      window.removeEventListener('quickFillCredentials', handleQuickFill as EventListener);
    };
  }, []);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setSubmitError(result.error || 'Login failed. Please try again.');
      }
      // Success case is handled by the AuthContext (redirect)
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-emerald-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="Email address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
            error={fieldErrors.email}
            disabled={isLoading}
            autoComplete="email"
            className="h-12 text-base"
            suppressHydrationWarning
          />
        </div>

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors(prev => ({ ...prev, password: undefined }));
              }
            }}
            error={fieldErrors.password}
            disabled={isLoading}
            autoComplete="current-password"
            className="h-12 text-base"
            suppressHydrationWarning
            endIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-slate-400 hover:text-slate-600 focus:outline-none pointer-events-auto transition-colors"
                tabIndex={-1}
                suppressHydrationWarning
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
    </div>
  );
}