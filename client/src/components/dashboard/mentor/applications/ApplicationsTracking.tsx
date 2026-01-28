// Applications Tracking Component
// Track application progress and status

'use client';

import { useState } from 'react';

export function ApplicationsTracking() {
  const [applications] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      company: 'Google',
      position: 'Software Engineer Intern',
      status: 'Interview',
      progress: 75,
      lastUpdate: '2024-01-15'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      company: 'Microsoft',
      position: 'Product Manager Intern',
      status: 'Applied',
      progress: 25,
      lastUpdate: '2024-01-14'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Application Tracking</h2>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {applications.map((application) => (
            <div key={application.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {application.studentName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {application.company} - {application.position}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{application.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${application.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Last updated: {new Date(application.lastUpdate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}