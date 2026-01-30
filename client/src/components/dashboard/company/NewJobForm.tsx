// New Job Form Component
// Minimalistic job posting form with clean design and proper whitespace

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface JobFormData {
  title: string;
  department: string;
  location: string;
  type: 'Internship' | 'Full-time' | 'Part-time' | 'Contract';
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  description: string;
  responsibilities: string;
  requirements: string;
  qualifications: string;
  salaryMin: string;
  salaryMax: string;
  salaryType: 'Hourly' | 'Monthly' | 'Annual';
  applicationDeadline: string;
  startDate: string;
  duration: string;
  benefits: string;
  contactEmail: string;
  applicationUrl: string;
  status: 'Draft' | 'Active';
}

export function NewJobForm() {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    type: 'Internship',
    workMode: 'On-site',
    description: '',
    responsibilities: '',
    requirements: '',
    qualifications: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'Hourly',
    applicationDeadline: '',
    startDate: '',
    duration: '',
    benefits: '',
    contactEmail: '',
    applicationUrl: '',
    status: 'Draft',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create job posting
      console.log('Creating job posting:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to company dashboard
      window.location.href = '/dashboard/company';
    } catch (error) {
      console.error('Error creating job posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setFormData(prev => ({ ...prev, status: 'Draft' }));
    await handleSubmit(new Event('submit') as any);
  };

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, status: 'Active' }));
    await handleSubmit(new Event('submit') as any);
  };

  return (
    <form onSubmit={handleSubmit} className="p-12 space-y-12">
      
      {/* Basic Information */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-8">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              placeholder="e.g., Software Engineer Intern"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <input
              type="text"
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              placeholder="e.g., Engineering, Marketing, Design"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Employment Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="space-y-3">
            <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">
              Work Mode *
            </label>
            <select
              id="workMode"
              name="workMode"
              required
              value={formData.workMode}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="space-y-3 lg:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              placeholder="e.g., San Francisco, CA or Remote"
            />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-8 border-t border-gray-200 pt-12">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-8">Job Details</h2>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              placeholder="Provide a comprehensive overview of the role, company culture, and what makes this opportunity unique..."
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">
              Key Responsibilities *
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={5}
              required
              value={formData.responsibilities}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              placeholder="• Develop and maintain web applications&#10;• Collaborate with cross-functional teams&#10;• Participate in code reviews and testing..."
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Required Qualifications *
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={5}
              required
              value={formData.requirements}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              placeholder="• Currently pursuing a degree in Computer Science or related field&#10;• Proficiency in JavaScript, React, or similar technologies&#10;• Strong problem-solving and communication skills..."
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
              Preferred Qualifications
            </label>
            <textarea
              id="qualifications"
              name="qualifications"
              rows={4}
              value={formData.qualifications}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              placeholder="• Previous internship experience&#10;• Experience with cloud platforms (AWS, GCP)&#10;• Open source contributions..."
            />
          </div>
        </div>
      </div>

      {/* Compensation & Timeline */}
      <div className="space-y-8 border-t border-gray-200 pt-12">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-8">Compensation & Timeline</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Salary Range
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Min"
                />
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Max"
                />
                <select
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleInputChange}
                  className="px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                placeholder="e.g., 3 months, 6 months, 1 year"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700">
                Application Deadline *
              </label>
              <input
                type="date"
                id="applicationDeadline"
                name="applicationDeadline"
                required
                value={formData.applicationDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
            Benefits & Perks
          </label>
          <textarea
            id="benefits"
            name="benefits"
            rows={4}
            value={formData.benefits}
            onChange={handleInputChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
            placeholder="• Health insurance coverage&#10;• Flexible working hours&#10;• Professional development opportunities&#10;• Free meals and snacks..."
          />
        </div>
      </div>

      {/* Application Details */}
      <div className="space-y-8 border-t border-gray-200 pt-12">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-8">Application Details</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Contact Email *
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              required
              value={formData.contactEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              placeholder="hr@company.com"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="applicationUrl" className="block text-sm font-medium text-gray-700">
              Application URL
            </label>
            <input
              type="url"
              id="applicationUrl"
              name="applicationUrl"
              value={formData.applicationUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              placeholder="https://company.com/careers/apply"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-12 border-t border-gray-200">
        <Link href="/dashboard/company">
          <Button variant="ghost" className="px-6 py-3 text-gray-600 hover:text-gray-800">
            Cancel
          </Button>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
            className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all"
          >
            Save as Draft
          </Button>
          
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Job'}
          </Button>
        </div>
      </div>

    </form>
  );
}