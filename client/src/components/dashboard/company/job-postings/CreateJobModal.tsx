// Create Job Modal Component
// Modal for creating/editing job postings

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    jobType: 'internship',
    location: 'remote',
    city: '',
    salaryMin: '',
    salaryMax: '',
    benefits: [],
    relocation: false,
    housing: false,
    startDate: '',
    duration: '',
    hoursPerWeek: '',
    flexibleHours: false,
    description: '',
    responsibilities: '',
    requirements: '',
    skills: [],
    experience: '',
    gpa: '',
    deadline: '',
    positions: 1
  });

  const steps = [
    'Basic Information',
    'Compensation',
    'Duration & Schedule',
    'Job Description',
    'Requirements',
    'Application Process',
    'Preview'
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create New Job Posting</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center space-x-2 mt-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : index + 1 < currentStep 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
                      index + 1 < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Software Engineering Intern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="engineering">Engineering</option>
                    <option value="product">Product</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="data">Data Science</option>
                    <option value="sales">Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <div className="flex space-x-4">
                    {['internship', 'co-op', 'contract'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={formData.jobType === type}
                          onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                          className="mr-2"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="flex space-x-4 mb-3">
                    {['on-site', 'remote', 'hybrid'].map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          value={location}
                          checked={formData.location === location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="mr-2"
                        />
                        <span className="capitalize">{location}</span>
                      </label>
                    ))}
                  </div>
                  
                  {(formData.location === 'on-site' || formData.location === 'hybrid') && (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="City, State"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Compensation */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Salary/Stipend *
                    </label>
                    <input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Salary/Stipend *
                    </label>
                    <input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="8000"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.relocation}
                      onChange={(e) => setFormData({...formData, relocation: e.target.checked})}
                      className="mr-2"
                    />
                    Relocation assistance provided
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.housing}
                      onChange={(e) => setFormData({...formData, housing: e.target.checked})}
                      className="mr-2"
                    />
                    Housing provided
                  </label>
                </div>
              </div>
            )}

            {/* Additional steps would be implemented similarly */}
            {currentStep > 2 && (
              <div className="text-center py-8">
                <p className="text-gray-600">Step {currentStep} content would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  This is a simplified version for demonstration
                </p>
              </div>
            )}
          </CardContent>

          {/* Footer */}
          <div className="border-t p-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep === steps.length ? (
                <Button onClick={handleSubmit}>
                  Publish Posting
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}