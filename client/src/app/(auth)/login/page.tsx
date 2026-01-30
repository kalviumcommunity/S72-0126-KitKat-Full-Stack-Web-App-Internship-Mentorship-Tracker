// Login page - Server Component with Client Component form
// Handles user authentication

import { Metadata } from 'next';
import Link from 'next/link';
import { LoginFormWithQuickFill } from '@/components/forms/LoginFormWithQuickFill';

export const metadata: Metadata = {
  title: 'Login - UIMP',
  description: 'Login to your UIMP account',
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">
          Sign in
        </h1>
        <p className="text-slate-600 text-base">
          Welcome back to your account
        </p>
      </div>

      {/* Form */}
      <LoginFormWithQuickFill />

      {/* Footer */}
      <div className="text-center space-y-4">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link 
            href="/signup" 
            className="font-medium text-slate-900 hover:text-slate-700 transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-slate-500"
          >
            Create one here
          </Link>
        </p>
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 leading-relaxed">
            Demo mode is active. Use the provided credentials above to explore the platform.
          </p>
        </div>
      </div>
    </div>
  );
}