// Review Applications Page
// Clean interface for reviewing job applications

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Application {
  id: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  appliedDate: string;
  status: 'New' | 'Reviewed' | 'Interview' | 'Rejected' | 'Hired';
  experience: string;
  education: string;
  skills: string[];
  resumeUrl: string;
  coverLetter: string;
  rating?: number;
}

// Mock data
const mockApplications: Application[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    jobTitle: 'Software Engineer Intern',
    appliedDate: '2024-01-20',
    status: 'New',
    experience: '2 years',
    education: 'Computer Science, Stanford University',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    resumeUrl: '/resumes/sarah-johnson.pdf',
    coverLetter: 'I am excited to apply for the Software Engineer Intern position. My experience with React and TypeScript aligns perfectly with your requirements...',
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    email: 'michael.chen@email.com',
    jobTitle: 'Software Engineer Intern',
    appliedDate: '2024-01-19',
    status: 'Reviewed',
    experience: '1 year',
    education: 'Computer Engineering, MIT',
    skills: ['JavaScript', 'React', 'AWS', 'Docker'],
    resumeUrl: '/resumes/michael-chen.pdf',
    coverLetter: 'As a passionate developer with experience in full-stack development, I believe I would be a great fit for this internship...',
    rating: 4,
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    jobTitle: 'Product Manager',
    appliedDate: '2024-01-18',
    status: 'Interview',
    experience: '3 years',
    education: 'Business Administration, UC Berkeley',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'Figma'],
    resumeUrl: '/resumes/emily-rodriguez.pdf',
    coverLetter: 'With my background in product management and passion for user-centered design, I am excited about the opportunity...',
    rating: 5,
  },
];

export default function ReviewApplicationsPage() {
  const { user } = useAuth();
  const [applications] = useState<Application[]>(mockApplications);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  if (!user || user.role !== UserRole.MENTOR) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const statuses = ['All', 'New', 'Reviewed', 'Interview', 'Rejected', 'Hired'];
  
  const filteredApplications = applications.filter(app => 
    selectedStatus === 'All' || app.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Reviewed': return 'neutral';
      case 'Interview': return 'warning';
      case 'Rejected': return 'error';
      case 'Hired': return 'success';
      default: return 'neutral';
    }
  };

  const handleStatusUpdate = (applicationId: string, newStatus: string) => {
    // TODO: Implement status update API call
    console.log('Updating application status:', applicationId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/dashboard/company">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                Review Applications
              </h1>
              <p className="text-gray-600 mt-2 leading-relaxed">
                Manage and review candidate applications for your job postings
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-blue-600 mb-1">
                  {applications.filter(a => a.status === 'New').length}
                </div>
                <div className="text-sm text-gray-600">New</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-yellow-600 mb-1">
                  {applications.filter(a => a.status === 'Interview').length}
                </div>
                <div className="text-sm text-gray-600">Interview</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-green-600 mb-1">
                  {applications.filter(a => a.status === 'Hired').length}
                </div>
                <div className="text-sm text-gray-600">Hired</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-red-600 mb-1">
                  {applications.filter(a => a.status === 'Rejected').length}
                </div>
                <div className="text-sm text-gray-600">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Applications List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredApplications.map((application) => (
              <Card 
                key={application.id} 
                className={`bg-white border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedApplication?.id === application.id 
                    ? 'border-blue-300 shadow-md' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedApplication(application)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {application.candidateName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{application.email}</p>
                      <p className="text-sm font-medium text-blue-600">{application.jobTitle}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={getStatusColor(application.status)} className="rounded-full">
                        {application.status}
                      </Badge>
                      {application.rating && (
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < application.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Education:</span>
                      <span>{application.education}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Experience:</span>
                      <span>{application.experience}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Applied:</span>
                      <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {application.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="neutral" size="sm" className="rounded-full">
                        {skill}
                      </Badge>
                    ))}
                    {application.skills.length > 3 && (
                      <Badge variant="neutral" size="sm" className="rounded-full">
                        +{application.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-lg">
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredApplications.length === 0 && (
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">No applications match the selected filter.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Details Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedApplication ? 'Application Details' : 'Select Application'}
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                {selectedApplication ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{selectedApplication.candidateName}</h4>
                      <p className="text-sm text-gray-600 mb-4">{selectedApplication.email}</p>
                      <Badge variant={getStatusColor(selectedApplication.status)} className="rounded-full">
                        {selectedApplication.status}
                      </Badge>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h5>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedApplication.coverLetter}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-3">Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplication.skills.map((skill) => (
                          <Badge key={skill} variant="neutral" size="sm" className="rounded-full">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">
                        Schedule Interview
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                      >
                        Send Message
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl"
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'Hired')}
                        >
                          Hire
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p>Select an application to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}