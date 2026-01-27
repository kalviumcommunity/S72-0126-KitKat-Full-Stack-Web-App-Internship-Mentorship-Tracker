// Feedback History Section Component
// Timeline view of all feedback received from mentors with filtering

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Feedback {
  id: string;
  mentorName: string;
  mentorPhoto: string;
  mentorCompany: string;
  date: string;
  category: 'Resume' | 'Interview' | 'Technical' | 'Career' | 'General';
  rating: number;
  title: string;
  content: string;
  tags: string[];
}

export function FeedbackHistorySection() {
  const [selectedMentor, setSelectedMentor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const feedbackHistory: Feedback[] = [
    {
      id: '1',
      mentorName: 'John Doe',
      mentorPhoto: '👨‍💻',
      mentorCompany: 'Google',
      date: '2024-01-25',
      category: 'Technical',
      rating: 5,
      title: 'Excellent problem-solving approach',
      content: 'Your solution to the binary tree problem was very elegant. I particularly liked how you optimized the space complexity. Keep practicing these types of problems.',
      tags: ['Algorithms', 'Problem Solving', 'Optimization']
    },
    {
      id: '2',
      mentorName: 'Sarah Chen',
      mentorPhoto: '👩‍💼',
      mentorCompany: 'Microsoft',
      date: '2024-01-22',
      category: 'Resume',
      rating: 4,
      title: 'Strong resume improvements',
      content: 'Great job incorporating the quantifiable achievements we discussed. Your project descriptions are much clearer now. Consider adding one more leadership example.',
      tags: ['Resume Writing', 'Achievements', 'Leadership']
    },
    {
      id: '3',
      mentorName: 'David Rodriguez',
      mentorPhoto: '👨‍🔬',
      mentorCompany: 'Meta',
      date: '2024-01-20',
      category: 'Interview',
      rating: 3,
      title: 'Interview preparation feedback',
      content: 'Your technical knowledge is solid, but work on explaining your thought process more clearly. Practice talking through your solutions step by step.',
      tags: ['Communication', 'Interview Skills', 'Technical Explanation']
    },
    {
      id: '4',
      mentorName: 'John Doe',
      mentorPhoto: '👨‍💻',
      mentorCompany: 'Google',
      date: '2024-01-18',
      category: 'Career',
      rating: 5,
      title: 'Career path guidance',
      content: 'Based on your interests in AI/ML, I recommend focusing on companies with strong research divisions. Consider contributing to open source ML projects.',
      tags: ['Career Planning', 'AI/ML', 'Open Source']
    },
    {
      id: '5',
      mentorName: 'Sarah Chen',
      mentorPhoto: '👩‍💼',
      mentorCompany: 'Microsoft',
      date: '2024-01-15',
      category: 'General',
      rating: 4,
      title: 'Overall progress review',
      content: 'You\'ve made significant progress since we started. Your confidence has improved and you\'re asking better questions. Keep up the momentum!',
      tags: ['Progress', 'Confidence', 'Growth Mindset']
    }
  ];

  const mentors = ['all', ...Array.from(new Set(feedbackHistory.map(f => f.mentorName)))];
  const categories = ['all', 'Resume', 'Interview', 'Technical', 'Career', 'General'];

  const filteredFeedback = feedbackHistory.filter(feedback => {
    const mentorMatch = selectedMentor === 'all' || feedback.mentorName === selectedMentor;
    const categoryMatch = selectedCategory === 'all' || feedback.category === selectedCategory;
    return mentorMatch && categoryMatch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Resume': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-green-100 text-green-800',
      'Technical': 'bg-purple-100 text-purple-800',
      'Career': 'bg-orange-100 text-orange-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Feedback History</h2>
          <Badge className="bg-blue-100 text-blue-800">
            {feedbackHistory.length} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Mentor
            </label>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {mentors.map((mentor) => (
                <option key={mentor} value={mentor}>
                  {mentor === 'all' ? 'All Mentors' : mentor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Timeline */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredFeedback.map((feedback, index) => (
            <div key={feedback.id} className="relative">
              {/* Timeline Line */}
              {index < filteredFeedback.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Timeline Dot & Avatar */}
                <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl border-4 border-white shadow-lg">
                  {feedback.mentorPhoto}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {feedback.mentorName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feedback.mentorCompany} • {formatDate(feedback.date)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(feedback.category)} size="sm">
                        {feedback.category}
                      </Badge>
                      <div className="flex">
                        {renderStars(feedback.rating)}
                      </div>
                    </div>
                  </div>

                  <h5 className="font-medium text-gray-900 mb-2">
                    {feedback.title}
                  </h5>
                  
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {feedback.content}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {feedback.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeedback.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              No Feedback Found
            </h4>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or request feedback from your mentors.
            </p>
            <Button variant="outline">
              Request Feedback
            </Button>
          </div>
        )}

        {/* Summary Stats */}
        {filteredFeedback.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Feedback Summary</h4>
                <p className="text-sm text-gray-600">
                  Average rating: {(filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / filteredFeedback.length).toFixed(1)} ⭐
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export Feedback
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}