// Login Form with Quick Fill - Client Component
// Combines the login form with demo credentials and quick fill buttons

'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';

export function LoginFormWithQuickFill() {
  const [isClient, setIsClient] = useState(false);

  // Ensure this only renders on the client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-8">
        {/* Placeholder during SSR */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <h3 className="text-sm font-medium text-slate-900">Demo Accounts</h3>
          </div>
          <div className="animate-pulse">
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-40 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Demo Credentials */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          <h3 className="text-sm font-medium text-slate-900">Demo Accounts</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-slate-900">Student</span>
            </div>
            <div className="text-slate-600 space-y-1 text-xs">
              <p>user1@gmail.com</p>
              <p>user2@gmail.com</p>
              <p className="font-medium">Password: User@12345</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-medium text-slate-900">Mentor</span>
            </div>
            <div className="text-slate-600 space-y-1 text-xs">
              <p>mentor1@gmail.com</p>
              <p>mentor2@gmail.com</p>
              <p className="font-medium">Password: Mentor@12345</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium text-slate-900">Company</span>
            </div>
            <div className="text-slate-600 space-y-1 text-xs">
              <p>company1@gmail.com</p>
              <p>company2@gmail.com</p>
              <p className="font-medium">Password: Company@12345</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-slate-900">Admin</span>
            </div>
            <div className="text-slate-600 space-y-1 text-xs">
              <p>admin@gmail.com</p>
              <p className="font-medium">Password: Admin@12345</p>
            </div>
          </div>
        </div>
        
        {/* Quick Fill Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-3">Quick access:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'user1@gmail.com', password: 'User@12345' }
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              suppressHydrationWarning
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'mentor1@gmail.com', password: 'Mentor@12345' }
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              suppressHydrationWarning
            >
              Mentor
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'company1@gmail.com', password: 'Company@12345' }
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              suppressHydrationWarning
            >
              Company
            </button>
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('quickFillCredentials', {
                  detail: { email: 'admin@gmail.com', password: 'Admin@12345' }
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              suppressHydrationWarning
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <LoginForm />
    </div>
  );
}