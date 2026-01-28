// Create Feedback Section Component
// Form for creating new feedback for students

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function CreateFeedbackSection() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [actionItems, setActionItems] = useState(['']);

  const students = [
    { id: '1', name: 'Sarah Johnson', avatar: '👩‍💻' },
    { id: '2', name: 'Mike Chen', avatar: '👨‍💼' },
    { id: '3', name: 'Emma Davis', avatar: '👩‍🎓' },
    { id: '4', name: 'John Smith', avatar: '👨‍💻' },
    { id: '5', name: 'Lisa Wang', avatar: '👩‍💼' }
  ];

  const categories = [
    { id: 'resume', label: 'Resume Review', icon: '📝' },
    { id: 'interview', label: 'Interview Performance', icon: '🎤' },
    { id: 'technical', label: 'Technical Skills', icon: '💻' },
    { id: 'career', label: 'Career Strategy', icon: '🎯' },
    { id: 'general', label: 'General Guidance', icon: '📚' }
  ];

  const addActionItem = () => {
    setActionItems([...actionItems, '']);
  };

  const updateActionItem = (index: number, value: string) => {
    const updated = [...actionItems];
    updated[index] = value;
    setActionItems(updated);
  };

  const removeActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (action: 'draft' | 'submit' | 'submit_schedule') => {
    console.log('Feedback action:', action);
    // Handle form submission
  };

  return (
    <div className="space-y-6">
      {/* Quick Create Form */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Create New Feedback</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Select Student */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Select Student
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                    selectedStudent === student.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{student.avatar}</span>
                  <span className="font-medium">{student.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Select Category
            </label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm font-medium text-center">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. Overall Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ⭐
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating}/5 stars`}
              </span>
            </div>
          </div>

          {/* Step 4: Structured Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strengths
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="What did the student do well? Highlight their achievements and positive aspects..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Areas for Improvement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas for Improvement
              </label>
              <textarea
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="What areas need work? Be specific and constructive..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2">
                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                  <option>Priority: Medium</option>
                  <option>Priority: High</option>
                  <option>Priority: Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specific Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Recommendations
            </label>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="• Specific actionable advice
• Resources to explore
• Next steps to take..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Items
            </label>
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateActionItem(index, e.target.value)}
                    placeholder="Specific task with deadline..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {actionItems.length > 1 && (
                    <button
                      onClick={() => removeActionItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addActionItem}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Action Item
              </button>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments & Resources
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-500">
                <span className="text-2xl">📎</span>
                <p className="mt-2">Drop files here or click to upload</p>
                <p className="text-sm">Documents, links, or resources</p>
              </div>
            </div>
          </div>

          {/* Follow-up Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Follow-up Options</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Schedule follow-up session</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Set reminder to check progress (1 week)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Request student response/acknowledgment</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => handleSubmit('submit')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Feedback
            </Button>
            <Button
              onClick={() => handleSubmit('submit_schedule')}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit & Schedule Session
            </Button>
            <Button
              onClick={() => handleSubmit('draft')}
              variant="outline"
            >
              Save Draft
            </Button>
            <Button variant="outline">
              Use Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}