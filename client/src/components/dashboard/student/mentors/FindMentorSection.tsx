// Find Mentor Section Component
// Mentor discovery with filters and search results

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  reviewCount: number;
  photo: string;
  specializations: string[];
  industry: string;
  availability: 'high' | 'medium' | 'low';
  hourlyRate?: number;
  responseTime: string;
  languages: string[];
  isAvailable: boolean;
}

interface FindMentorSectionProps {
  onClose: () => void;
}

export function FindMentorSection({ onClose }: FindMentorSectionProps) {
  const [filters, setFilters] = useState({
    industry: 'all',
    expertise: [] as string[],
    company: '',
    rating: 4,
    availability: 'all'
  });

  const availableMentors: MentorProfile[] = [
    {
      id: '1',
      name: 'Emily Johnson',
      title: 'Senior Data Scientist',
      company: 'Netflix',
      rating: 4.9,
      reviewCount: 203,
      photo: '👩‍🔬',
      specializations: ['Machine Learning', 'Data Analysis', 'Python', 'Career Growth'],
      industry: 'Technology',
      availability: 'high',
      hourlyRate: 120,
      responseTime: '< 2 hours',
      languages: ['English', 'Spanish'],
      isAvailable: true
    },
    {
      id: '2',
      name: 'Michael Chang',
      title: 'Principal Engineer',
      company: 'Stripe',
      rating: 4.8,
      reviewCount: 156,
      photo: '👨‍💻',
      specializations: ['System Design', 'Backend Development', 'Leadership', 'Mentoring'],
      industry: 'Fintech',
      availability: 'medium',
      hourlyRate: 150,
      responseTime: '< 4 hours',
      languages: ['English', 'Mandarin'],
      isAvailable: true
    },
    {
      id: '3',
      name: 'Lisa Park',
      title: 'UX Design Manager',
      company: 'Airbnb',
      rating: 4.7,
      reviewCount: 89,
      photo: '👩‍🎨',
      specializations: ['UX Design', 'Product Strategy', 'User Research', 'Design Systems'],
      industry: 'Technology',
      availability: 'low',
      responseTime: '< 1 day',
      languages: ['English', 'Korean'],
      isAvailable: false
    },
    {
      id: '4',
      name: 'Alex Thompson',
      title: 'VP of Engineering',
      company: 'Uber',
      rating: 4.9,
      reviewCount: 312,
      photo: '👨‍💼',
      specializations: ['Engineering Leadership', 'Scaling Teams', 'Technical Strategy'],
      industry: 'Technology',
      availability: 'low',
      hourlyRate: 200,
      responseTime: '< 1 day',
      languages: ['English'],
      isAvailable: true
    }
  ];

  const industries = ['all', 'Technology', 'Fintech', 'Healthcare', 'E-commerce'];
  const expertiseOptions = [
    'Machine Learning', 'System Design', 'Frontend Development', 'Backend Development',
    'UX Design', 'Product Management', 'Data Science', 'Leadership', 'Career Growth'
  ];

  const getAvailabilityColor = (availability: string) => {
    const colors = {
      'high': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-red-100 text-red-800'
    };
    return colors[availability as keyof typeof colors];
  };

  const getAvailabilityLabel = (availability: string) => {
    const labels = {
      'high': 'High Availability',
      'medium': 'Medium Availability',
      'low': 'Limited Availability'
    };
    return labels[availability as keyof typeof labels];
  };

  const toggleExpertise = (expertise: string) => {
    setFilters(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⭐</span>}
        <span className="text-sm text-gray-600 ml-1">
          {rating} ({reviewCount} reviews)
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Find New Mentor</h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="Search companies..."
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Expertise Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise (Multi-select)
            </label>
            <div className="flex flex-wrap gap-2">
              {expertiseOptions.map((expertise) => (
                <button
                  key={expertise}
                  onClick={() => toggleExpertise(expertise)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.expertise.includes(expertise)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {expertise}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Mentors ({availableMentors.length})
            </h3>
            <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg">
              <option>Sort by Rating</option>
              <option>Sort by Reviews</option>
              <option>Sort by Availability</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availableMentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start space-x-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {mentor.photo}
                    </div>
                    {mentor.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      {mentor.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {mentor.title} @ {mentor.company}
                    </p>
                    {renderStars(mentor.rating)}
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {mentor.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        {spec}
                      </Badge>
                    ))}
                    {mentor.specializations.length > 3 && (
                      <Badge variant="outline" size="sm">
                        +{mentor.specializations.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Availability:</span>
                    <Badge className={getAvailabilityColor(mentor.availability)} size="sm">
                      {getAvailabilityLabel(mentor.availability)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response time:</span>
                    <span className="font-medium">{mentor.responseTime}</span>
                  </div>
                  {mentor.hourlyRate && (
                    <div className="flex items-center justify-between">
                      <span>Rate:</span>
                      <span className="font-medium">${mentor.hourlyRate}/hour</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!mentor.isAvailable}
                  >
                    Request Mentorship
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <Button variant="outline">
            Load More Mentors
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}