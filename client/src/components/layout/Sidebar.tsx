// Sidebar component - Client Component for navigation
// Responsive sidebar with role-based navigation

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles: string[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/student',
    icon: '📊',
    roles: ['STUDENT']
  },
  {
    name: 'Applications',
    href: '/student/applications',
    icon: '📋',
    roles: ['STUDENT']
  },
  {
    name: 'Feedback',
    href: '/student/feedback',
    icon: '💬',
    roles: ['STUDENT']
  },
  {
    name: 'Mentor Dashboard',
    href: '/mentor',
    icon: '👨‍🏫',
    roles: ['MENTOR']
  },
  {
    name: 'My Students',
    href: '/mentor/students',
    icon: '👥',
    roles: ['MENTOR']
  },
  {
    name: 'Provide Feedback',
    href: '/mentor/feedback',
    icon: '✍️',
    roles: ['MENTOR']
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // TODO: Get user role from auth context
  const userRole = 'STUDENT'; // This should come from auth context

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-lg">
              {isCollapsed ? '→' : '←'}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/student' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  User Name
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userRole.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}