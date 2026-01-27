// Mentor Requests Section Component
// Display pending, accepted, and rejected mentor requests

'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MentorRequest {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  mentorPhoto: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message: string;
  responseDate?: string;
  responseMessage?: string;
  expiryDate?: string;
}

export function MentorRequestsSection() {
  const mentorRequests: MentorRequest[] = [
    {
      id: '1',
      mentorName: 'Alex Thompson',
      mentorTitle: 'VP of Engineering',
      mentorCompany: 'Uber',
      mentorPhoto: '👨‍💼',
      requestDate: '2024-01-25',
      status: 'pending',
      message: 'Hi Alex, I\'m really interested in learning about engineering leadership and scaling teams. I\'ve been following your work at Uber and would love to get your guidance on my career path.',
      expiryDate: '2024-02-01'
    },
    {
      id: '2',
      mentorName: 'Emily Johnson',
      mentorTitle: 'Senior Data Scientist',
      mentorCompany: 'Netflix',
      mentorPhoto: '👩‍🔬',
      requestDate: '2024-01-20',
      status: 'accepted',
      message: 'Hello Emily, I\'m passionate about machine learning and data science. I would appreciate your mentorship to help me break into the field.',
      responseDate: '2024-01-22',
      responseMessage: 'Hi! I\'d be happy to help you with your ML journey. Let\'s schedule our first session to discuss your goals.'
    },
    {
      id: '3',
      mentorName: 'Lisa Park',
      mentorTitle: 'UX Design Manager',
      mentorCompany: 'Airbnb',
      mentorPhoto: '👩‍🎨',
      requestDate: '2024-01-18',
      status: 'rejected',
      message: 'Hi Lisa, I\'m transitioning into UX design and would love your guidance on building a strong portfolio and landing my first design role.',
      responseDate: '2024-01-19',
      responseMessage: 'Thank you for your interest! Unfortunately, I\'m at capacity with mentees right now. I recommend checking out our design resources page.'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'pending': '⏳',
      'accepted': '✅',
      'rejected': '❌',
      'expired': '⏰'
    };
    return icons[status as keyof typeof icons];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Mentor Requests</h2>
          <div className="flex items-center space-x-2">
            <Badge className="bg-yellow-100 text-yellow-800">
              {mentorRequests.filter(r => r.status === 'pending').length} Pending
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {mentorRequests.length} Total
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {mentorRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {request.mentorPhoto}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {request.mentorName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {request.mentorTitle} @ {request.mentorCompany}
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested on {formatDate(request.requestDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(request.status)}>
                    <span className="mr-1">{getStatusIcon(request.status)}</span>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Request Message */}
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Your Message:</h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {request.message}
                </p>
              </div>

              {/* Response (if any) */}
              {request.responseMessage && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    Response ({formatDate(request.responseDate!)}):
                  </h5>
                  <p className={`text-sm p-3 rounded-lg ${
                    request.status === 'accepted' 
                      ? 'text-green-800 bg-green-50' 
                      : 'text-red-800 bg-red-50'
                  }`}>
                    {request.responseMessage}
                  </p>
                </div>
              )}

              {/* Expiry Warning for Pending Requests */}
              {request.status === 'pending' && request.expiryDate && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span className="text-sm text-yellow-800">
                      {getDaysUntilExpiry(request.expiryDate) > 0 
                        ? `Expires in ${getDaysUntilExpiry(request.expiryDate)} days`
                        : 'Request expired'
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                {request.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm">
                      Edit Request
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      Cancel Request
                    </Button>
                  </>
                )}
                
                {request.status === 'accepted' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Start Mentorship
                    </Button>
                    <Button variant="outline" size="sm">
                      Message Mentor
                    </Button>
                  </>
                )}
                
                {request.status === 'rejected' && (
                  <Button variant="outline" size="sm">
                    Find Similar Mentors
                  </Button>
                )}
                
                {request.status === 'expired' && (
                  <Button variant="outline" size="sm">
                    Send New Request
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mentorRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Mentor Requests
            </h3>
            <p className="text-gray-600 mb-6">
              Start by sending requests to mentors you'd like to work with.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Find Mentors
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 text-lg">💡</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Tips for Better Requests</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about what you want to learn</li>
                <li>• Mention why you chose this particular mentor</li>
                <li>• Show that you've done your research</li>
                <li>• Keep your message concise but personal</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}