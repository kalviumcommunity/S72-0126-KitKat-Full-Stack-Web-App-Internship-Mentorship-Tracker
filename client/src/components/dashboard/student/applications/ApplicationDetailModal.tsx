// Application Detail Modal Component
// Comprehensive modal with tabs for Overview, Timeline, Documents, Notes, and Feedback

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
}

type TabType = 'overview' | 'timeline' | 'documents' | 'notes' | 'feedback';

export function ApplicationDetailModal({
  isOpen,
  onClose,
  applicationId
}: ApplicationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isOpen || !applicationId) return null;

  // Mock application data - in real app, fetch based on applicationId
  const application = {
    id: applicationId,
    company: 'Google',
    position: 'Software Engineer Intern',
    status: 'Interview',
    appliedDate: '2024-01-15',
    location: 'Remote',
    stipend: '$8,000/month',
    duration: '3 months',
    logo: '🔍',
    description: 'Join our team as a Software Engineer Intern and work on cutting-edge projects that impact billions of users worldwide. You\'ll collaborate with experienced engineers, learn industry best practices, and contribute to meaningful products.',
    requirements: [
      'Currently pursuing a degree in Computer Science or related field',
      'Strong programming skills in Python, Java, or C++',
      'Understanding of data structures and algorithms',
      'Experience with web development frameworks',
      'Excellent problem-solving and communication skills'
    ],
    matchScore: 85,
    companyInfo: {
      size: '100,000+ employees',
      industry: 'Technology',
      founded: '1998',
      headquarters: 'Mountain View, CA'
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'feedback', label: 'Feedback', icon: '💬' }
  ];

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

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Job Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{application.description}</p>
      </div>

      {/* Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
        <ul className="space-y-2">
          {application.requirements.map((req, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Company Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Size:</span>
            <div className="font-medium">{application.companyInfo.size}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Industry:</span>
            <div className="font-medium">{application.companyInfo.industry}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Founded:</span>
            <div className="font-medium">{application.companyInfo.founded}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Headquarters:</span>
            <div className="font-medium">{application.companyInfo.headquarters}</div>
          </div>
        </div>
      </div>

      {/* Match Score */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Your Match Score</h4>
            <p className="text-sm text-gray-600">Based on your profile and requirements</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{application.matchScore}%</div>
            <div className="text-sm text-gray-500">Excellent Match</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimelineTab = () => (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {[
          { date: '2024-01-15', title: 'Application Submitted', description: 'Resume and cover letter uploaded', status: 'completed' },
          { date: '2024-01-17', title: 'Resume Reviewed', description: 'Application passed initial screening', status: 'completed' },
          { date: '2024-01-20', title: 'Screening Call', description: 'Phone interview with HR completed', status: 'completed' },
          { date: '2024-01-30', title: 'Technical Interview', description: 'Scheduled with engineering team', status: 'upcoming' },
          { date: 'TBD', title: 'Final Interview', description: 'Panel interview with team leads', status: 'pending' }
        ].map((event, index) => (
          <div key={index} className="relative flex items-start space-x-4 pb-6">
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
              event.status === 'completed' ? 'bg-green-100 text-green-600' :
              event.status === 'upcoming' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-400'
            }`}>
              {event.status === 'completed' ? '✓' : 
               event.status === 'upcoming' ? '⏰' : '○'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full">
        Add Custom Milestone
      </Button>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      {[
        { name: 'Resume_v3.2.pdf', type: 'Resume', size: '245 KB', uploaded: '2024-01-15' },
        { name: 'Cover_Letter_Google.pdf', type: 'Cover Letter', size: '128 KB', uploaded: '2024-01-15' },
        { name: 'Portfolio_Link.txt', type: 'Portfolio', size: '1 KB', uploaded: '2024-01-15' }
      ].map((doc, index) => (
        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              📄
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{doc.name}</h4>
              <p className="text-sm text-gray-500">{doc.type} • {doc.size} • Uploaded {doc.uploaded}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">View</Button>
            <Button variant="outline" size="sm">Download</Button>
          </div>
        </div>
      ))}
      
      <Button variant="outline" className="w-full">
        Upload More Documents
      </Button>
    </div>
  );

  const renderNotesTab = () => (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Interview Preparation Notes</h4>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add your preparation notes, questions to ask, research about the company..."
          defaultValue="Research Google's recent AI initiatives and be prepared to discuss machine learning concepts. Practice system design questions focusing on scalability."
        />
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Post-Interview Reflections</h4>
        <textarea
          className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="How did the interview go? What went well? What could be improved?"
        />
      </div>
      
      <Button className="w-full">Save Notes</Button>
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="space-y-4">
      {[
        {
          mentor: 'Sarah Chen',
          date: '2024-01-18',
          type: 'Resume Review',
          content: 'Your resume looks great! Consider adding more quantifiable achievements in your project descriptions.',
          rating: 4
        },
        {
          mentor: 'David Rodriguez',
          date: '2024-01-22',
          type: 'Interview Prep',
          content: 'Practice explaining your thought process more clearly during technical problems. Your solutions are correct but communication can be improved.',
          rating: 3
        }
      ].map((feedback, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{feedback.mentor}</span>
              <Badge variant="outline">{feedback.type}</Badge>
            </div>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-2">{feedback.content}</p>
          <p className="text-sm text-gray-500">{feedback.date}</p>
        </div>
      ))}
      
      <Button variant="outline" className="w-full">
        Request New Feedback
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
              {application.logo}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{application.company}</h2>
              <p className="text-gray-600">{application.position}</p>
            </div>
            <Badge className={getStatusColor(application.status)}>
              {application.status}
            </Badge>
          </div>
          
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Application Info Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="text-gray-500">Applied:</span>
              <span className="ml-1 font-medium">{new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Location:</span>
              <span className="ml-1 font-medium">{application.location}</span>
            </div>
            <div>
              <span className="text-gray-500">Stipend:</span>
              <span className="ml-1 font-medium">{application.stipend}</span>
            </div>
            <div>
              <span className="text-gray-500">Duration:</span>
              <span className="ml-1 font-medium">{application.duration}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'timeline' && renderTimelineTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'notes' && renderNotesTab()}
          {activeTab === 'feedback' && renderFeedbackTab()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <Button variant="outline">Edit Application</Button>
            <Button variant="outline">Add Note</Button>
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}