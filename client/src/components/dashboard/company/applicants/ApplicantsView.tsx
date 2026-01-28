// Applicants View Component
// Different view modes for applicants (cards, table, pipeline)

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Applicant {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  experience: string;
  skills: string[];
  resumeUrl?: string;
}

type ViewMode = 'cards' | 'table' | 'pipeline';

export function ApplicantsView() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [applicants] = useState<Applicant[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Software Engineer',
      status: 'interview',
      appliedDate: '2024-01-15',
      experience: '3 years',
      skills: ['React', 'TypeScript', 'Node.js'],
      resumeUrl: '/resumes/john-doe.pdf'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'Product Manager',
      status: 'screening',
      appliedDate: '2024-01-14',
      experience: '5 years',
      skills: ['Product Strategy', 'Analytics', 'Agile'],
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applicants.map((applicant) => (
        <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                {applicant.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Position:</strong> {applicant.position}</p>
              <p><strong>Email:</strong> {applicant.email}</p>
              <p><strong>Experience:</strong> {applicant.experience}</p>
              <p><strong>Applied:</strong> {new Date(applicant.appliedDate).toLocaleDateString()}</p>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {applicant.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline">View Profile</Button>
              {applicant.resumeUrl && (
                <Button size="sm" variant="outline">View Resume</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                      <div className="text-sm text-gray-500">{applicant.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {applicant.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(applicant.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button size="sm" variant="outline" className="mr-2">View</Button>
                    <Button size="sm" variant="outline">Contact</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderPipelineView = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {['applied', 'screening', 'interview', 'offer', 'rejected'].map((status) => (
        <div key={status} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 capitalize">
            {status} ({applicants.filter(a => a.status === status).length})
          </h3>
          <div className="space-y-2">
            {applicants
              .filter(applicant => applicant.status === status)
              .map((applicant) => (
                <Card key={applicant.id} className="p-3">
                  <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                  <div className="text-xs text-gray-500">{applicant.position}</div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Applicants</h2>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            onClick={() => setViewMode('cards')}
            size="sm"
          >
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
            size="sm"
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'pipeline' ? 'default' : 'outline'}
            onClick={() => setViewMode('pipeline')}
            size="sm"
          >
            Pipeline
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'pipeline' && renderPipelineView()}
    </div>
  );
}