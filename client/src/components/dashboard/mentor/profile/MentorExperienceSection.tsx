// Mentor Experience Section Component
// Display and edit mentor experience

'use client';

import { useState } from 'react';

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export function MentorExperienceSection() {
  const [experiences] = useState<Experience[]>([
    {
      id: '1',
      company: 'Google',
      position: 'Senior Software Engineer',
      duration: '2020 - Present',
      description: 'Led development of large-scale web applications'
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'Software Engineer',
      duration: '2018 - 2020',
      description: 'Developed cloud-based solutions'
    }
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Experience</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm">Add Experience</button>
      </div>
      
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{exp.position}</h4>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration}</p>
                <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}