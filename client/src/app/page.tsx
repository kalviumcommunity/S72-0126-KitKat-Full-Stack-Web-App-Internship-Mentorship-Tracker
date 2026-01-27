'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { LandingPage } from '@/components/landing/LandingPage';

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      const isCompanyUser = user.email.startsWith('company');
      
      switch (user.role) {
        case UserRole.STUDENT:
          router.push('/dashboard/user');
          break;
        case UserRole.MENTOR:
          // If it's a company email, redirect to company dashboard
          if (isCompanyUser) {
            router.push('/dashboard/company');
          } else {
            router.push('/dashboard/mentor');
          }
          break;
        case UserRole.ADMIN:
          router.push('/dashboard/admin');
          break;
        default:
          break;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}