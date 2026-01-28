// Feedback History Component
// View and manage all previously given feedback

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function FeedbackHistory() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const feedbackHistory = [
    {
      id: 1,
      student: {
        name: 'Sarah Johnson',
        avatar: '👩‍💻',
        email: 'sarah.johnson@ucla.edu'
      },
      category: 'Resume Review',
      dateGiven: '2024-01-25',
      rating: 4,
      implementationStatus: 'completed',
      studentResponse: 'Thank you for the detailed feedback! I\'ve updated my resume based on your suggestions.',
      responseDate: '2024-01-27',
      title: 'Resume Review for Google Application',
      summary: 'Comprehensive review focusing on technical skills presentation and quantifiable achievements.',
      actionItemsCompleted: 4,
      actionItemsTotal: 5,
      followUpScheduled: true
    },
    {
      id: 2,
      student: {
        name: 'Mike Chen',
        avatar: '👨‍💼',
        email: 'mike.chen@stanford.edu'
      },
      category: 'Technical Interview',
      dateGiven: '2024-01-23',
      rating: 5,
      implementationStatus: 'in_progress',
      studentResponse: 'Working through the LeetCode problems you recommended. Very helpful!',
      responseDate: '2024-01-24',
      title: 'Mock Technical Interview Feedback',
      summary: 'Strong performance with areas for improvement in system design and optimization.',
      actionItemsCompleted: 2,
      actionItemsTotal: 4,
      followUpScheduled: true
    },
    {
      id: 3,
      student: {
        name: 'Emma Davis',
        avatar: '👩‍🎓',
        email: 'emma.davis@berkeley.edu'
      },
      category: 'Career Strategy',
      dateGiven: '2024-01-20',
      rating: 5,
      implementationStatus: 'completed',
      studentResponse: 'Your career roadmap was exactly what I needed. Already seeing results!',
      responseDate: '2024-01-21',
      title: 'Career Planning and Goal Setting',
      summary: 'Strategic discussion about transitioning from academia to industry roles.',
      actionItemsCompleted: 6,
      actionItemsTotal: 6,
      followUpScheduled: false
    },
    {
      id: 4,
      student: {
        name: 'John Smith',
        avatar: '👨‍💻',
        email: 'john.smith@usc.edu'
      },
      category: 'Behavioral Interview',
      dateGiven: '2024-01-18',
      rating: 3,
      implementationStatus: 'pending',
      studentResponse: null,
      responseDate: null,
      title: 'Behavioral Interview Preparation',
      summary: 'Need to work on STAR method and storytelling techniques.',
      actionItemsCompleted: 0,
      actionItemsTotal: 5,
      followUpScheduled: true
    },
    {
      id: 5,
      student: {
        name: 'Lisa Wang',
        avatar: '👩‍💼',
        email: 'lisa.wang@caltech.edu'
      },
      category: 'General Guidance',
      dateGiven: '2024-01-15',
      rating: 4,
      implementationStatus: 'in_progress',
      studentResponse: 'Thank you for the networking advice. I\'ve started reaching out to professionals.',
      responseDate: '2024-01-16',
      title: 'Networking and Professional Development',
      summary: 'Guidance on building professional network and industry connections.',
      actionItemsCompleted: 3,
      actionItemsTotal: 4,
      followUpScheduled: false
    }
  ];

  const categories = ['all', 'Resume Review', 'Technical Interview', 'Behavioral Interview', 'Career Strategy', 'General Guidance'];
  const statuses = ['all', 'completed', 'in_progress', 'pending'];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: 'Completed',
      in_progress: 'In Progress',
      pending: 'Pending'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Resume Review': 'bg-blue-100 text-blue-800',
      'Technical Interview': 'bg-green-100 text-green-800',
      'Behavioral Interview': 'bg-purple-100 text-purple-800',
      'Career Strategy': 'bg-orange-100 text-orange-800',
      'General Guidance': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredFeedback = feedbackHistory.filter(feedback => {
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || feedback.implementationStatus === filterStatus;
    const matchesSearch = searchQuery === '' || 
      feedback.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search by student name or feedback title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline">
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedback) => (
          <Card key={feedback.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                    {feedback.student.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feedback.title}</h3>
                    <p className="text-gray-600">{feedback.student.name} • {feedback.student.email}</p>
                    <p className="text-sm text-gray-500">Given on {feedback.dateGiven}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getCategoryColor(feedback.category)}>
                    {feedback.category}
                  </Badge>
                  <Badge className={getStatusColor(feedback.implementationStatus)}>
                    {getStatusText(feedback.implementationStatus)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">{feedback.summary}</p>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Action Items Progress</span>
                  <span className="text-sm text-gray-600">
                    {feedback.actionItemsCompleted}/{feedback.actionItemsTotal} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(feedback.actionItemsCompleted / feedback.actionItemsTotal) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Student Response */}
              {feedback.studentResponse && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-blue-900">Student Response</span>
                        <span className="text-sm text-blue-600">{feedback.responseDate}</span>
                      </div>
                      <p className="text-blue-800">{feedback.studentResponse}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                {feedback.followUpScheduled && (
                  <Badge className="bg-green-100 text-green-800">
                    Follow-up Scheduled
                  </Badge>
                )}
                {!feedback.studentResponse && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Follow Up
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Feedback Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{feedbackHistory.length}</div>
              <div className="text-sm text-blue-800">Total Feedback Given</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {feedbackHistory.filter(f => f.implementationStatus === 'completed').length}
              </div>
              <div className="text-sm text-green-800">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {feedbackHistory.filter(f => f.implementationStatus === 'in_progress').length}
              </div>
              <div className="text-sm text-yellow-800">In Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(feedbackHistory.reduce((sum, f) => sum + f.rating, 0) / feedbackHistory.length).toFixed(1)}
              </div>
              <div className="text-sm text-purple-800">Average Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}