'use client';

// Application Create Form Component - Client Component
// Form for creating new applications with validation

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { z } from 'zod';
import { ApplicationPlatform, ApplicationStatus } from '@/lib/types';

const applicationCreateSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  platform: z.nativeEnum(ApplicationPlatform),
  status: z.nativeEnum(ApplicationStatus),
  deadline: z.string().optional(),
  notes: z.string().optional(),
});
import { applications } from '@/lib/api';

interface ApplicationCreateData {
  company: string;
  role: string;
  platform: ApplicationPlatform | '';
  status: ApplicationStatus | '';
  notes: string;
  deadline: string;
  appliedDate: string;
}

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
];

const platformOptions = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'COMPANY_WEBSITE', label: 'Company Website' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'JOB_BOARD', label: 'Job Board' },
  { value: 'CAREER_FAIR', label: 'Career Fair' },
  { value: 'OTHER', label: 'Other' },
];

export function ApplicationCreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialData = {
    company: '',
    role: '',
    platform: ApplicationPlatform.COMPANY_WEBSITE,
    status: ApplicationStatus.DRAFT,
    notes: '',
    deadline: '',
  };

  const validationRules = {
    company: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    role: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    platform: {
      required: true,
    },
    status: {
      required: true,
    },
    notes: {
      maxLength: 1000,
    },
    deadline: {
      validate: (value: string) => {
        if (value && new Date(value) < new Date()) {
          return 'Deadline cannot be in the past';
        }
        return null;
      },
    },
    appliedDate: {
      validate: (value: string) => {
        if (value && new Date(value) > new Date()) {
          return 'Applied date cannot be in the future';
        }
        return null;
      },
    },
  };

  const {
    values: data,
    validation: { errors, isValid },
    setValue: setFieldValue,
    getFieldProps,
    validateForm,
    resetForm,
  } = useFormValidation({
    schema: applicationCreateSchema,
    initialValues: initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFormValid = await validateForm();
    if (!isFormValid) return;
    
    await onSubmit(data);
  };

  const onSubmit = async (formData: typeof data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API
      const createData = {
        company: formData.company,
        role: formData.role,
        platform: formData.platform,
        status: formData.status,
        notes: formData.notes || undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      };

      const response = await applications.create(createData);

      if (response.success && response.data) {
        // Redirect to the new application detail page
        router.push(`/student/applications/${response.data.id}`);
      } else {
        setSubmitError(response.error || 'Failed to create application');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
      console.error('Application creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Company"
              error={errors.company}
              required
            >
              <Input
                name="company"
                value={data.company}
                onChange={handleChange}
                placeholder="e.g., Google, Microsoft, Amazon"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              label="Role"
              error={errors.role}
              required
            >
              <Input
                name="role"
                value={data.role}
                onChange={handleChange}
                placeholder="e.g., Software Engineer Intern"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              label="Platform"
              error={errors.platform}
              required
            >
              <Select
                name="platform"
                value={data.platform}
                onChange={(value) => setFieldValue('platform', value as ApplicationPlatform)}
                options={platformOptions}
                placeholder="Select application platform"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              label="Status"
              error={errors.status}
              required
            >
              <Select
                name="status"
                value={data.status}
                onChange={(value) => setFieldValue('status', value as ApplicationStatus)}
                options={statusOptions}
                placeholder="Select application status"
                disabled={isSubmitting}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Important Dates</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Applied Date"
              error={errors.appliedDate}
              helpText="When did you submit this application? (optional)"
            >
              <Input
                type="date"
                name="appliedDate"
                value={data.appliedDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField
              label="Application Deadline"
              error={errors.deadline}
              helpText="When is the application deadline? (optional)"
            >
              <Input
                type="date"
                name="deadline"
                value={data.deadline}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Notes</h2>
        </CardHeader>
        <CardContent>
          <FormField
            label="Application Notes"
            error={errors.notes}
            helpText="Add any relevant notes about this application (optional)"
          >
            <textarea
              name="notes"
              value={data.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="e.g., Applied through referral, need to complete coding challenge, interview scheduled..."
              disabled={isSubmitting}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Link href="/student/applications">
          <Button variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              setFieldValue('status', 'DRAFT');
              // Auto-save as draft functionality could be added here
            }}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Creating...' : 'Create Application'}
          </Button>
        </div>
      </div>
    </form>
  );
}