// Authentication layout for login/signup pages
// Server Component - handles layout for auth routes

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - UIMP',
  description: 'Login or signup to access the Unified Internship & Mentorship Portal',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UIMP</h1>
          <p className="text-gray-600">Unified Internship & Mentorship Portal</p>
        </div>
        
        {/* Auth Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>&copy; 2024 UIMP. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}