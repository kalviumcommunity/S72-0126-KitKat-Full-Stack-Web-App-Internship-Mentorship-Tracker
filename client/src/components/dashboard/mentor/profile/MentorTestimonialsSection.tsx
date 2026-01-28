// Mentor Testimonials Section Component
// Display student testimonials and reviews

'use client';

import { useState } from 'react';

interface Testimonial {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export function MentorTestimonialsSection() {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: '1',
      studentName: 'Sarah Chen',
      rating: 5,
      comment: 'Excellent mentor! Helped me land my dream internship at Google.',
      date: '2024-01-15'
    },
    {
      id: '2',
      studentName: 'Mike Johnson',
      rating: 5,
      comment: 'Great guidance on system design concepts. Highly recommended!',
      date: '2024-01-10'
    },
    {
      id: '3',
      studentName: 'Emily Rodriguez',
      rating: 4,
      comment: 'Very knowledgeable and patient. Helped improve my coding skills.',
      date: '2024-01-08'
    }
  ]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Student Testimonials</h3>
      
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {testimonial.studentName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.studentName}</div>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(testimonial.date).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-700 text-sm">{testimonial.comment}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm">View All Reviews</button>
      </div>
    </div>
  );
}