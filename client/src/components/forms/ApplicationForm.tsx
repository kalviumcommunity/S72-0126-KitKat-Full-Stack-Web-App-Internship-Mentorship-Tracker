// Application Form - Client Component
// Form for creating and editing internship applications

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { applicationSchema, type ApplicationFormData } from '@/lib/validations';
import { applications } from '@/lib/api';
import { getValidationErrors } from '@/lib/validations';
import { APPLICATION_STATUS_OPTIONS, APPLICATION_PLATFORM_OPTIONS } from '@/lib/constants';

interface ApplicationFormProps {
  initialData?: Partial<ApplicationFormData>;
  isEditing?: boolean;
  applicationId?: string;
}

export function ApplicationForm({ initialData, isEditing = false, applicationId }: ApplicationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: initialData?.company || '',
    role: initialData?.role || '',
    platform: initialData?.platform || 'COMPANY_WEBSITE',
    status: initialData?.status || 'DRAFT',
    notes: initialData?.notes || '',
    deadline: initialData?.deadline || '',
    appliedDate: initialData?.appliedDate || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleInputChange = (field: keyof ApplicationFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      const validatedData = applicationSchema.parse(formData);
      
      // Call API
      const response = isEditing && applicationId
        ? await applications.update(applicationId, validatedData)
        : await applications.create(validatedData);
      
      if (response.success) {
        router.push('/student/applications');
      } else {
        setGeneralError(response.error || 'Failed to save application. Please try again.');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{generalError}</p>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              type="text"
              value={formData.company}
              onChange={handleInputChange('company')}
              error={errors.company}
              placeholder="e.g., Google, Microsoft, Amazon"
              required
              disabled={isLoading}
            />

            <Input
              label="Role/Position"
              type="text"
              value={formData.role}
              onChange={handleInputChange('role')}
              error={errors.role}
              placeholder="e.g., Software Engineer Intern"
              required
              disabled={isLoading}
            />

            <Select
              label="Application Platform"
              value={formData.platform}
              onChange={handleInputChange('platform')}
              error={errors.platform}
              options={APPLICATION_PLATFORM_OPTIONS}
              required
              disabled={isLoading}
            />

            <Select
              label="Application Status"
              value={formData.status}
              onChange={handleInputChange('status')}
              error={errors.status}
              options={APPLICATION_STATUS_OPTIONS}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Important Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Application Deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleInputChange('deadline')}
              error={errors.deadline}
              disabled={isLoading}
              helperText="When is the application due?"
            />

            <Input
              label="Applied Date"
              type="datetime-local"
              value={formData.appliedDate}
              onChange={handleInputChange('appliedDate')}
              error={errors.appliedDate}
              disabled={isLoading}
              helperText="When did you submit the application?"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={handleInputChange('notes')}
              placeholder="Add any additional notes about this application..."
              rows={4}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-colors"
              disabled={isLoading}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes}</p>
            )}
            <p className="text-sm text-gray-500">
              {formData.notes.length}/1000 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-4xl mb-2">📄</div>
              <p className="text-sm text-gray-600 mb-2">
                Upload your resume for this application
              </p>
              <Button variant="outline" size="sm" disabled={isLoading}>
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                PDF, DOC, or DOCX up to 5MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading 
            ? (isEditing ? 'Updating...' : 'Creating...') 
            : (isEditing ? 'Update Application' : 'Create Application')
          }
        </Button>
      </div>
    </form>
  );
}