// Mentor Welcome Header Component
// Welcome message and quick overview for mentors

'use client';

import { useAuth } from '@/contexts/AuthContext';

export function MentorWelcomeHeader() {
  const { user } = useAuth();
  
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {user?.firstName}! 👋
            </h1>
            <p className="text-green-100 text-lg">
              Ready to guide your students to success today?
            </p>
            <div className="flex items-center space-x-6 mt-4 text-green-100">
              <div className="flex items-center space-x-2">
                <span>👥</span>
                <span>8 Active Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>3 Sessions Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⏳</span>
                <span>5 Pending Reviews</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-sm text-green-100">Mentor Rating</div>
                <div className="flex items-center justify-center mt-2">
                  <span className="text-yellow-300">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}