// New Application Form Component
// Professional form for creating new internship applications

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

interface ApplicationFormData {
  company: string;
  position: string;
  location: string;
  applicationUrl: string;
  platform: string;
  salary: string;
  applicationDate: string;
  deadline: string;
  status: string;
  notes: string;
  requirements: string;
  contactPerson: string;
  contactEmail: string;
}

export function NewApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: '',
    position: '',
    location: '',
    applicationUrl: '',
    platform: 'LinkedIn',
    salary: '',
    applicationDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'Applied',
    notes: '',
    requirements: '',
    contactPerson: '',
    contactEmail: '',
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
      // TODO: Implement API call to save application
      console.log('Submitting application:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to applications page
      window.location.href = '/dashboard/user/applications';
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">
      {/* Company & Position Information */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-6">Company & Position Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Google, Microsoft, Amazon"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Position Title *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              required
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Software Engineer Intern"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., San Francisco, CA or Remote"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Salary Range
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., $25-30/hour or $5000/month"
            />
          </div>
        </div>
      </div>

      {/* Application Information */}
      <div className="space-y-6 border-t border-gray-200 pt-8">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-6">Application Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Application Platform *
            </label>
            <select
              id="platform"
              name="platform"
              required
              value={formData.platform}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Company Website">Company Website</option>
              <option value="Glassdoor">Glassdoor</option>
              <option value="AngelList">AngelList</option>
              <option value="Handshake">Handshake</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Application Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Applied">Applied</option>
              <option value="In Review">In Review</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Interview">Interview</option>
              <option value="Final Round">Final Round</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700">
              Application Date *
            </label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              required
              value={formData.applicationDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="applicationUrl" className="block text-sm font-medium text-gray-700">
            Application URL
          </label>
          <input
            type="url"
            id="applicationUrl"
            name="applicationUrl"
            value={formData.applicationUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6 border-t border-gray-200 pt-8">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-6">Contact Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., John Smith, HR Manager"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="contact@company.com"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6 border-t border-gray-200 pt-8">
        <div>
          <h2 className="text-xl font-medium text-gray-900 mb-6">Additional Information</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Key Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="List key requirements, skills, or qualifications mentioned in the job posting..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Add any additional notes, follow-up reminders, or important details..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <Link href="/dashboard/user/applications">
          <Button variant="outline" className="px-6 py-3 rounded-xl">
            Cancel
          </Button>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-3 rounded-xl"
            onClick={() => {
              // Save as draft functionality
              console.log('Saving as draft...');
            }}
          >
            Save as Draft
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
          >
            {isSubmitting ? 'Creating Application...' : 'Create Application'}
          </Button>
        </div>
      </div>
    </form>
  );
}