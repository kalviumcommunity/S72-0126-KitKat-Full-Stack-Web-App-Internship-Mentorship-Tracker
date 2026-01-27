// Features Overview Component
// Tabbed interface showing features for different user types

'use client';

import { useState } from 'react';

export function FeaturesOverview() {
  const [activeTab, setActiveTab] = useState('students');

  const tabs = [
    { id: 'students', label: 'For Students', icon: '🎓' },
    { id: 'mentors', label: 'For Mentors', icon: '👨‍🏫' },
    { id: 'companies', label: 'For Companies', icon: '🏢' }
  ];

  const features = {
    students: [
      {
        icon: '📊',
        title: 'Application Tracker with Status Pipeline',
        description: 'Visualize your entire application journey with our intuitive pipeline view. Track deadlines, follow-ups, and never miss an opportunity.'
      },
      {
        icon: '💡',
        title: 'Personalized Mentor Matching',
        description: 'Get matched with industry professionals based on your goals, interests, and career aspirations for targeted guidance.'
      },
      {
        icon: '📈',
        title: 'Progress Analytics & Insights',
        description: 'Understand your application patterns, success rates, and areas for improvement with detailed analytics and insights.'
      },
      {
        icon: '📝',
        title: 'Feedback History & Growth Tracking',
        description: 'Keep track of all mentor feedback and see your growth over time with our comprehensive feedback management system.'
      },
      {
        icon: '🎯',
        title: 'Goal Setting & Reminders',
        description: 'Set career goals, application targets, and get intelligent reminders to keep you on track for success.'
      }
    ],
    mentors: [
      {
        icon: '👥',
        title: 'Student Portfolio Browser',
        description: 'Browse and discover talented students based on skills, interests, and career goals. Find the perfect mentees to guide.'
      },
      {
        icon: '⭐',
        title: 'Structured Feedback Templates',
        description: 'Use our proven feedback templates to provide consistent, actionable guidance that helps students improve effectively.'
      },
      {
        icon: '📅',
        title: 'Session Scheduling',
        description: 'Seamlessly schedule and manage mentorship sessions with integrated calendar and reminder systems.'
      },
      {
        icon: '📊',
        title: 'Impact Dashboard',
        description: 'Track your mentoring impact with detailed analytics showing student progress and success metrics.'
      },
      {
        icon: '🏆',
        title: 'Recognition & Badges',
        description: 'Earn recognition for your mentoring contributions and build your reputation in the professional community.'
      }
    ],
    companies: [
      {
        icon: '📢',
        title: 'Post Internship Opportunities',
        description: 'Create and manage internship postings with detailed requirements, benefits, and application processes.'
      },
      {
        icon: '👔',
        title: 'Applicant Management',
        description: 'Efficiently manage and review applications with our streamlined candidate evaluation and communication tools.'
      },
      {
        icon: '📊',
        title: 'Hiring Pipeline Analytics',
        description: 'Track your hiring funnel performance, time-to-hire metrics, and optimize your recruitment process.'
      },
      {
        icon: '🎯',
        title: 'Targeted Student Outreach',
        description: 'Reach qualified candidates based on skills, experience, and interests with our intelligent matching system.'
      },
      {
        icon: '💼',
        title: 'Employer Branding Tools',
        description: 'Showcase your company culture, values, and opportunities to attract top talent and build your employer brand.'
      }
    ]
  };

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a student seeking opportunities, a mentor sharing expertise, or a company finding talent, we have the tools you need.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience These Features?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from our comprehensive platform. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}