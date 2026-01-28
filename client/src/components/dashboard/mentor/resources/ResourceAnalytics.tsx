// Resource Analytics Component
// Analytics for resource usage and engagement

'use client';

import { useState } from 'react';

export function ResourceAnalytics() {
  const [analytics] = useState({
    totalResources: 25,
    totalViews: 1250,
    totalDownloads: 890,
    averageRating: 4.6,
    topResources: [
      { name: 'Resume Template', views: 245, downloads: 189 },
      { name: 'Interview Guide', views: 198, downloads: 156 },
      { name: 'Coding Patterns', views: 167, downloads: 134 }
    ],
    monthlyStats: [
      { month: 'Jan', views: 450, downloads: 320 },
      { month: 'Feb', views: 520, downloads: 380 },
      { month: 'Mar', views: 280, downloads: 190 }
    ]
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Resource Analytics</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalResources}</div>
          <div className="text-sm text-gray-600">Total Resources</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{analytics.totalViews}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{analytics.totalDownloads}</div>
          <div className="text-sm text-gray-600">Total Downloads</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{analytics.averageRating}</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
      </div>

      {/* Top Resources */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-medium text-gray-900 mb-4">Top Performing Resources</h4>
        <div className="space-y-3">
          {analytics.topResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="font-medium text-gray-900">{resource.name}</div>
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>{resource.views} views</span>
                <span>{resource.downloads} downloads</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="font-medium text-gray-900 mb-4">Monthly Trends</h4>
        <div className="space-y-3">
          {analytics.monthlyStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="font-medium text-gray-900">{stat.month}</div>
              <div className="flex space-x-4 text-sm">
                <span className="text-blue-600">{stat.views} views</span>
                <span className="text-green-600">{stat.downloads} downloads</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}