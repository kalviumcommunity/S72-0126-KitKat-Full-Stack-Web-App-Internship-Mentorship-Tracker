// Authentication layout for login/signup pages
// Server Component - handles layout for auth routes

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - UIMP',
  description: 'Login or signup to access the Unified Internship & Mentorship Portal',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding/Visual */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-stone-900"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-light mb-6 tracking-tight">
                Welcome to <span className="font-medium">UIMP</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed">
                Your gateway to meaningful internships and mentorship opportunities.
              </p>
              <div className="mt-12 space-y-4 text-slate-400">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-sm">Connect with industry mentors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-sm">Track your applications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  <span className="text-sm">Build your career path</span>
                </div>
              </div>
            </div>
          </div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}