// Mentor Profile Header Component
// Cover photo, profile photo, name, headline, and action buttons for mentors

'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MentorProfileHeaderProps {
  isOwnProfile: boolean;
}

export function MentorProfileHeader({ isOwnProfile }: MentorProfileHeaderProps) {
  const profileData = {
    coverPhoto: '/api/placeholder/1200/300',
    profilePhoto: '👨‍🏫',
    name: 'Dr. John Smith',
    headline: 'Senior Software Engineer @ Google | AI/ML Mentor',
    company: 'Google',
    experience: '8+ years',
    location: 'San Francisco, CA',
    isVerified: true,
    mentorRating: 4.9,
    totalStudents: 127,
    successRate: 85
  };

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-64 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors">
            📷 Change Cover
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative -mt-20 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                {profileData.profilePhoto}
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg">
                  📷
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6 md:mb-0">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profileData.name}
                    </h1>
                    {profileData.isVerified && (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Verified Mentor
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-2">
                    {profileData.headline}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>🏢</span>
                      <span>{profileData.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>💼</span>
                      <span>{profileData.experience}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{profileData.mentorRating}</span>
                      <span className="text-gray-500">mentor rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👥</span>
                      <span className="font-medium">{profileData.totalStudents}</span>
                      <span className="text-gray-500">students mentored</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🎯</span>
                      <span className="font-medium text-green-600">{profileData.successRate}%</span>
                      <span className="text-gray-500">success rate</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {isOwnProfile ? (
                    <>
                      <Button variant="outline">
                        <span className="mr-2">✏️</span>
                        Edit Profile
                      </Button>
                      <Button variant="outline">
                        <span className="mr-2">👁️</span>
                        Preview
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <span className="mr-2">📊</span>
                        View Analytics
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <span className="mr-2">🎓</span>
                        Request Mentorship
                      </Button>
                      <Button variant="outline">
                        <span className="mr-2">💬</span>
                        Message
                      </Button>
                      <Button variant="outline">
                        <span className="mr-2">📅</span>
                        Book Session
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}