// Feedback Management Component
// Professional feedback viewing and management interface

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface FeedbackItem {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  subject: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  status: 'New' | 'Read' | 'Implemented' | 'Archived';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  rating?: number;
}

// Mock feedback data
const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    mentorName: 'Sarah Chen',
    mentorTitle: 'Senior Software Engineer',
    mentorCompany: 'Google',
    subject: 'Resume Review - Technical Skills Section',
    content: 'Your resume shows great technical foundation, but I recommend restructuring the skills section to highlight your most relevant technologies first. Consider grouping them by category (Languages, Frameworks, Tools) and adding proficiency levels. Also, quantify your project impacts where possible.',
    priority: 'High',
    category: 'Resume',
    status: 'New',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    rating: 5,
  },
  {
    id: '2',
    mentorName: 'Michael Rodriguez',
    mentorTitle: 'Product Manager',
    mentorCompany: 'Microsoft',
    subject: 'Interview Preparation - Behavioral Questions',
    content: 'Great job on the technical aspects! For behavioral interviews, work on the STAR method (Situation, Task, Action, Result). Your stories need more specific metrics and outcomes. Practice explaining complex technical concepts to non-technical stakeholders.',
    priority: 'Medium',
    category: 'Interview Prep',
    status: 'Read',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19',
    rating: 4,
  },
  {
    id: '3',
    mentorName: 'Emily Johnson',
    mentorTitle: 'Data Scientist',
    mentorCompany: 'Netflix',
    subject: 'Portfolio Project Feedback',
    content: 'Your data analysis project demonstrates solid technical skills. To make it stand out, add more business context and explain the real-world impact of your findings. Consider creating a brief executive summary and improving the data visualization aesthetics.',
    priority: 'Medium',
    category: 'Portfolio',
    status: 'Implemented',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-17',
    rating: 5,
  },
  {
    id: '4',
    mentorName: 'David Kim',
    mentorTitle: 'Backend Engineer',
    mentorCompany: 'Amazon',
    subject: 'System Design Interview Tips',
    content: 'Focus on clarifying requirements first, then work through the high-level design before diving into details. Practice estimating scale and discussing trade-offs. Your technical knowledge is strong, but communication during the design process needs improvement.',
    priority: 'High',
    category: 'Interview Prep',
    status: 'Read',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
    rating: 4,
  },
];

export function FeedbackManagement() {
  const [feedback] = useState<FeedbackItem[]>(mockFeedback);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  const categories = ['Resume', 'Interview Prep', 'Portfolio', 'Career Guidance', 'Technical Skills'];
  const statuses = ['New', 'Read', 'Implemented', 'Archived'];
  const priorities = ['High', 'Medium', 'Low'];

  const filteredFeedback = feedback.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
    
    return matchesCategory && matchesStatus && matchesPriority;
  });

  const handleStatusUpdate = (feedbackId: string, newStatus: string) => {
    // TODO: Implement status update API call
    console.log('Updating feedback status:', feedbackId, newStatus);
  };

  const handleMarkAsRead = (feedbackId: string) => {
    handleStatusUpdate(feedbackId, 'Read');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'neutral';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Read': return 'neutral';
      case 'Implemented': return 'success';
      case 'Archived': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                }}
                variant="outline"
                className="w-full rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {feedback.filter(f => f.status === 'New').length}
            </div>
            <div className="text-sm text-gray-600">New Feedback</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {feedback.filter(f => f.status === 'Implemented').length}
            </div>
            <div className="text-sm text-gray-600">Implemented</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {feedback.filter(f => f.priority === 'High').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {feedback.length}
            </div>
            <div className="text-sm text-gray-600">Total Feedback</div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-900">
            Feedback History ({filteredFeedback.length})
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Request New Feedback
          </Button>
        </div>

        {filteredFeedback.map((item) => (
          <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                      {item.mentorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {item.mentorName} • {item.mentorTitle} at {item.mentorCompany}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(item.priority)} className="rounded-full">
                      {item.priority}
                    </Badge>
                    <Badge variant={getStatusColor(item.status)} className="rounded-full">
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Category: {item.category}</span>
                    <span>•</span>
                    <span>Received: {item.createdAt}</span>
                    {item.rating && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <span>Rating:</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < item.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  {item.status === 'New' && (
                    <Button
                      onClick={() => handleMarkAsRead(item.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      Mark as Read
                    </Button>
                  )}
                  
                  {item.status !== 'Implemented' && (
                    <Button
                      onClick={() => handleStatusUpdate(item.id, 'Implemented')}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      Mark as Implemented
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    Reply to Mentor
                  </Button>
                  
                  <Button
                    onClick={() => setSelectedFeedback(item)}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {filteredFeedback.length === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or request feedback from your mentors.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                Request Feedback
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}