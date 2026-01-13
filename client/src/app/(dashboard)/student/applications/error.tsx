'use client';

// Error boundary for applications page

import { useEffect } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface ApplicationsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ApplicationsError({ error, reset }: ApplicationsErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Applications page error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an error while loading your applications. This might be a temporary issue.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full"
            >
              Try Again
            </Button>
            
            <Link href="/student/dashboard" className="block">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error.message}
                {error.stack && '\n\n' + error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}