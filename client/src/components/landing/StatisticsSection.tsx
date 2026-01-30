// Statistics Section Component
// Animated counters showing platform success metrics

'use client';

import { useEffect, useState, useRef } from 'react';

export function StatisticsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      number: 10000,
      suffix: '+',
      label: 'Active Students',
      description: 'Students actively using our platform to track their internship journey',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      number: 500,
      suffix: '+',
      label: 'Partner Companies',
      description: 'Companies posting internship opportunities and finding talent',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      number: 2000,
      suffix: '+',
      label: 'Expert Mentors',
      description: 'Industry professionals providing guidance and feedback',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      number: 85,
      suffix: '%',
      label: 'Placement Success Rate',
      description: 'Students who successfully secured internships through our platform',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-black relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 tracking-tight">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our platform has helped thousands of students, mentors, and companies achieve their goals. Here's the impact we've made together.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Additional Context */}
        <div className="mt-20 text-center">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white mb-6 tracking-tight">
              Growing Every Day
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our community continues to expand as more students discover the power of structured internship tracking and professional mentorship.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">New students join daily</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">Active mentorship sessions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">Companies hiring through UIMP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, isVisible, delay }: { 
  stat: any; 
  isVisible: boolean; 
  delay: number; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        const duration = 2000;
        const steps = 60;
        const increment = stat.number / steps;
        let current = 0;

        const counter = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            setCount(stat.number);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, stat.number, delay]);

  return (
    <div className="text-center group">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
        {/* Icon */}
        <div className="text-gray-300 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
          {stat.icon}
        </div>

        {/* Number */}
        <div className="text-4xl font-light text-white mb-2">
          {count.toLocaleString()}{stat.suffix}
        </div>

        {/* Label */}
        <div className="text-xl font-medium text-white mb-4">
          {stat.label}
        </div>

        {/* Description */}
        <div className="text-gray-400 text-sm leading-relaxed">
          {stat.description}
        </div>
      </div>
    </div>
  );
}