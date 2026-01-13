// Not found page for individual applications

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function ApplicationNotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The application you're looking for doesn't exist or may have been deleted.
          </p>
          
          <div className="space-y-3">
            <Link href="/student/applications" className="block">
              <Button className="w-full">
                View All Applications
              </Button>
            </Link>
            
            <Link href="/student/applications/new" className="block">
              <Button variant="outline" className="w-full">
                Create New Application
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}