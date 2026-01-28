// Resource Library Component
// Browse and manage mentor resources

'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'template';
  category: string;
  description: string;
  url: string;
  createdAt: string;
  downloads: number;
}

export function ResourceLibrary() {
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Resume Template for Software Engineers',
      type: 'template',
      category: 'Career',
      description: 'Professional resume template optimized for tech roles',
      url: '/resources/resume-template.pdf',
      createdAt: '2024-01-15',
      downloads: 45
    },
    {
      id: '2',
      title: 'System Design Interview Guide',
      type: 'document',
      category: 'Interview Prep',
      description: 'Comprehensive guide for system design interviews',
      url: '/resources/system-design-guide.pdf',
      createdAt: '2024-01-10',
      downloads: 78
    },
    {
      id: '3',
      title: 'Coding Interview Patterns',
      type: 'video',
      category: 'Interview Prep',
      description: 'Video series covering common coding patterns',
      url: 'https://youtube.com/watch?v=example',
      createdAt: '2024-01-08',
      downloads: 123
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Career', 'Interview Prep', 'Technical Skills', 'Soft Skills'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'template': return '📋';
      default: return '📁';
    }
  };

  const filteredResources = resources.filter(resource => 
    selectedCategory === 'All' || resource.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resource Library</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add Resource
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="text-2xl">{getTypeIcon(resource.type)}</div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {resource.category}
              </span>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{resource.downloads} downloads</span>
              <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700">
                View
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}