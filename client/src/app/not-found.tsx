// 404 Not Found page - Server Component
// Handles routes that don't exist

import Link from 'next/link';
import { Metadata } from 'next/types';

import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '404 - Page Not Found | UIMP',
  description: 'The page you are looking for does not exist.',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-blue-600 text-8xl font-bold mb-4">404</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Helpful links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign Up
            </Link>
            <Link 
              href="/about" 
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}