// Profile Header Component
// Cover photo, profile photo, name, headline, and action buttons

'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ProfileHeaderProps {
  isOwnProfile: boolean;
}

export function ProfileHeader({ isOwnProfile }: ProfileHeaderProps) {
  const profileData = {
    coverPhoto: '/api/placeholder/1200/300',
    profilePhoto: '👨‍💻',
    name: 'John Doe',
    headline: 'Computer Science Student | Aspiring Software Engineer',
    education: 'Stanford University - BS Computer Science',
    location: 'San Francisco, CA',
    isVerified: true,
    connections: 342
  };

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative">
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
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                {profileData.profilePhoto}
              </div>
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg">
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
                      <Badge className="bg-blue-100 text-blue-800">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-2">
                    {profileData.headline}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>🎓</span>
                      <span>{profileData.education}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>{profileData.connections} connections</span>
                    <span>•</span>
                    <span>Available for mentorship</span>
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
                    </>
                  ) : (
                    <>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <span className="mr-2">🎓</span>
                        Request Mentorship
                      </Button>
                      <Button variant="outline">
                        <span className="mr-2">💬</span>
                        Message
                      </Button>
                      <Button variant="outline">
                        <span className="mr-2">🤝</span>
                        Connect
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