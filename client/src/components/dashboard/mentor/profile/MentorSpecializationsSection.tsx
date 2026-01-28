// Mentor Specializations Section Component
// Display and edit mentor specializations

'use client';

import { useState } from 'react';

export function MentorSpecializationsSection() {
  const [specializations] = useState([
    'Software Engineering',
    'System Design',
    'Career Guidance',
    'Interview Preparation',
    'Technical Leadership'
  ]);

  const [skills] = useState([
    'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Specializations & Skills</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Technical Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}