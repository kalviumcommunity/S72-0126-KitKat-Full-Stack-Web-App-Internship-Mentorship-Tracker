// Schedule Interviews Page
// Clean interface for managing interview scheduling

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface Interview {
  id: string;
  candidateName: string;
  email: string;
  jobTitle: string;
  date: string;
  time: string;
  duration: number;
  type: 'Phone' | 'Video' | 'In-person';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  interviewer: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
}

// Mock data
const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    jobTitle: 'Software Engineer Intern',
    date: '2024-01-25',
    time: '10:00',
    duration: 60,
    type: 'Video',
    status: 'Scheduled',
    interviewer: 'John Smith',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Technical interview focusing on React and JavaScript fundamentals.',
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    email: 'michael.chen@email.com',
    jobTitle: 'Software Engineer Intern',
    date: '2024-01-26',
    time: '14:00',
    duration: 45,
    type: 'Phone',
    status: 'Scheduled',
    interviewer: 'Jane Doe',
    notes: 'Initial screening call to discuss background and experience.',
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    jobTitle: 'Product Manager',
    date: '2024-01-24',
    time: '15:30',
    duration: 90,
    type: 'In-person',
    status: 'Completed',
    interviewer: 'Alex Wilson',
    location: 'Conference Room A',
    notes: 'Final round interview with product team. Discussed case study and strategic thinking.',
  },
];

export default function ScheduleInterviewsPage() {
  const { user } = useAuth();
  const [interviews] = useState<Interview[]>(mockInterviews);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

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

  const statuses = ['All', 'Scheduled', 'Completed', 'Cancelled', 'Rescheduled'];
  
  const filteredInterviews = interviews.filter(interview => 
    selectedStatus === 'All' || interview.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'info';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'Rescheduled': return 'warning';
      default: return 'neutral';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'Phone':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'In-person':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/company">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                  Interview Management
                </h1>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Schedule and manage interviews with candidates
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowScheduleForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
            >
              Schedule Interview
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">{interviews.length}</div>
                <div className="text-sm text-gray-600">Total Interviews</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-blue-600 mb-1">
                  {interviews.filter(i => i.status === 'Scheduled').length}
                </div>
                <div className="text-sm text-gray-600">Scheduled</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-green-600 mb-1">
                  {interviews.filter(i => i.status === 'Completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">
                  {interviews.filter(i => i.date === new Date().toISOString().split('T')[0]).length}
                </div>
                <div className="text-sm text-gray-600">Today</div>
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

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Interviews List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredInterviews.map((interview) => (
              <Card 
                key={interview.id} 
                className={`bg-white border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedInterview?.id === interview.id 
                    ? 'border-blue-300 shadow-md' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedInterview(interview)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {interview.candidateName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{interview.email}</p>
                      <p className="text-sm font-medium text-blue-600">{interview.jobTitle}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={getStatusColor(interview.status)} className="rounded-full">
                        {interview.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-gray-500">
                        {getTypeIcon(interview.type)}
                        <span className="text-xs">{interview.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">{interview.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{interview.duration} minutes</p>
                      <p className="text-sm text-gray-600">with {interview.interviewer}</p>
                    </div>
                  </div>

                  {interview.location && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-700">{interview.location}</p>
                    </div>
                  )}

                  {interview.meetingLink && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Meeting Link</p>
                      <a 
                        href={interview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      View Details
                    </Button>
                    {interview.status === 'Scheduled' && (
                      <Button size="sm" variant="outline" className="rounded-lg">
                        Reschedule
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredInterviews.length === 0 && (
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-12h2a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
                  <p className="text-gray-600">No interviews match the selected filter.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Interview Details Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-white border border-gray-200">
              <CardHeader className="border-b border-gray-100 pb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedInterview ? 'Interview Details' : 'Select Interview'}
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                {selectedInterview ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{selectedInterview.candidateName}</h4>
                      <p className="text-sm text-gray-600 mb-4">{selectedInterview.jobTitle}</p>
                      <Badge variant={getStatusColor(selectedInterview.status)} className="rounded-full">
                        {selectedInterview.status}
                      </Badge>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Schedule</h5>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Date:</span> {new Date(selectedInterview.date).toLocaleDateString()}</p>
                        <p><span className="font-medium">Time:</span> {selectedInterview.time}</p>
                        <p><span className="font-medium">Duration:</span> {selectedInterview.duration} minutes</p>
                        <p><span className="font-medium">Type:</span> {selectedInterview.type}</p>
                        <p><span className="font-medium">Interviewer:</span> {selectedInterview.interviewer}</p>
                      </div>
                    </div>

                    {selectedInterview.notes && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedInterview.notes}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      {selectedInterview.meetingLink && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">
                          Join Meeting
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                      >
                        Send Reminder
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-xl"
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m8-12h2a2 2 0 012 2v8a2 2 0 01-2 2h-2" />
                      </svg>
                    </div>
                    <p>Select an interview to view details</p>
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