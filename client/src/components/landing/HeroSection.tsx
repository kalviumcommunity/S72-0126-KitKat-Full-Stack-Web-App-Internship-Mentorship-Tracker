// Hero Section Component
// Above-the-fold section with compelling headline and CTAs

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #000000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-10">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-black leading-tight tracking-tight">
                Your Journey from{' '}
                <span className="font-normal">
                  Campus to Career
                </span>{' '}
                Starts Here
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Track internships, connect with mentors, and build meaningful relationships. Join thousands of students, mentors, and companies shaping the future together.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <span className="font-medium">10,000+ students</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <span className="font-medium">500+ companies</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                <span className="font-medium">2,000+ mentors</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg bg-black hover:bg-gray-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#demo">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg border-gray-200 hover:bg-gray-50 rounded-lg transition-all duration-300"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start">
              <button className="flex items-center space-x-3 text-gray-600 hover:text-black transition-colors group">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium">Watch Video (2 min)</span>
              </button>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 p-8 border border-black/5 transform hover:scale-105 transition-transform duration-500">
              {/* Mock Dashboard Preview */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full w-32"></div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 text-center border border-black/5">
                    <div className="text-2xl font-light text-black mb-1">12</div>
                    <div className="text-xs text-gray-600 font-medium">Applications</div>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 text-center border border-black/5">
                    <div className="text-2xl font-light text-black mb-1">3</div>
                    <div className="text-xs text-gray-600 font-medium">Interviews</div>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 text-center border border-black/5">
                    <div className="text-2xl font-light text-black mb-1">1</div>
                    <div className="text-xs text-gray-600 font-medium">Offers</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-black/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 bg-gray-300 rounded-lg"></div>
                      <div>
                        <div className="h-2.5 bg-gray-300 rounded-full w-20 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-16"></div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-black/10 text-black rounded-full text-xs font-medium">Interview</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-black/5">
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 bg-gray-300 rounded-lg"></div>
                      <div>
                        <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-black/10 text-black rounded-full text-xs font-medium">Applied</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-gray-100/50 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 bg-gray-100/50 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}