// Pricing Section Component
// Three-tier pricing with feature comparison

'use client';

import { useState } from 'react';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Student',
      description: 'Perfect for students starting their internship journey',
      price: { monthly: 0, yearly: 0 },
      badge: 'Always Free',
      badgeColor: 'bg-green-100 text-green-800',
      features: [
        'Unlimited application tracking',
        'Basic mentor matching',
        'Progress analytics',
        'Resume feedback (2 per month)',
        'Community access',
        'Mobile app access'
      ],
      cta: 'Get Started Free',
      ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: false
    },
    {
      name: 'Pro Mentor',
      description: 'Enhanced features for professional mentors',
      price: { monthly: 9, yearly: 90 },
      badge: 'Most Popular',
      badgeColor: 'bg-blue-100 text-blue-800',
      features: [
        'Everything in Student plan',
        'Advanced student matching',
        'Unlimited feedback sessions',
        'Detailed impact analytics',
        'Priority support',
        'Mentor certification program',
        'Custom feedback templates',
        'Video session scheduling'
      ],
      cta: 'Start Pro Trial',
      ctaStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive solution for companies',
      price: { monthly: 'Custom', yearly: 'Custom' },
      badge: 'Contact Sales',
      badgeColor: 'bg-purple-100 text-purple-800',
      features: [
        'Everything in Pro plan',
        'Unlimited job postings',
        'Advanced candidate filtering',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced analytics & reporting',
        'SSO & security features'
      ],
      cta: 'Contact Sales',
      ctaStyle: 'bg-gray-900 text-white hover:bg-gray-800',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free and upgrade as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    {typeof plan.price[billingCycle as keyof typeof plan.price] === 'number' ? (
                      <>
                        <span className="text-5xl font-bold text-gray-900">
                          ${plan.price[billingCycle as keyof typeof plan.price]}
                        </span>
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                        {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            Save ${(plan.price.monthly * 12 - plan.price.yearly)} per year
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price[billingCycle as keyof typeof plan.price]}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.ctaStyle}`}>
                    {plan.cta}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-center mb-4">
                    What's included:
                  </h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Have questions about our pricing?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View FAQ
            </button>
            <span className="hidden sm:block text-gray-400">•</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Sales
            </button>
            <span className="hidden sm:block text-gray-400">•</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-2xl">🛡️</div>
              <h3 className="text-lg font-semibold text-green-800">
                30-Day Money-Back Guarantee
              </h3>
            </div>
            <p className="text-green-700">
              Try UIMP risk-free. If you're not completely satisfied within 30 days, we'll refund your money, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}