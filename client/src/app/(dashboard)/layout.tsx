// Dashboard layout for protected routes
// Server Component with authentication check

import { Metadata } from 'next/types';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Dashboard - UIMP',
  description: 'Unified Internship & Mentorship Portal Dashboard',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthenticatedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50">
        {/* Header */}
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}