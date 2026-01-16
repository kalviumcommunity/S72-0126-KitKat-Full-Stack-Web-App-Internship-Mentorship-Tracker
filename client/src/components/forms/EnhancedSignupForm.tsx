// Enhanced Signup Form - Client Component with advanced validation
// Demonstrates comprehensive form validation with real-time feedback

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { ValidationIndicator } from '@/components/ui/ValidationIndicator';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { useFormValidation } from '@/hooks/useFormValidation';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { auth } from '@/lib/api';
import { USER_ROLE_OPTIONS } from '@/lib/constants';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';

export function EnhancedSignupForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const {
    values,
    validation,
    setValue,
    validateForm,
    resetForm,
    getFieldProps,
  } = useFormValidation({
    schema: signupSchema,
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: UserRole.STUDENT as const,
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const isValid = await validateForm();
      
      if (!isValid) {
        setSubmitError('Please fix the validation errors before submitting.');
        return;
      }

      const response = await auth.signup(values);
      
      if (response.success) {
        setSubmitSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login?message=Account created successfully! Please sign in.');
        }, 2000);
      } else {
        setSubmitError(response.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    resetForm();
    setSubmitError('');
    setSubmitSuccess('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submit Status Messages */}
      {submitError && (
        <FormField error={submitError}>
          <div />
        </FormField>
      )}

      {submitSuccess && (
        <FormField success={submitSuccess}>
          <div />
        </FormField>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FormField 
          error={getFieldProps('firstName').error}
          success={getFieldProps('firstName').touched && !getFieldProps('firstName').error ? 'Valid' : undefined}
        >
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            required
            disabled={isSubmitting}
            {...getFieldProps('firstName')}
          />
        </FormField>

        <FormField 
          error={getFieldProps('lastName').error}
          success={getFieldProps('lastName').touched && !getFieldProps('lastName').error ? 'Valid' : undefined}
        >
          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            required
            disabled={isSubmitting}
            {...getFieldProps('lastName')}
          />
        </FormField>
      </div>

      {/* Email Field */}
      <FormField 
        error={getFieldProps('email').error}
        success={getFieldProps('email').touched && !getFieldProps('email').error ? 'Valid email address' : undefined}
      >
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isSubmitting}
          {...getFieldProps('email')}
          endIcon={
            <ValidationIndicator
              status={
                validation.isValidating ? 'validating' :
                getFieldProps('email').error ? 'invalid' :
                getFieldProps('email').touched && !getFieldProps('email').error ? 'valid' :
                'idle'
              }
            />
          }
        />
      </FormField>

      {/* Role Selection */}
      <FormField 
        error={getFieldProps('role').error}
        helperText="Choose your role in the platform"
      >
        <Select
          label="Role"
          required
          disabled={isSubmitting}
          options={USER_ROLE_OPTIONS}
          {...getFieldProps('role')}
        />
      </FormField>

      {/* Password Field */}
      <FormField 
        error={getFieldProps('password').error}
        helperText="Password must meet the requirements below"
      >
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          required
          disabled={isSubmitting}
          {...getFieldProps('password')}
          endIcon={
            <ValidationIndicator
              status={
                validation.isValidating ? 'validating' :
                getFieldProps('password').error ? 'invalid' :
                getFieldProps('password').touched && !getFieldProps('password').error ? 'valid' :
                'idle'
              }
            />
          }
        />
        
        {/* Password Strength Indicator */}
        {values.password && (
          <PasswordStrengthIndicator 
            password={values.password}
            showRequirements={true}
          />
        )}
      </FormField>

      {/* Confirm Password Field */}
      <FormField 
        error={getFieldProps('confirmPassword').error}
        success={
          getFieldProps('confirmPassword').touched && 
          !getFieldProps('confirmPassword').error && 
          values.confirmPassword ? 'Passwords match' : undefined
        }
      >
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
          disabled={isSubmitting}
          {...getFieldProps('confirmPassword')}
          endIcon={
            <ValidationIndicator
              status={
                validation.isValidating ? 'validating' :
                getFieldProps('confirmPassword').error ? 'invalid' :
                getFieldProps('confirmPassword').touched && !getFieldProps('confirmPassword').error && values.confirmPassword ? 'valid' :
                'idle'
              }
            />
          }
        />
      </FormField>

      {/* Form Actions */}
      <div className="flex items-center justify-between space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting || !validation.isDirty}
        >
          Reset Form
        </Button>
        
        <div className="flex items-center space-x-4">
          {/* Form Validation Status */}
          <ValidationIndicator
            status={
              validation.isValidating ? 'validating' :
              validation.isValid ? 'valid' :
              Object.keys(validation.errors).length > 0 ? 'invalid' :
              'idle'
            }
            message={
              validation.isValidating ? 'Validating...' :
              validation.isValid ? 'Form is valid' :
              Object.keys(validation.errors).length > 0 ? `${Object.keys(validation.errors).length} error(s)` :
              undefined
            }
          />
          
          <Button
            type="submit"
            disabled={isSubmitting || !validation.isValid}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </div>

      {/* Form Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-50 rounded-md">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Debug Info (Development Only)
          </summary>
          <div className="mt-2 space-y-2 text-xs">
            <div>
              <strong>Form Valid:</strong> {validation.isValid ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Form Dirty:</strong> {validation.isDirty ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Validating:</strong> {validation.isValidating ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Errors:</strong> {JSON.stringify(validation.errors, null, 2)}
            </div>
            <div>
              <strong>Touched:</strong> {JSON.stringify(validation.touched, null, 2)}
            </div>
          </div>
        </details>
      )}
    </form>
  );
}
