// Mentor Stats Section Component
// Display mentor statistics and metrics

'use client';

import { useState } from 'react';

export function MentorStatsSection() {
  const [stats] = useState({
    totalStudents: 45,
    activeSessions: 12,
    completedSessions: 156,
    averageRating: 4.8,
    responseTime: '2 hours',
    successRate: 89
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Mentoring Statistics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeSessions}</div>
          <div className="text-sm text-gray-600">Active Sessions</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.completedSessions}</div>
          <div className="text-sm text-gray-600">Completed Sessions</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.responseTime}</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>
    </div>
  );
}