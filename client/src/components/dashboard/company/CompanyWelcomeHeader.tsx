// Company Welcome Header Component
// Welcome section with quick stats and actions

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function CompanyWelcomeHeader() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'Company'}!
            </h1>
            <p className="text-blue-100 text-lg">
              15 new applicants this week
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" size="lg">
              Post New Job
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
              Review Applicants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}