// FAQ Section Component
// Accordion-style frequently asked questions

'use client';

import { useState } from 'react';

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is UIMP?",
      answer: "UIMP (Unified Internship & Mentorship Portal) is a comprehensive platform that connects students, mentors, and companies to streamline the internship process. Students can track applications and receive mentorship, mentors can guide the next generation, and companies can find exceptional talent."
    },
    {
      question: "How does the mentorship work?",
      answer: "Our AI-powered matching system connects students with industry professionals based on career goals, interests, and expertise areas. Mentors provide structured feedback through our platform, including resume reviews, interview preparation, and career guidance through scheduled sessions and ongoing communication."
    },
    {
      question: "Is UIMP really free for students?",
      answer: "Yes! Our Student plan is completely free and includes unlimited application tracking, basic mentor matching, progress analytics, and community access. We believe every student should have access to career guidance and internship opportunities regardless of their financial situation."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is simple! Create your free account, complete your profile with your skills and career interests, and start tracking your internship applications. Our system will automatically match you with relevant mentors and opportunities based on your profile."
    },
    {
      question: "What makes UIMP different from other platforms?",
      answer: "UIMP uniquely combines application tracking, professional mentorship, and company connections in one platform. Our structured feedback system, AI-powered matching, and focus on long-term career development set us apart from generic job boards or networking sites."
    },
    {
      question: "Can companies post internship opportunities for free?",
      answer: "Companies can start with our basic posting features, but our Enterprise plan offers advanced candidate filtering, custom branding, analytics, and dedicated support. Contact our sales team to discuss the best option for your hiring needs."
    },
    {
      question: "How do you ensure the quality of mentors?",
      answer: "All mentors go through a verification process where we confirm their professional experience and expertise. We also have a rating system and regular feedback collection to maintain high-quality mentorship standards across our platform."
    },
    {
      question: "Is my data secure on UIMP?",
      answer: "Absolutely. We use enterprise-grade security measures including data encryption, secure servers, and regular security audits. We're GDPR compliant and never share your personal information without your explicit consent."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Pro Mentor subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period, and you can always reactivate later."
    },
    {
      question: "Do you offer customer support?",
      answer: "We provide comprehensive support through multiple channels including email, live chat, and our help center. Pro Mentor and Enterprise users receive priority support with faster response times and dedicated account management."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 transition-transform duration-300 ${
                  openFAQ === index ? 'transform rotate-180' : ''
                }`}>
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${
                openFAQ === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              } overflow-hidden`}>
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Schedule Call
              </button>
            </div>
          </div>
        </div>

        {/* Help Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-3xl mb-3">📚</div>
            <h4 className="font-semibold text-gray-900 mb-2">Help Center</h4>
            <p className="text-gray-600 text-sm mb-4">
              Browse our comprehensive guides and tutorials
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Visit Help Center →
            </button>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-3xl mb-3">💬</div>
            <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help from our support team
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Start Chat →
            </button>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-3xl mb-3">👥</div>
            <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
            <p className="text-gray-600 text-sm mb-4">
              Connect with other users and share experiences
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Join Community →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}