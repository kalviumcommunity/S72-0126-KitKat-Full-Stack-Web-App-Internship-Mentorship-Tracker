// Application Pipeline Component
// Horizontal Kanban-style board with drag & drop functionality

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ApplicationPipeline() {
  const [applications] = useState({
    applied: [
      { id: 1, company: 'Google', position: 'SWE Intern', date: '2024-01-15', color: 'bg-blue-500' },
      { id: 2, company: 'Microsoft', position: 'PM Intern', date: '2024-01-14', color: 'bg-green-500' },
      { id: 3, company: 'Apple', position: 'iOS Intern', date: '2024-01-13', color: 'bg-gray-500' },
      { id: 4, company: 'Meta', position: 'Frontend Intern', date: '2024-01-12', color: 'bg-blue-600' },
      { id: 5, company: 'Netflix', position: 'Data Intern', date: '2024-01-11', color: 'bg-red-500' }
    ],
    screening: [
      { id: 6, company: 'Amazon', position: 'SDE Intern', date: '2024-01-10', color: 'bg-orange-500' },
      { id: 7, company: 'Tesla', position: 'ML Intern', date: '2024-01-09', color: 'bg-red-600' },
      { id: 8, company: 'Spotify', position: 'Backend Intern', date: '2024-01-08', color: 'bg-green-600' }
    ],
    interview: [
      { id: 9, company: 'Stripe', position: 'Fullstack Intern', date: '2024-01-07', color: 'bg-purple-500' },
      { id: 10, company: 'Airbnb', position: 'Product Intern', date: '2024-01-06', color: 'bg-pink-500' }
    ],
    offer: [
      { id: 11, company: 'Uber', position: 'Growth Intern', date: '2024-01-05', color: 'bg-black' }
    ],
    rejected: [
      { id: 12, company: 'Snapchat', position: 'Design Intern', date: '2024-01-04', color: 'bg-yellow-500' },
      { id: 13, company: 'TikTok', position: 'Analytics Intern', date: '2024-01-03', color: 'bg-gray-700' }
    ]
  });

  const stages = [
    { id: 'applied', title: 'Applied', count: applications.applied.length, color: 'bg-blue-100 text-blue-800' },
    { id: 'screening', title: 'Screening', count: applications.screening.length, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'interview', title: 'Interview', count: applications.interview.length, color: 'bg-purple-100 text-purple-800' },
    { id: 'offer', title: 'Offer', count: applications.offer.length, color: 'bg-green-100 text-green-800' },
    { id: 'rejected', title: 'Rejected', count: applications.rejected.length, color: 'bg-red-100 text-red-800' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Application Pipeline</h2>
          <Badge className="bg-gray-100 text-gray-700">
            {Object.values(applications).flat().length} Total Applications
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                <Badge className={stage.color}>
                  {stage.count}
                </Badge>
              </div>

              {/* Applications List */}
              <div className="space-y-3 min-h-[200px] bg-gray-50 rounded-lg p-3">
                {applications[stage.id as keyof typeof applications].map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full ${app.color} flex-shrink-0 mt-1`}></div>
                      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">
                      {app.company}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {app.position}
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(app.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}

                {/* Add New Application Button */}
                {stage.id === 'applied' && (
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <span>➕</span>
                      <span>Add Application</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Pipeline Health:</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Strong conversion rate</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Success Rate: <span className="font-semibold text-green-600">23%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}