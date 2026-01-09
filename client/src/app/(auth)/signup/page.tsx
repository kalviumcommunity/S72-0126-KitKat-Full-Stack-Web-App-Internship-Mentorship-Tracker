// Signup page - Server Component with Client Component form
// Handles user registration

import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/forms/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - UIMP',
  description: 'Create your UIMP account',
};

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
        <p className="text-gray-600 mt-2">Join the UIMP community</p>
      </div>

      <SignupForm />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}