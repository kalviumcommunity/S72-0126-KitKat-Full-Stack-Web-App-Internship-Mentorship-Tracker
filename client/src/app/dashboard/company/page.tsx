// Company Dashboard Page
// Role-based dashboard for companies - Job and Internship Management

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    type: 'Internship',
    location: 'Remote',
    department: 'Engineering',
    status: 'Active',
    applications: 45,
    posted: '2024-01-15',
    deadline: '2024-02-15',
    description: 'Join our engineering team to work on cutting-edge web applications using React, Node.js, and cloud technologies.',
    requirements: ['Computer Science or related field', 'JavaScript/TypeScript', 'React experience preferred'],
    salary: '$25-30/hour'
  },
  {
    id: '2',
    title: 'Product Manager Intern',
    type: 'Internship',
    location: 'Hybrid',
    department: 'Product',
    status: 'Active',
    applications: 23,
    posted: '2024-01-10',
    deadline: '2024-02-10',
    description: 'Work with cross-functional teams to define product roadmaps and drive feature development.',
    requirements: ['Business or related field', 'Analytical skills', 'Communication skills'],
    salary: '$22-28/hour'
  },
  {
    id: '3',
    title: 'Data Science Intern',
    type: 'Internship',
    location: 'On-site',
    department: 'Data',
    status: 'Draft',
    applications: 12,
    posted: '2024-01-20',
    deadline: '2024-03-01',
    description: 'Analyze large datasets and build machine learning models to drive business insights.',
    requirements: ['Statistics or CS background', 'Python/R', 'SQL knowledge'],
    salary: '$28-35/hour'
  },
  {
    id: '4',
    title: 'Senior Software Engineer',
    type: 'Full-time',
    location: 'Remote',
    department: 'Engineering',
    status: 'Active',
    applications: 78,
    posted: '2024-01-05',
    deadline: '2024-02-05',
    description: 'Lead development of scalable backend systems and mentor junior developers.',
    requirements: ['5+ years experience', 'System design', 'Leadership skills'],
    salary: '$120k-150k/year'
  },
  {
    id: '5',
    title: 'UX Designer',
    type: 'Full-time',
    location: 'Hybrid',
    department: 'Design',
    status: 'Paused',
    applications: 34,
    posted: '2024-01-12',
    deadline: '2024-02-20',
    description: 'Design intuitive user experiences for our web and mobile applications.',
    requirements: ['Design portfolio', 'Figma/Sketch', '3+ years experience'],
    salary: '$85k-110k/year'
  }
];

export default function CompanyDashboardPage() {
  const { user, logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);

  if (!user || user.role !== UserRole.MENTOR) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your job postings and internships</p>
            <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
            <Badge className="mt-2 bg-purple-100 text-purple-800">Company</Badge>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-purple-600 hover:bg-purple-700">
              + Post New Job
            </Button>
            <Button 
              onClick={logout}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Job Postings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <div className="text-3xl">💼</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Postings</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Internships</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.internships}</p>
                </div>
                <div className="text-3xl">🎓</div>
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
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Job Postings ({filteredJobs.length})</h2>
                  <Button size="sm" variant="outline">
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
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge 
                            className={`${
                              job.type === 'Internship' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {job.type}
                          </Badge>
                          <Badge 
                            className={`${
                              job.status === 'Active' 
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'Draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
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
                        <Button size="sm" variant="outline">View Applications</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
            <Card className="sticky top-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {selectedJob ? 'Job Details' : 'Select a Job'}
                </h2>
              </CardHeader>
              <CardContent>
                {selectedJob ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedJob.department} • {selectedJob.location}
                      </p>
                      <div className="flex space-x-2 mb-4">
                        <Badge className="bg-blue-100 text-blue-800">{selectedJob.type}</Badge>
                        <Badge className="bg-green-100 text-green-800">{selectedJob.status}</Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Compensation</h4>
                      <p className="text-sm font-semibold text-green-600">{selectedJob.salary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Applications:</span>
                        <p className="font-semibold">{selectedJob.applications}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Deadline:</span>
                        <p className="font-semibold">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Button className="w-full" size="sm">
                        View All Applications
                      </Button>
                      <Button className="w-full" size="sm" variant="outline">
                        Edit Job Posting
                      </Button>
                      <Button 
                        className="w-full text-red-600 hover:text-red-700" 
                        size="sm" 
                        variant="outline"
                      >
                        {selectedJob.status === 'Active' ? 'Pause Posting' : 'Activate Posting'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p>Click on a job posting to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                  <span className="text-2xl">💼</span>
                  <span>Post New Job</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <span className="text-2xl">📋</span>
                  <span>Review Applications</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <span className="text-2xl">🎯</span>
                  <span>Schedule Interviews</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                  <span className="text-2xl">📊</span>
                  <span>Analytics Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}