// Application List component - Server Component with Client interactions
// Displays list of applications with filtering and actions

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { APPLICATION_STATUS_OPTIONS, APPLICATION_PLATFORM_OPTIONS } from '@/lib/constants';

// TODO: Replace with real data from API
const mockApplications = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer Intern',
    platform: 'COMPANY_WEBSITE',
    status: 'INTERVIEW',
    appliedDate: '2024-01-15T10:00:00Z',
    deadline: '2024-01-20T23:59:59Z',
    notes: 'Applied through university career portal. Completed online assessment.',
    feedbackCount: 2,
  },
  {
    id: '2',
    company: 'Microsoft',
    role: 'Product Manager Intern',
    platform: 'LINKEDIN',
    status: 'APPLIED',
    appliedDate: '2024-01-14T14:30:00Z',
    deadline: '2024-01-25T23:59:59Z',
    notes: 'Referred by alumni. Submitted cover letter and portfolio.',
    feedbackCount: 1,
  },
  {
    id: '3',
    company: 'Amazon',
    role: 'SDE Intern',
    platform: 'REFERRAL',
    status: 'SHORTLISTED',
    appliedDate: '2024-01-13T09:15:00Z',
    deadline: null,
    notes: 'Employee referral from previous internship mentor.',
    feedbackCount: 3,
  },
  {
    id: '4',
    company: 'Meta',
    role: 'Data Science Intern',
    platform: 'JOB_BOARD',
    status: 'REJECTED',
    appliedDate: '2024-01-10T16:45:00Z',
    deadline: '2024-01-15T23:59:59Z',
    notes: 'Applied through Indeed. Received rejection after phone screen.',
    feedbackCount: 1,
  },
  {
    id: '5',
    company: 'Apple',
    role: 'iOS Developer Intern',
    platform: 'COMPANY_WEBSITE',
    status: 'DRAFT',
    appliedDate: null,
    deadline: '2024-01-30T23:59:59Z',
    notes: 'Working on application. Need to complete coding challenge.',
    feedbackCount: 0,
  },
];

export function ApplicationList() {
  const [applications] = useState(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState(mockApplications);
  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    search: '',
  });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    // Apply filters
    let filtered = applications;

    if (newFilters.status) {
      filtered = filtered.filter(app => app.status === newFilters.status);
    }

    if (newFilters.platform) {
      filtered = filtered.filter(app => app.platform === newFilters.platform);
    }

    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.company.toLowerCase().includes(searchLower) ||
        app.role.toLowerCase().includes(searchLower)
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'neutral';
      case 'APPLIED': return 'info';
      case 'SHORTLISTED': return 'warning';
      case 'INTERVIEW': return 'info';
      case 'OFFER': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search companies or roles..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                ...APPLICATION_STATUS_OPTIONS
              ]}
            />
            <Select
              placeholder="Filter by platform"
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              options={[
                { value: '', label: 'All Platforms' },
                ...APPLICATION_PLATFORM_OPTIONS
              ]}
            />
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ status: '', platform: '', search: '' });
                setFilteredApplications(applications);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4">
                {filters.search || filters.status || filters.platform
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first internship application.'
                }
              </p>
              {!filters.search && !filters.status && !filters.platform && (
                <Link href="/student/applications/new">
                  <Button>Create Your First Application</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.company}
                      </h3>
                      <Badge variant={getStatusVariant(application.status)}>
                        {application.status}
                      </Badge>
                      {application.feedbackCount > 0 && (
                        <Badge variant="info" size="sm">
                          {application.feedbackCount} feedback
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{application.role}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                      <div>
                        <span className="font-medium">Platform:</span> {application.platform}
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span> {formatDate(application.appliedDate)}
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span> {formatDate(application.deadline)}
                      </div>
                    </div>
                    
                    {application.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {application.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Link href={`/student/applications/${application.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/student/applications/${application.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredApplications.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}