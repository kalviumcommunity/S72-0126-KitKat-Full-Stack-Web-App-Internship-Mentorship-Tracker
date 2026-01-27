// Job Posting Form - Client Component
// Form for creating and editing job postings

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface JobFormData {
  title: string;
  type: 'Internship' | 'Full-time' | 'Part-time' | 'Contract';
  location: 'Remote' | 'On-site' | 'Hybrid';
  department: string;
  description: string;
  requirements: string[];
  salary: string;
  deadline: string;
}

interface JobPostingFormProps {
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
  initialData?: Partial<JobFormData>;
  isEditing?: boolean;
}

export function JobPostingForm({ onSubmit, onCancel, initialData, isEditing = false }: JobPostingFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: initialData?.title || '',
    type: initialData?.type || 'Internship',
    location: initialData?.location || 'Remote',
    department: initialData?.department || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || [''],
    salary: initialData?.salary || '',
    deadline: initialData?.deadline || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.salary.trim()) newErrors.salary = 'Salary information is required';
    if (!formData.deadline) newErrors.deadline = 'Application deadline is required';
    
    const validRequirements = formData.requirements.filter(req => req.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim())
      };
      onSubmit(cleanedData);
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Update your job posting details' : 'Fill in the details for your new job posting'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Job Title"
                placeholder="e.g., Software Engineer Intern"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={errors.title}
                required
              />
            </div>
            <div>
              <Input
                label="Department"
                placeholder="e.g., Engineering, Marketing"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                error={errors.department}
                required
              />
            </div>
          </div>

          {/* Job Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as JobFormData['type'] }))}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value as JobFormData['location'] }))}
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <Input
                label="Salary/Compensation"
                placeholder="e.g., $25-30/hour, $80k-100k/year"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                error={errors.salary}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Requirements <span className="text-red-500">*</span>
              </label>
              <Button type="button" size="sm" variant="outline" onClick={addRequirement}>
                + Add Requirement
              </Button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Requirement ${index + 1}`}
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.requirements && (
              <p className="text-sm text-red-600 mt-1">{errors.requirements}</p>
            )}
          </div>

          {/* Application Deadline */}
          <div>
            <Input
              label="Application Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              error={errors.deadline}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {isEditing ? 'Update Job Posting' : 'Create Job Posting'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}