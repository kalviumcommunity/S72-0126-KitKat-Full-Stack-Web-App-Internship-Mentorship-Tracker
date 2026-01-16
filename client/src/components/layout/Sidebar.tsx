// Sidebar component - Client Component for navigation
// Responsive sidebar with role-based navigation

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from '@/lib/types';

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
  {
    name: 'Admin Dashboard',
    href: '/admin',
    icon: '⚙️',
    roles: ['ADMIN']
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: '👤',
    roles: ['ADMIN']
  },
  {
    name: 'Assignments',
    href: '/admin/assignments',
    icon: '🔗',
    roles: ['ADMIN']
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const userRole = user.role;
  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(userRole)
  );

  const userInitials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : (user.email ? user.email.charAt(0) : 'U').toUpperCase();

  const userDisplayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <div className={cn(
      'bg-white/80 backdrop-blur-md border-r border-gray-100 transition-all duration-300 min-h-[calc(100vh-4rem)]',
      isCollapsed ? 'w-20' : 'w-72'
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
              (item.href !== '/student' && item.href !== '/mentor' && item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <span className={cn(
                  "text-xl transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110",
                  !isCollapsed && "mr-3"
                )}>{item.icon}</span>
                {!isCollapsed && (
                  <span className="truncate font-semibold">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userDisplayName}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
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
