// Company Dashboard Layout Component
// Sidebar navigation and layout for company dashboard

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface CompanyDashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function CompanyDashboardLayout({ children, currentPage }: CompanyDashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/dashboard/company' },
    { id: 'job-postings', label: 'Job Postings', icon: '📢', href: '/dashboard/company/job-postings' },
    { id: 'applicants', label: 'Applicants', icon: '👔', href: '/dashboard/company/applicants' },
    { id: 'hiring-pipeline', label: 'Hiring Pipeline', icon: '📊', href: '/dashboard/company/hiring-pipeline' },
    { id: 'talent-pool', label: 'Talent Pool', icon: '🎯', href: '/dashboard/company/talent-pool' },
    { id: 'messages', label: 'Messages', icon: '💬', href: '/dashboard/company/messages' },
    { id: 'analytics', label: 'Analytics', icon: '📈', href: '/dashboard/company/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/dashboard/company/settings' },
    { id: 'company-profile', label: 'Company Profile', icon: '🏢', href: '/dashboard/company/company-profile' }
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
                <h1 className="text-xl font-bold text-gray-900">Company Portal</h1>
                <p className="text-sm text-gray-600">Hiring Dashboard</p>
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" size="sm">Company</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}