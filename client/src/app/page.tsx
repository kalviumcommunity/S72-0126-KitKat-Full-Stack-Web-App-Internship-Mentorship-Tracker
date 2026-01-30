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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900 mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}