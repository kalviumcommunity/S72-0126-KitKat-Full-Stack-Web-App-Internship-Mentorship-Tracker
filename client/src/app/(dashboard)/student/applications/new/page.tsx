// New Application Page - Server Component with Client Form
// Allows students to create new internship applications

import { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'New Application - UIMP',
  description: 'Create a new internship application',
};

export default function NewApplicationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
          <p className="text-gray-600 mt-1">
            Create a new internship application
          </p>
        </div>
        <Link href="/student/applications">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ApplicationForm />
      </div>
    </div>
  );
}