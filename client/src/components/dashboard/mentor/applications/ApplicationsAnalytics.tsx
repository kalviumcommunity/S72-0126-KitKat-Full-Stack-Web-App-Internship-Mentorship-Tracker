// Applications Analytics Component
// Analytics and insights for applications

'use client';

import { useState } from 'react';

export function ApplicationsAnalytics() {
  const [analytics] = useState({
    totalApplications: 127,
    successRate: 78,
    averageResponseTime: 5.2,
    topCompanies: [
      { name: 'Google', applications: 25, successRate: 80 },
      { name: 'Microsoft', applications: 20, successRate: 75 },
      { name: 'Amazon', applications: 18, successRate: 70 }
    ],
    monthlyTrend: [
      { month: 'Jan', applications: 15, offers: 12 },
      { month: 'Feb', applications: 20, offers: 16 },
      { month: 'Mar', applications: 25, offers: 20 }
    ]
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Application Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalApplications}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{analytics.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{analytics.averageResponseTime} days</div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Companies</h3>
        <div className="space-y-3">
          {analytics.topCompanies.map((company, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{company.name}</div>
                <div className="text-sm text-gray-600">{company.applications} applications</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">{company.successRate}%</div>
                <div className="text-sm text-gray-600">success rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trend</h3>
        <div className="space-y-3">
          {analytics.monthlyTrend.map((month, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="font-medium text-gray-900">{month.month}</div>
              <div className="flex space-x-4">
                <div className="text-sm">
                  <span className="text-blue-600">{month.applications}</span> applications
                </div>
                <div className="text-sm">
                  <span className="text-green-600">{month.offers}</span> offers
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}