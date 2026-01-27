// Final CTA Section Component
// Role selection and final call-to-action

'use client';

import Link from 'next/link';

export function FinalCTASection() {
  const roles = [
    {
      id: 'student',
      title: "I'm a Student",
      description: 'Track applications, get mentored, and land your dream internship',
      icon: '🎓',
      benefits: ['Free forever', 'Unlimited tracking', 'Expert mentorship'],
      ctaText: 'Start Free',
      ctaLink: '/signup?role=student',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'mentor',
      title: "I'm a Mentor",
      description: 'Guide the next generation and make a meaningful impact',
      icon: '👨‍🏫',
      benefits: ['Flexible scheduling', 'Impact tracking', 'Recognition system'],
      ctaText: 'Become a Mentor',
      ctaLink: '/signup?role=mentor',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'company',
      title: "I'm a Company",
      description: 'Find exceptional talent and streamline your hiring process',
      icon: '🏢',
      benefits: ['Quality candidates', 'Efficient pipeline', 'Custom branding'],
      ctaText: 'Hire Talent',
      ctaLink: '/signup?role=company',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of students, mentors, and companies who are already transforming their careers and hiring processes with UIMP.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-blue-200 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>10,000+ Active Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>500+ Companies</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>85% Success Rate</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              {/* Icon */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {role.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {role.title}
                </h3>
                <p className="text-blue-100">
                  {role.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {role.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-blue-100 text-sm">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link href={role.ctaLink}>
                <button className={`w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${role.gradient} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  {role.ctaText}
                </button>
              </Link>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Quick Signup Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Or Get Started Right Now
            </h3>
            <p className="text-blue-100">
              Enter your email to create your free account in seconds
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
          </form>

          <p className="text-xs text-blue-200 text-center mt-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-16">
          <p className="text-blue-200 mb-6">
            Trusted by students and professionals at:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['🔍 Google', '🪟 Microsoft', '🍎 Apple', '📦 Amazon', '📘 Meta'].map((company, index) => (
              <div key={index} className="text-white text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}