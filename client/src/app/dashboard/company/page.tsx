// Company Dashboard Page
// Main overview dashboard for companies

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Internship' | 'Full-time';
  status: 'Active' | 'Draft' | 'Paused';
  applications: number;
  posted: string;
  deadline: string;
  description: string;
  requirements: string[];
  salary: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Internship',
    status: 'Active',
    applications: 45,
    posted: '2024-01-15',
    deadline: '2024-02-15',
    description: 'Join our engineering team to work on cutting-edge web applications.',
    requirements: ['Computer Science or related field', 'Experience with React/TypeScript', 'Strong problem-solving skills'],
    salary: '$25-30/hour'
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    status: 'Active',
    applications: 23,
    posted: '2024-01-10',
    deadline: '2024-02-10',
    description: 'Lead product strategy and work with cross-functional teams.',
    requirements: ['3+ years PM experience', 'Strong analytical skills', 'Experience with Agile methodologies'],
    salary: '$120k-150k'
  }
];

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
    {children}
  </span>
);

export default function CompanyDashboardPage() {
  const { user, logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (!user || user.role !== UserRole.MENTOR) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const filters = ['All', 'Internship', 'Full-time', 'Active', 'Draft', 'Paused'];
  
  const filteredJobs = mockJobs.filter(job => {
    if (selectedFilter === 'All') return true;
    return job.type === selectedFilter || job.status === selectedFilter;
  });

  const stats = {
    totalJobs: mockJobs.length,
    activeJobs: mockJobs.filter(j => j.status === 'Active').length,
    totalApplications: mockJobs.reduce((sum, job) => sum + job.applications, 0),
    internships: mockJobs.filter(j => j.type === 'Internship').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your job postings and internships</p>
            <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
            <Badge className="mt-2 bg-gray-100 text-gray-700 border-gray-200">Company</Badge>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboard/company/jobs/new">
              <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-2xl">
                + Post New Job
              </Button>
            </Link>
            <Button 
              onClick={logout}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 border-gray-300 text-gray-700 rounded-2xl"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Job Postings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Postings</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Internships</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.internships}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Job Postings ({filteredJobs.length})</h2>
                  <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl">
                    Export List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedJob?.id === job.id
                          ? 'border-gray-400 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge 
                            className={`${
                              job.type === 'Internship' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : 'bg-green-100 text-green-800 border-green-200'
                            }`}
                          >
                            {job.type}
                          </Badge>
                          <Badge 
                            className={`${
                              job.status === 'Active' 
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : job.status === 'Draft'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{job.applications} applications</span>
                        <span>Posted: {new Date(job.posted).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <Link href="/dashboard/company/applications">
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl">
                            View Applications
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl">Edit</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 rounded-xl">
                          {job.status === 'Active' ? 'Pause' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Details Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-white border-gray-200">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedJob ? 'Job Details' : 'Select a Job'}
                </h2>
              </CardHeader>
              <CardContent>
                {selectedJob ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{selectedJob.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedJob.department} • {selectedJob.location}
                      </p>
                      <div className="flex space-x-2 mb-4">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">{selectedJob.type}</Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200">{selectedJob.status}</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Description</h4>
                      <p className="text-sm text-gray-700">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Requirements</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gray-900 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-gray-900">Compensation</h4>
                      <p className="text-sm font-semibold text-green-600">{selectedJob.salary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Applications:</span>
                        <p className="font-semibold text-gray-900">{selectedJob.applications}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Deadline:</span>
                        <p className="font-semibold text-gray-900">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <Link href="/dashboard/company/applications">
                        <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl" size="sm">
                          View All Applications
                        </Button>
                      </Link>
                      <Button className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-xl" size="sm" variant="outline">
                        Edit Job Posting
                      </Button>
                      <Button 
                        className="w-full text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 rounded-xl" 
                        size="sm" 
                        variant="outline"
                      >
                        {selectedJob.status === 'Active' ? 'Pause Posting' : 'Activate Posting'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p>Click on a job posting to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/dashboard/company/jobs/new">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gray-900 text-white hover:bg-gray-800 rounded-2xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span>Post New Job</span>
                  </Button>
                </Link>
                <Link href="/dashboard/company/applications">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-2xl" variant="outline">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Review Applications</span>
                  </Button>
                </Link>
                <Link href="/dashboard/company/interviews">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-2xl" variant="outline">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-12h2a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
                    </svg>
                    <span>Schedule Interviews</span>
                  </Button>
                </Link>
                <Link href="/dashboard/company/analytics">
                  <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-2xl" variant="outline">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Analytics Report</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}