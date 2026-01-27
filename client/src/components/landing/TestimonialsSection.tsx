// Testimonials Section Component
// Carousel with success stories and testimonials

'use client';

import { useState, useEffect } from 'react';

export function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      type: 'student',
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      company: 'Now at Google',
      image: '/api/placeholder/80/80',
      quote: "UIMP completely transformed my internship search. The mentor feedback helped me improve my resume, and I landed my dream internship at Google! The application tracking feature kept me organized throughout the entire process.",
      rating: 5,
      achievement: 'Got dream internship at Google'
    },
    {
      type: 'mentor',
      name: 'David Rodriguez',
      role: 'Senior Software Engineer',
      company: 'Microsoft',
      image: '/api/placeholder/80/80',
      quote: "Mentoring through UIMP has been incredibly fulfilling. The platform makes it easy to provide structured feedback and track student progress. I've helped over 20 students land internships, and seeing their growth is amazing.",
      rating: 5,
      achievement: 'Mentored 20+ successful students'
    },
    {
      type: 'company',
      name: 'Lisa Park',
      role: 'Talent Acquisition Manager',
      company: 'Stripe',
      image: '/api/placeholder/80/80',
      quote: "UIMP has streamlined our internship hiring process significantly. We found exceptional talent quickly, and the quality of candidates has been outstanding. The platform's analytics help us optimize our recruitment strategy.",
      rating: 5,
      achievement: 'Hired 15 exceptional interns'
    },
    {
      type: 'student',
      name: 'Marcus Johnson',
      role: 'Business Student',
      company: 'Now at Amazon',
      image: '/api/placeholder/80/80',
      quote: "The mentorship I received through UIMP was game-changing. My mentor helped me understand what companies look for and guided me through interview preparation. I'm now interning at Amazon thanks to their support!",
      rating: 5,
      achievement: 'Secured Amazon internship'
    },
    {
      type: 'mentor',
      name: 'Jennifer Wu',
      role: 'Product Manager',
      company: 'Meta',
      image: '/api/placeholder/80/80',
      quote: "I love being able to give back to the next generation through UIMP. The structured feedback system ensures students get actionable advice, and I can see the real impact of my mentoring on their career journeys.",
      rating: 5,
      achievement: 'Top-rated mentor for 2 years'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student': return 'from-blue-500 to-cyan-500';
      case 'mentor': return 'from-green-500 to-emerald-500';
      case 'company': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return '🎓';
      case 'mentor': return '👨‍🏫';
      case 'company': return '🏢';
      default: return '👤';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from students, mentors, and companies who have transformed their careers and hiring processes with UIMP.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl mx-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      {/* Quote */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start space-x-4 mb-6">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(testimonial.type)} rounded-full flex items-center justify-center text-white text-xl`}>
                            {getTypeIcon(testimonial.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                              {testimonial.type} Success Story
                            </div>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTypeColor(testimonial.type)} text-white mt-1`}>
                              {testimonial.achievement}
                            </div>
                          </div>
                        </div>

                        <blockquote className="text-xl text-gray-700 leading-relaxed mb-6">
                          "{testimonial.quote}"
                        </blockquote>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Profile */}
                      <div className="text-center lg:text-left">
                        <div className="relative inline-block">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto lg:mx-0 mb-4 flex items-center justify-center text-3xl">
                            {getTypeIcon(testimonial.type)}
                          </div>
                          <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r ${getTypeColor(testimonial.type)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                            ✓
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 mb-1">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Video Testimonials CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to See More Success Stories?
            </h3>
            <p className="text-gray-600 mb-6">
              Watch video testimonials from our community members and see how UIMP has transformed their careers.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Watch Video Testimonials
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}