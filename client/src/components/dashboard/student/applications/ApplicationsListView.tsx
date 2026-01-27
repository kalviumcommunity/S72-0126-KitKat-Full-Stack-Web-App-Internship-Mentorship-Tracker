// Applications List View Component
// Detailed list view with application cards and selection

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ApplicationFilters, SortOption } from '@/app/dashboard/user/applications/page';

interface Application {
  id: string;
  company: string;
  position: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;
  lastUpdated: string;
  location: string;
  stipend: string;
  duration: string;
  nextAction?: string;
  nextActionDate?: string;
  logo: string;
}

interface ApplicationsListViewProps {
  filters: ApplicationFilters;
  sortBy: SortOption;
  selectedApplications: string[];
  onSelectionChange: (selected: string[]) => void;
  onViewApplication: (id: string) => void;
  onEditApplication: (id: string) => void;
}

export function ApplicationsListView({
  filters,
  sortBy,
  selectedApplications,
  onSelectionChange,
  onViewApplication,
  onEditApplication
}: ApplicationsListViewProps) {
  // Mock data - in real app, this would come from API
  const [applications] = useState<Application[]>([
    {
      id: '1',
      company: 'Google',
      position: 'Software Engineer Intern',
      status: 'Interview',
      appliedDate: '2024-01-15',
      lastUpdated: '2 days ago',
      location: 'Remote',
      stipend: '$8,000/month',
      duration: '3 months',
      nextAction: 'Prepare for interview',
      nextActionDate: 'Jan 30',
      logo: '🔍'
    },
    {
      id: '2',
      company: 'Microsoft',
      position: 'Product Manager Intern',
      status: 'Screening',
      appliedDate: '2024-01-14',
      lastUpdated: '1 day ago',
      location: 'Hybrid',
      stipend: '$7,500/month',
      duration: '4 months',
      nextAction: 'Complete coding assessment',
      nextActionDate: 'Jan 28',
      logo: '🪟'
    },
    {
      id: '3',
      company: 'Apple',
      position: 'iOS Developer Intern',
      status: 'Applied',
      appliedDate: '2024-01-13',
      lastUpdated: '3 days ago',
      location: 'On-site',
      stipend: '$9,000/month',
      duration: '3 months',
      logo: '🍎'
    },
    {
      id: '4',
      company: 'Meta',
      position: 'Frontend Engineer Intern',
      status: 'Offer',
      appliedDate: '2024-01-12',
      lastUpdated: '1 week ago',
      location: 'Remote',
      stipend: '$8,500/month',
      duration: '3 months',
      nextAction: 'Respond to offer',
      nextActionDate: 'Feb 1',
      logo: '📘'
    },
    {
      id: '5',
      company: 'Netflix',
      position: 'Data Science Intern',
      status: 'Rejected',
      appliedDate: '2024-01-11',
      lastUpdated: '5 days ago',
      location: 'Remote',
      stipend: '$7,000/month',
      duration: '4 months',
      logo: '🎬'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Screening': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Offer': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getLocationIcon = (location: string) => {
    const icons = {
      'Remote': '🏠',
      'Hybrid': '🏢',
      'On-site': '🏢'
    };
    return icons[location as keyof typeof icons] || '📍';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(applications.map(app => app.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectApplication = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedApplications, id]);
    } else {
      onSelectionChange(selectedApplications.filter(appId => appId !== id));
    }
  };

  const isAllSelected = applications.length > 0 && selectedApplications.length === applications.length;
  const isPartiallySelected = selectedApplications.length > 0 && selectedApplications.length < applications.length;

  return (
    <div className="p-6">
      {/* Header with Select All */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(input) => {
              if (input) input.indeterminate = isPartiallySelected;
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {selectedApplications.length > 0 
              ? `${selectedApplications.length} selected`
              : `${applications.length} applications`
            }
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          Sorted by: {sortBy === 'recent' ? 'Most Recent' : sortBy === 'company' ? 'Company Name' : 'Status'}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
              selectedApplications.includes(application.id) 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedApplications.includes(application.id)}
                onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />

              {/* Company Logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {application.logo}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {application.company}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {application.position}
                    </p>
                  </div>
                  
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Applied:</span>
                    <div className="font-medium">
                      {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <div className="font-medium">{application.lastUpdated}</div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span>{getLocationIcon(application.location)}</span>
                    <span className="font-medium">{application.location}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span>💰</span>
                    <span className="font-medium">{application.stipend}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>Duration: {application.duration}</span>
                  </div>
                </div>

                {/* Next Action */}
                {application.nextAction && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚡</span>
                      <span className="text-sm font-medium text-yellow-800">
                        Next Action: {application.nextAction}
                      </span>
                      {application.nextActionDate && (
                        <span className="text-sm text-yellow-600">
                          ({application.nextActionDate})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewApplication(application.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditApplication(application.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Add Note
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    ⋮ More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-600 mb-6">
            Start tracking your internship applications to see them here.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add Your First Application
          </Button>
        </div>
      )}
    </div>
  );
}