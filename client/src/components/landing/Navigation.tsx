// Navigation Component for Landing Page
// Modern navigation with logo and CTA buttons

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/70 backdrop-blur-3xl sticky top-0 z-50 border-b border-white/20 shadow-lg shadow-black/5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-black/20 backdrop-blur-sm">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <span className="text-xl font-light text-black tracking-wide drop-shadow-sm">UIMP</span>
              <div className="text-xs text-gray-500 -mt-1 font-medium">Unified Internship & Mentorship Portal</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 relative z-10">
            <Link href="#features" className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-black px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm">
              About
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3 relative z-10">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-black rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm transition-all duration-300">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-lg px-6 shadow-lg shadow-black/20 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/30">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-black focus:outline-none p-2 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-6 bg-white/50 backdrop-blur-2xl rounded-b-2xl shadow-lg shadow-black/10 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-b-2xl"></div>
            <div className="flex flex-col space-y-4 relative z-10">
              <Link href="#features" className="text-gray-600 hover:text-black transition-all duration-300 py-2 px-2 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-black transition-all duration-300 py-2 px-2 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-black transition-all duration-300 py-2 px-2 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-black transition-all duration-300 py-2 px-2 rounded-lg hover:bg-white/30 hover:backdrop-blur-sm">
                About
              </Link>
              <div className="flex flex-col space-y-3 pt-6 border-t border-white/20">
                <Link href="/login">
                  <Button variant="outline" className="w-full rounded-lg bg-white/30 backdrop-blur-sm border-white/30 hover:bg-white/40 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black rounded-lg shadow-lg shadow-black/20 backdrop-blur-sm border border-white/10 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}