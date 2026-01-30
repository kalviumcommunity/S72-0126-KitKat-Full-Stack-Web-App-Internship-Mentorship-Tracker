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
  icon: React.ReactNode;
  roles: string[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/student',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    roles: ['STUDENT']
  },
  {
    name: 'Applications',
    href: '/student/applications',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    roles: ['STUDENT']
  },
  {
    name: 'Feedback',
    href: '/student/feedback',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    roles: ['STUDENT']
  },
  {
    name: 'Dashboard',
    href: '/mentor',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    roles: ['MENTOR']
  },
  {
    name: 'Students',
    href: '/mentor/students',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    roles: ['MENTOR']
  },
  {
    name: 'Feedback',
    href: '/mentor/feedback',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    roles: ['MENTOR']
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    roles: ['ADMIN']
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    roles: ['ADMIN']
  },
  {
    name: 'Assignments',
    href: '/admin/assignments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
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
      'bg-white/90 backdrop-blur-2xl border-r border-black/5 transition-all duration-300 min-h-[calc(100vh-5rem)]',
      isCollapsed ? 'w-20' : 'w-80'
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-6 border-b border-black/5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-3 text-gray-400 hover:text-black transition-all duration-200 rounded-lg hover:bg-black/5"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={cn("w-5 h-5 transition-transform duration-200", isCollapsed && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/student' && item.href !== '/mentor' && item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-black/5'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <span className={cn(
                  "transition-all duration-200",
                  !isCollapsed && "mr-4"
                )}>{item.icon}</span>
                {!isCollapsed && (
                  <span className="truncate font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-6 border-t border-black/5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-sm font-semibold">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black truncate">
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
