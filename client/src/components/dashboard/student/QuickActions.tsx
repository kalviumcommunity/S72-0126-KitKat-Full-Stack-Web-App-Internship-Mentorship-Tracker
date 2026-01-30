// Quick Actions Component
// Professional navigation cards for main dashboard actions

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function QuickActions() {
  const actions = [
    {
      title: 'New Application',
      description: 'Track a new internship application',
      href: '/dashboard/user/applications/new',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Find Mentor',
      description: 'Connect with experienced professionals',
      href: '/dashboard/user/mentors/find',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'View Feedback',
      description: 'Review mentor feedback and suggestions',
      href: '/dashboard/user/feedback',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Get started with these essential tasks</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="space-y-4">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mx-auto group-hover:scale-110 transition-transform duration-200`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}