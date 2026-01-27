// Mentorship Header Component
// Header with title, Find New Mentor button, and tabs

'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { MentorTab } from '@/app/dashboard/user/mentors/page';

interface MentorshipHeaderProps {
  onFindMentor: () => void;
  activeTab: MentorTab;
  onTabChange: (tab: MentorTab) => void;
}

export function MentorshipHeader({
  onFindMentor,
  activeTab,
  onTabChange
}: MentorshipHeaderProps) {
  const tabs = [
    { id: 'active' as MentorTab, label: 'Active Mentors', count: 3 },
    { id: 'past' as MentorTab, label: 'Past Mentors', count: 2 },
    { id: 'requests' as MentorTab, label: 'Mentor Requests', count: 1 }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Mentorship Journey</h1>
          <p className="text-gray-600 mt-1">
            Connect with industry experts and accelerate your career growth
          </p>
        </div>
        
        <Button 
          onClick={onFindMentor}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <span className="mr-2">🔍</span>
          Find New Mentor
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <Badge 
                  className={`${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  size="sm"
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}