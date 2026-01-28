// Active Job Postings Overview Component
// Grid/List view of active job postings

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function ActiveJobPostingsOverview() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const jobs = [
    {
      id: '1',
      title: 'Software Engineering Intern',
      location: 'San Francisco, CA',
      salary: '$8K/mo',
      status: 'Active',
      daysRemaining: 30,
      views: 450,
      applications: 32,
      newApplicants: 5,
      pipeline: {
        applied: 32,
        review: 12,
        interview: 3
      }
    },
    {
      id: '2',
      title: 'Product Management Intern',
      location: 'Remote',
      salary: '$7K/mo',
      status: 'Active',
      daysRemaining: 25,
      views: 320,
      applications: 28,
      newApplicants: 3,
      pipeline: {
        applied: 28,
        review: 8,
        interview: 2
      }
    },
    {
      id: '3',
      title: 'Data Science Intern',
      location: 'New York, NY',
      salary: '$9K/mo',
      status: 'Active',
      daysRemaining: 45,
      views: 380,
      applications: 41,
      newApplicants: 7,
      pipeline: {
        applied: 41,
        review: 15,
        interview: 4
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Active Job Postings</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
          {jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">📍 {job.location} | 💰 {job.salary}</p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {job.status}
                  </Badge>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Status: 🟢 Active ({job.daysRemaining} days remaining)</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">👁 Views: <span className="font-medium">{job.views}</span></p>
                    <p className="text-gray-600">📨 Applications: <span className="font-medium">{job.applications}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversion: <span className="font-medium">7.1%</span></p>
                    <p className="text-green-600">New applicants: <span className="font-medium">{job.newApplicants}</span></p>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Pipeline Status:</p>
                  <p className="text-gray-800">
                    Applied: {job.pipeline.applied} | Reviewing: {job.pipeline.review} | Interview: {job.pipeline.interview}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="default">
                    View Applicants({job.applications})
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit Posting
                  </Button>
                  <Button size="sm" variant="outline">
                    Boost Visibility
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}