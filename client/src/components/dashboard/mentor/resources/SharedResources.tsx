// Shared Resources Component
// Resources shared with students

'use client';

import { useState } from 'react';

interface SharedResource {
  id: string;
  title: string;
  sharedWith: string[];
  sharedAt: string;
  views: number;
  downloads: number;
}

export function SharedResources() {
  const [sharedResources] = useState<SharedResource[]>([
    {
      id: '1',
      title: 'Resume Template for Software Engineers',
      sharedWith: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      sharedAt: '2024-01-15',
      views: 25,
      downloads: 18
    },
    {
      id: '2',
      title: 'System Design Interview Guide',
      sharedWith: ['Sarah Chen', 'Alex Wilson'],
      sharedAt: '2024-01-12',
      views: 15,
      downloads: 12
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Shared Resources</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm">
          Share New Resource
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {sharedResources.map((resource) => (
            <div key={resource.id} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>{resource.views} views</span>
                  <span>{resource.downloads} downloads</span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  Shared with {resource.sharedWith.length} students:
                </p>
                <div className="flex flex-wrap gap-2">
                  {resource.sharedWith.map((student, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {student}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Shared on {new Date(resource.sharedAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">
                    Manage Access
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}