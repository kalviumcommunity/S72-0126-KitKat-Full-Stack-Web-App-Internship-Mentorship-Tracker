// Login Form - Client Component
// Handles user authentication with validation

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { auth } from '@/lib/api';
import { getValidationErrors } from '@/lib/validations';

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
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
      const validatedData = loginSchema.parse(formData);
      
      // Call login API
      const response = await auth.login(validatedData);
      
      if (response.success && response.data) {
        // Redirect based on user role
        const userRole = response.data.user.role;
        switch (userRole) {
          case 'STUDENT':
            router.push('/student');
            break;
          case 'MENTOR':
            router.push('/mentor');
            break;
          case 'ADMIN':
            router.push('/admin');
            break;
          default:
            router.push('/');
        }
      } else {
        setGeneralError(response.error || 'Login failed. Please try again.');
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

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        placeholder="Enter your password"
        required
        autoComplete="current-password"
        disabled={isLoading}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}