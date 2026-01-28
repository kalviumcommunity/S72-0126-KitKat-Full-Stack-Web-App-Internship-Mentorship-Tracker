// Job Postings List Component
// Display job postings based on filters

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface JobPostingsListProps {
  activeTab: string;
  searchQuery: string;
  sortBy: string;
}

export function JobPostingsList({ activeTab, searchQuery, sortBy }: JobPostingsListProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Mock job data
  const allJobs = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      location: 'Remote',
      salary: '$7-9K/month',
      duration: '3-6 months',
      status: 'active',
      posted: 'Jan 10, 2026',
      daysLeft: 25,
      views: 450,
      applications: 32,
      conversion: 7.1,
      pipeline: { applied: 32, reviewing: 12, interview: 3 }
    },
    {
      id: '2',
      title: 'Product Management Intern',
      location: 'Hybrid',
      salary: '$6-8K/month',
      duration: '4-6 months',
      status: 'active',
      posted: 'Jan 8, 2026',
      daysLeft: 30,
      views: 320,
      applications: 28,
      conversion: 8.8,
      pipeline: { applied: 28, reviewing: 8, interview: 2 }
    },
    {
      id: '3',
      title: 'Data Science Intern',
      location: 'On-site',
      salary: '$8-10K/month',
      duration: '3-4 months',
      status: 'draft',
      posted: 'Jan 15, 2026',
      daysLeft: 0,
      views: 0,
      applications: 0,
      conversion: 0,
      pipeline: { applied: 0, reviewing: 0, interview: 0 }
    },
    {
      id: '4',
      title: 'UX Design Intern',
      location: 'Remote',
      salary: '$6-8K/month',
      duration: '3-6 months',
      status: 'closed',
      posted: 'Dec 15, 2025',
      daysLeft: 0,
      views: 680,
      applications: 45,
      conversion: 6.6,
      pipeline: { applied: 45, reviewing: 0, interview: 0 }
    }
  ];

  // Filter jobs based on active tab
  const filteredJobs = allJobs.filter(job => {
    if (activeTab === 'active') return job.status === 'active';
    if (activeTab === 'draft') return job.status === 'draft';
    if (activeTab === 'closed') return job.status === 'closed';
    if (activeTab === 'templates') return false; // Templates would be separate data
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'draft': return '🟡';
      case 'closed': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="mt-6">
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings found</h3>
            <p className="text-gray-600">
              {activeTab === 'templates' 
                ? 'Create your first job posting template to get started.'
                : `No ${activeTab} job postings match your criteria.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {job.location} | 💰 {job.salary} | 📅 {job.duration}
                      </p>
                    </div>
                    <Badge className={getStatusColor(job.status)} variant="secondary">
                      {job.status}
                    </Badge>
                  </div>

                  {/* Status */}
                  <div className="text-sm text-gray-600">
                    <p>Status: {getStatusIcon(job.status)} {job.status === 'active' ? `Active (${job.daysLeft} days left)` : job.status}</p>
                    <p>Posted: {job.posted}</p>
                  </div>

                  {/* Performance Metrics */}
                  {job.status !== 'draft' && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Performance:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">👁 Views: <span className="font-medium">{job.views}</span></p>
                          <p className="text-gray-600">📨 Applications: <span className="font-medium">{job.applications}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-600">Conversion: <span className="font-medium">{job.conversion}%</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pipeline Status */}
                  {job.status === 'active' && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Pipeline Status:</h4>
                      <p className="text-sm text-gray-600">
                        Applied: {job.pipeline.applied} | Reviewing: {job.pipeline.reviewing} | Interview: {job.pipeline.interview}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.status === 'active' && (
                      <>
                        <Button size="sm" variant="default">
                          View Applicants({job.applications})
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Posting
                        </Button>
                        <Button size="sm" variant="outline">
                          Boost Visibility
                        </Button>
                        <Button size="sm" variant="outline">
                          Close Posting
                        </Button>
                      </>
                    )}
                    
                    {job.status === 'draft' && (
                      <>
                        <Button size="sm" variant="default">
                          Publish Posting
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Draft
                        </Button>
                        <Button size="sm" variant="outline">
                          Delete Draft
                        </Button>
                      </>
                    )}
                    
                    {job.status === 'closed' && (
                      <>
                        <Button size="sm" variant="outline">
                          View Results
                        </Button>
                        <Button size="sm" variant="outline">
                          Repost Job
                        </Button>
                        <Button size="sm" variant="outline">
                          Archive
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}