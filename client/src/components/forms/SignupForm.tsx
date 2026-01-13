// Signup Form - Client Component
// Handles user registration with validation

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { USER_ROLE_OPTIONS } from '@/lib/constants';

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
      role: 'STUDENT' as const,
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
        role: values.role,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-600">{submitSuccess}</p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          required
          autoComplete="given-name"
          disabled={isLoading}
          {...getFieldProps('firstName')}
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          required
          autoComplete="family-name"
          disabled={isLoading}
          {...getFieldProps('lastName')}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        autoComplete="email"
        disabled={isLoading}
        {...getFieldProps('email')}
      />

      <Select
        label="Role"
        required
        disabled={isLoading}
        options={USER_ROLE_OPTIONS}
        {...getFieldProps('role')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        required
        autoComplete="new-password"
        disabled={isLoading}
        helperText="Must be at least 8 characters with uppercase, lowercase, and number"
        {...getFieldProps('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        required
        autoComplete="new-password"
        disabled={isLoading}
        {...getFieldProps('confirmPassword')}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !validation.isValid}
        loading={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}