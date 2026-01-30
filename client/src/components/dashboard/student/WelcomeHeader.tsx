// Welcome Header Component
// Top section with welcome message and quick actions

'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface WelcomeHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
  };
}

export function WelcomeHeader({ user }: WelcomeHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Welcome Message */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="flex items-center space-x-2">
              <span>📅</span>
              <span>{currentDate}</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>🕐</span>
              <span>{currentTime}</span>
            </span>
          </div>
          
          {/* Streak Counter */}
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-semibold text-orange-600">
              5-day application streak!
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        {/* <div className="flex flex-wrap gap-3">
          <Button disabled className="bg-gray-400 cursor-not-allowed">
            <span className="mr-2">📝</span>
            New Application
          </Button>
          <Button disabled variant="outline" className="border-gray-300 text-gray-400 cursor-not-allowed">
            <span className="mr-2">🔍</span>
            Find Mentor
          </Button>
          <Button disabled variant="outline" className="border-gray-300 text-gray-400 cursor-not-allowed">
            <span className="mr-2">💬</span>
            View Feedback
          </Button>
        </div> */}
      </div>
    </Card>
  );
}