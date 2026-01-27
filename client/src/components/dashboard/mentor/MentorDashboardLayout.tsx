// Mentor Dashboard Layout Component
// Sidebar navigation and layout for mentor dashboard

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MentorDashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function MentorDashboardLayout({ children, currentPage }: MentorDashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/dashboard/mentor' },
    { id: 'students', label: 'My Students', icon: '👥', href: '/dashboard/mentor/students' },
    { id: 'sessions', label: 'Sessions', icon: '📅', href: '/dashboard/mentor/sessions' },
    { id: 'feedback', label: 'Feedback', icon: '💬', href: '/dashboard/mentor/feedback' },
    { id: 'applications', label: 'Applications', icon: '📝', href: '/dashboard/mentor/applications' },
    { id: 'messages', label: 'Messages', icon: '✉️', href: '/dashboard/mentor/messages' },
    { id: 'analytics', label: 'Analytics', icon: '📊', href: '/dashboard/mentor/analytics' },
    { id: 'resources', label: 'Resources', icon: '📚', href: '/dashboard/mentor/resources' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/dashboard/mentor/settings' },
    { id: 'profile', label: 'Profile', icon: '👤', href: '/dashboard/mentor/profile' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mentor Portal</h1>
                <p className="text-sm text-gray-600">Welcome back!</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                <Badge className="bg-green-100 text-green-800 mt-1" size="sm">
                  Mentor
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <Button
              onClick={logout}
              variant="outline"
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <span className="mr-2">🚪</span>
              Logout
            </Button>
          ) : (
            <button
              onClick={logout}
              className="w-full p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              🚪
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}