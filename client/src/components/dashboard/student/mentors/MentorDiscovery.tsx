// Mentor Discovery Component
// Professional mentor search and connection interface

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  experience: number;
  specializations: string[];
  rating: number;
  totalMentees: number;
  responseTime: string;
  bio: string;
  avatar: string;
  isAvailable: boolean;
}

// Mock data for mentors
const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Software Engineer',
    company: 'Google',
    experience: 8,
    specializations: ['Frontend Development', 'React', 'System Design'],
    rating: 4.9,
    totalMentees: 45,
    responseTime: '< 2 hours',
    bio: 'Passionate about helping students break into tech. Specialized in frontend development and system design with experience at top tech companies.',
    avatar: 'SC',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'Product Manager',
    company: 'Microsoft',
    experience: 6,
    specializations: ['Product Management', 'Strategy', 'Analytics'],
    rating: 4.8,
    totalMentees: 32,
    responseTime: '< 4 hours',
    bio: 'Former startup founder turned PM at Microsoft. Love helping students understand product strategy and break into product roles.',
    avatar: 'MR',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Emily Johnson',
    title: 'Data Scientist',
    company: 'Netflix',
    experience: 5,
    specializations: ['Data Science', 'Machine Learning', 'Python'],
    rating: 4.7,
    totalMentees: 28,
    responseTime: '< 6 hours',
    bio: 'Data scientist with expertise in ML and analytics. Passionate about helping students navigate the data science career path.',
    avatar: 'EJ',
    isAvailable: false,
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Backend Engineer',
    company: 'Amazon',
    experience: 7,
    specializations: ['Backend Development', 'AWS', 'Distributed Systems'],
    rating: 4.9,
    totalMentees: 38,
    responseTime: '< 3 hours',
    bio: 'Backend engineer specializing in scalable systems and cloud architecture. Happy to help with technical interviews and system design.',
    avatar: 'DK',
    isAvailable: true,
  },
];

export function MentorDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [mentors] = useState<Mentor[]>(mockMentors);

  const specializations = [
    'Frontend Development',
    'Backend Development',
    'Product Management',
    'Data Science',
    'Machine Learning',
    'System Design',
    'Mobile Development',
    'DevOps',
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = !selectedSpecialization || 
                                 mentor.specializations.includes(selectedSpecialization);
    
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && mentor.isAvailable);

    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  const handleConnectRequest = (mentorId: string) => {
    // TODO: Implement mentor connection request
    console.log('Sending connection request to mentor:', mentorId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search Mentors
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Search by name, company, or title..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                  Specialization
                </label>
                <select
                  id="specialization"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Availability
                </label>
                <select
                  id="availability"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Mentors</option>
                  <option value="available">Available Now</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-gray-900">
            {filteredMentors.length} Mentors Found
          </h2>
          <p className="text-gray-600 mt-1">
            Connect with experienced professionals to accelerate your career
          </p>
        </div>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Mentor Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold">
                      {mentor.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.title}</p>
                      <p className="text-sm font-medium text-blue-600">{mentor.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{mentor.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{mentor.totalMentees} mentees</p>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="flex items-center justify-between">
                  <Badge
                    variant={mentor.isAvailable ? 'success' : 'neutral'}
                    className="rounded-full"
                  >
                    {mentor.isAvailable ? 'Available' : 'Busy'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Responds {mentor.responseTime}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mentor.bio}
                </p>

                {/* Specializations */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Specializations:</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.specializations.map((spec) => (
                      <Badge key={spec} variant="neutral" className="text-xs rounded-full">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{mentor.experience} years experience</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleConnectRequest(mentor.id)}
                    disabled={!mentor.isAvailable}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                  >
                    {mentor.isAvailable ? 'Send Request' : 'Join Waitlist'}
                  </Button>
                  <Button
                    variant="outline"
                    className="px-4 py-2 rounded-xl"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more mentors.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
                setAvailabilityFilter('all');
              }}
              variant="outline"
              className="rounded-xl"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}