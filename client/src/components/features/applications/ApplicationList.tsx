
// Application List component - Client Component with live API integration
// Displays list of applications with server-side filtering and pagination

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { APPLICATION_STATUS_OPTIONS, APPLICATION_PLATFORM_OPTIONS } from '@/lib/constants';
import { applications } from '@/lib/api';
import {
  ApplicationWithFeedback,
  ApplicationFilters,
  ApplicationStatus,
  ApplicationPlatform,
  PaginatedResponse,
} from '@/lib/types';

export function ApplicationList() {
  const [items, setItems] = useState<ApplicationWithFeedback[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<ApplicationWithFeedback>['pagination']>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    search: '',
  });

  const [page, setPage] = useState(1);
  const limit = 20;

  const handleFilterChange = (field: 'status' | 'platform' | 'search', value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1); // reset to first page when filters change
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');

    const f: ApplicationFilters = {};
    if (filters.status) f.status = [filters.status as ApplicationStatus];
    if (filters.platform) f.platform = [filters.platform as ApplicationPlatform];
    if (filters.search) f.company = filters.search;

    const res = await applications.getAll(f, page, limit);
    if (res.success && res.data) {
      setItems(res.data?.data || []);
      setPagination(res.data.pagination);
    } else {
      const msg = typeof res.error === 'string' ? res.error : 'Failed to load applications';
      setError(msg || 'Failed to load applications.');
      setItems([]);
      setPagination({ page, limit, total: 0, totalPages: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.platform, filters.search, page]);

  const clearFilters = () => {
    setFilters({ status: '', platform: '', search: '' });
    setPage(1);
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const hasPrev = page > 1;
  const hasNext = page < (pagination?.totalPages || 0);
  const startIdx = items.length > 0 ? (page - 1) * limit + 1 : 0;
  const endIdx = items.length > 0 ? (page - 1) * limit + items.length : 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search companies..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={[
                { value: '', label: 'All Statuses' },
                ...APPLICATION_STATUS_OPTIONS,
              ]}
            />
            <Select
              placeholder="Filter by platform"
              value={filters.platform}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
              options={[
                { value: '', label: 'All Platforms' },
                ...APPLICATION_PLATFORM_OPTIONS,
              ]}
            />
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading and Error States */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading applications...</p>
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchData}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {!loading && !error && (
        <div className="space-y-4">
          {items.length === 0 ? (
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
            items.map((application) => {
              const feedbackCount = Array.isArray(application.feedback) ? application.feedback.length : 0;
              return (
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
                          {feedbackCount > 0 && (
                            <Badge variant="info" size="sm">
                              {feedbackCount} feedback
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{application.role}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                          <div>
                            <span className="font-medium">Platform:</span> {application.platform}
                          </div>
                          <div>
                            <span className="font-medium">Applied:</span> {formatDate(application.appliedDate as any)}
                          </div>
                          <div>
                            <span className="font-medium">Deadline:</span> {formatDate(application.deadline as any)}
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
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && items.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {`Showing ${startIdx}-${endIdx} of ${pagination.total} applications`}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled={!hasPrev} onClick={() => hasPrev && setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!hasNext} onClick={() => hasNext && setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
