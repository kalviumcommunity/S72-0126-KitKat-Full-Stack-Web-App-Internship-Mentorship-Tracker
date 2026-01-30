// Header component - Server Component with Client interactions
// Navigation header for dashboard layout

import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { NotificationBell } from '@/components/features/notifications/NotificationBell';

export function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-2xl sticky top-0 z-50 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-light text-black tracking-wide">UIMP</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <Link
              href="/student"
              className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-black/5"
            >
              Dashboard
            </Link>
            <Link
              href="/student/applications"
              className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-black/5"
            >
              Applications
            </Link>
            <Link
              href="/student/feedback"
              className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-black/5"
            >
              Feedback
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}