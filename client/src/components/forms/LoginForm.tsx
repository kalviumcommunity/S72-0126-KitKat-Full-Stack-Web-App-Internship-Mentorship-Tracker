// Login Form - Client Component
// Handles user authentication with validation

'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { loginSchema, type LoginFormData } from '@/lib/validations';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState('');
  
  // Get success message from URL params (e.g., after signup)
  const successMessage = searchParams.get('message');

  const {
    values,
    validation,
    getFieldProps,
    validateForm,
  } = useFormValidation({
    schema: loginSchema,
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    try {
      const isValid = await validateForm();
      
      if (!isValid) {
        setSubmitError('Please fix the validation errors before submitting.');
        return;
      }

      const result = await login(values.email, values.password);
      
      if (!result.success) {
        setSubmitError(result.error || 'Login failed. Please try again.');
      }
      // Success case is handled by the AuthContext (redirect)
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        autoComplete="email"
        disabled={isLoading}
        {...getFieldProps('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        autoComplete="current-password"
        disabled={isLoading}
        {...getFieldProps('password')}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !validation.isValid}
        loading={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}