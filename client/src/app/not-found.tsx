// Global Not Found Page
// Displays when a route is not found

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full">Go to Homepage</Button>
          </Link>
          <Link href="/student/applications" className="block">
            <Button variant="outline" className="w-full">
              View Applications
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact support or check our documentation.</p>
        </div>
      </div>
    </div>
  );
}