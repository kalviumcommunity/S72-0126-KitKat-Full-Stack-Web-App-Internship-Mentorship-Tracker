// How It Works Section Component
// Step-by-step process for different user types

'use client';

import { useState } from 'react';

export function HowItWorksSection() {
  const [activeFlow, setActiveFlow] = useState('students');

  const flows = {
    students: {
      title: 'How Students Succeed',
      steps: [
        {
          number: 1,
          title: 'Sign up & create profile',
          description: 'Create your account and build a comprehensive profile showcasing your skills, interests, and career goals.',
          icon: '👤'
        },
        {
          number: 2,
          title: 'Track applications',
          description: 'Add your internship applications and let our system help you organize and track their progress.',
          icon: '📊'
        },
        {
          number: 3,
          title: 'Get matched with mentors',
          description: 'Our AI matches you with experienced professionals who can provide personalized guidance.',
          icon: '🤝'
        },
        {
          number: 4,
          title: 'Receive feedback',
          description: 'Get actionable feedback on your applications, resume, and interview skills from industry experts.',
          icon: '💡'
        },
        {
          number: 5,
          title: 'Land your dream internship',
          description: 'Apply the insights and improvements to secure the internship opportunity you\'ve been working towards.',
          icon: '🎯'
        }
      ]
    },
    mentors: {
      title: 'How Mentors Make Impact',
      steps: [
        {
          number: 1,
          title: 'Create expert profile',
          description: 'Showcase your experience, expertise, and the areas where you can provide valuable guidance to students.',
          icon: '⭐'
        },
        {
          number: 2,
          title: 'Set availability',
          description: 'Define your schedule and preferences for mentoring sessions that work with your busy professional life.',
          icon: '📅'
        },
        {
          number: 3,
          title: 'Browse students',
          description: 'Discover talented students whose goals align with your expertise and passion for mentoring.',
          icon: '👥'
        },
        {
          number: 4,
          title: 'Provide feedback',
          description: 'Share your knowledge through structured feedback, resume reviews, and career guidance sessions.',
          icon: '📝'
        },
        {
          number: 5,
          title: 'Make an impact',
          description: 'Watch your mentees grow and succeed while building your reputation as a trusted industry mentor.',
          icon: '🏆'
        }
      ]
    },
    companies: {
      title: 'How Companies Find Talent',
      steps: [
        {
          number: 1,
          title: 'Create company profile',
          description: 'Build an attractive company profile that showcases your culture, values, and internship opportunities.',
          icon: '🏢'
        },
        {
          number: 2,
          title: 'Post opportunities',
          description: 'Create detailed internship postings with requirements, benefits, and application processes.',
          icon: '📢'
        },
        {
          number: 3,
          title: 'Review applicants',
          description: 'Use our streamlined tools to efficiently review and evaluate candidate applications.',
          icon: '👔'
        },
        {
          number: 4,
          title: 'Track pipeline',
          description: 'Monitor your hiring funnel with analytics and insights to optimize your recruitment process.',
          icon: '📈'
        },
        {
          number: 5,
          title: 'Hire top talent',
          description: 'Successfully onboard exceptional interns who will contribute to your team and company growth.',
          icon: '✨'
        }
      ]
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, effective processes designed for success. Choose your path and see how easy it is to get started.
          </p>
        </div>

        {/* Flow Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-xl p-2">
            <div className="flex space-x-2">
              {Object.entries(flows).map(([key, flow]) => (
                <button
                  key={key}
                  onClick={() => setActiveFlow(key)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeFlow === key
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {flow.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 transform -translate-y-1/2"></div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {flows[activeFlow as keyof typeof flows].steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-blue-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="text-center mb-4 mt-4">
                    <div className="text-4xl mb-2">{step.icon}</div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow (Desktop) */}
                {index < flows[activeFlow as keyof typeof flows].steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their career journey with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Your Journey
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}