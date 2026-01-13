'use client';

// Application Edit Form Component - Client Component
// Form for editing application details with validation

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { applications } from '@/lib/api';
import type { Application, ApplicationStatus, ApplicationPlatform } from '@/lib/types';

interface ApplicationEditFormProps {
  application: Application;
}

interface ApplicationEditData {
  company: string;
  role: string;
  platform: ApplicationPlatform;
  status: ApplicationStatus;
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

export function ApplicationEditForm({ application }: ApplicationEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Convert dates for form inputs
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const initialData: ApplicationEditData = {
    company: application.company,
    role: application.role,
    platform: application.platform,
    status: application.status,
    notes: application.notes || '',
    deadline: formatDateForInput(application.deadline),
    appliedDate: formatDateForInput(application.appliedDate),
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
    data,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormValidation(initialData, validationRules);

  const onSubmit = async (formData: ApplicationEditData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API
      const updateData = {
        company: formData.company,
        role: formData.role,
        platform: formData.platform,
        status: formData.status,
        notes: formData.notes || undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        appliedDate: formData.appliedDate ? new Date(formData.appliedDate).toISOString() : undefined,
      };

      const response = await applications.update(application.id, updateData);

      if (response.success) {
        // Redirect back to application detail page
        router.push(`/student/applications/${application.id}`);
      } else {
        setSubmitError(response.error || 'Failed to update application');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
      console.error('Application update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              helpText="When did you submit this application?"
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
              helpText="When is the application deadline?"
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
              placeholder="e.g., Applied through referral, completed coding challenge, interview scheduled..."
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
        <Link href={`/student/applications/${application.id}`}>
          <Button variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Updating...' : 'Update Application'}
          </Button>
        </div>
      </div>
    </form>
  );
}