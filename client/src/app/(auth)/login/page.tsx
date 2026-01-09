// Login page - Server Component with Client Component form
// Handles user authentication

import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Login - UIMP',
  description: 'Login to your UIMP account',
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <LoginForm />

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/signup" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}