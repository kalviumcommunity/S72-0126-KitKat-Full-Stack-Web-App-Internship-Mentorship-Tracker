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
      icon: '🎓',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: 500,
      suffix: '+',
      label: 'Partner Companies',
      description: 'Companies posting internship opportunities and finding talent',
      icon: '🏢',
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: 2000,
      suffix: '+',
      label: 'Expert Mentors',
      description: 'Industry professionals providing guidance and feedback',
      icon: '👨‍🏫',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: 85,
      suffix: '%',
      label: 'Placement Success Rate',
      description: 'Students who successfully secured internships through our platform',
      icon: '🎯',
      color: 'from-orange-500 to-red-500'
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
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
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
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Growing Every Day
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our community continues to expand as more students discover the power of structured internship tracking and professional mentorship.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>New students join daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Active mentorship sessions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Companies hiring through UIMP</span>
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
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
        {/* Icon */}
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {stat.icon}
        </div>

        {/* Number */}
        <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
          {count.toLocaleString()}{stat.suffix}
        </div>

        {/* Label */}
        <div className="text-xl font-semibold text-white mb-3">
          {stat.label}
        </div>

        {/* Description */}
        <div className="text-blue-200 text-sm leading-relaxed">
          {stat.description}
        </div>
      </div>
    </div>
  );
}