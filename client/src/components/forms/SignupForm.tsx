// Signup Form - Client Component
// Handles user registration with validation

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { UserRole } from '@/lib/types';

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const {
    values,
    validation,
    getFieldProps,
    validateForm,
    resetForm,
  } = useFormValidation({
    schema: signupSchema,
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: UserRole.STUDENT as const, // Default to STUDENT role
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const isValid = await validateForm();
      
      if (!isValid) {
        setSubmitError('Please fix the validation errors before submitting.');
        return;
      }

      const result = await signup({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: UserRole.STUDENT, // Always create as STUDENT
      });
      
      if (result.success) {
        setSubmitSuccess('Account created successfully! Redirecting to login...');
        resetForm();
        // Redirect is handled by the AuthContext
      } else {
        setSubmitError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-green-700 font-medium">{submitSuccess}</p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-red-700 font-medium">{submitError}</p>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            First Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="John"
              required
              autoComplete="given-name"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              {...getFieldProps('firstName')}
            />
          </div>
          {validation.errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{validation.errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Doe"
              required
              autoComplete="family-name"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              {...getFieldProps('lastName')}
            />
          </div>
          {validation.errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{validation.errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="john.doe@example.com"
            required
            autoComplete="email"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            {...getFieldProps('email')}
          />
        </div>
        {validation.errors.email && (
          <p className="text-xs text-red-600 mt-1">{validation.errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type="password"
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            {...getFieldProps('password')}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
        {validation.errors.password && (
          <p className="text-xs text-red-600 mt-1">{validation.errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <input
            type="password"
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            {...getFieldProps('confirmPassword')}
          />
        </div>
        {validation.errors.confirmPassword && (
          <p className="text-xs text-red-600 mt-1">{validation.errors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !validation.isValid}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Creating account...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>Create Account</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </button>

      {/* Terms and Privacy */}
      <p className="text-xs text-gray-500 text-center leading-relaxed">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
      </p>
    </form>
  );
}
