// Signup Form - Client Component
// Handles user registration with validation

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { auth } from '@/lib/api';
import { getValidationErrors } from '@/lib/validations';
import { USER_ROLE_OPTIONS } from '@/lib/constants';

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT' as any,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError('');
    setErrors({});

    try {
      // Validate form data
      const validatedData = signupSchema.parse(formData);
      
      // Call signup API
      const response = await auth.signup(validatedData);
      
      if (response.success && response.data) {
        // Redirect to login with success message
        router.push('/login?message=Account created successfully! Please sign in.');
      } else {
        setGeneralError(response.error || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      if (error.name === 'ZodError') {
        setErrors(getValidationErrors(error));
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={handleInputChange('firstName')}
          error={errors.firstName}
          placeholder="Enter your first name"
          required
          autoComplete="given-name"
          disabled={isLoading}
        />

        <Input
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={handleInputChange('lastName')}
          error={errors.lastName}
          placeholder="Enter your last name"
          required
          autoComplete="family-name"
          disabled={isLoading}
        />
      </div>

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={errors.email}
        placeholder="Enter your email"
        required
        autoComplete="email"
        disabled={isLoading}
      />

      <Select
        label="Role"
        value={formData.role}
        onChange={handleInputChange('role')}
        error={errors.role}
        options={USER_ROLE_OPTIONS}
        required
        disabled={isLoading}
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        placeholder="Create a password"
        required
        autoComplete="new-password"
        disabled={isLoading}
        helperText="Must be at least 8 characters with uppercase, lowercase, and number"
      />

      <Input
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange('confirmPassword')}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        required
        autoComplete="new-password"
        disabled={isLoading}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}