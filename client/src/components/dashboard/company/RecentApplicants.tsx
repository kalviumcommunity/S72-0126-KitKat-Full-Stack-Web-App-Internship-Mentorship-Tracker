// Recent Applicants Component
// Timeline showing latest applications

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function RecentApplicants() {
  const applicants = [
    {
      id: '1',
      name: 'Sarah Johnson',
      university: 'Stanford University',
      position: 'Software Engineering Intern',
      appliedTime: '2 hours ago',
      matchScore: 92,
      photo: '👩‍💻'
    },
    {
      id: '2',
      name: 'Michael Chen',
      university: 'MIT',
      position: 'Data Science Intern',
      appliedTime: '4 hours ago',
      matchScore: 88,
      photo: '👨‍💻'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      university: 'UC Berkeley',
      position: 'Product Management Intern',
      appliedTime: '6 hours ago',
      matchScore: 85,
      photo: '👩‍💼'
    },
    {
      id: '4',
      name: 'David Kim',
      university: 'Carnegie Mellon',
      position: 'Software Engineering Intern',
      appliedTime: '1 day ago',
      matchScore: 90,
      photo: '👨‍💻'
    },
    {
      id: '5',
      name: 'Jessica Wang',
      university: 'Harvard University',
      position: 'Data Science Intern',
      appliedTime: '1 day ago',
      matchScore: 87,
      photo: '👩‍🔬'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Applicants</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl">{applicant.photo}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{applicant.name}</h3>
                  <Badge variant="secondary" size="sm">
                    {applicant.matchScore}% match
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{applicant.university}</p>
                <p className="text-sm text-gray-500">Applied for: {applicant.position}</p>
                <p className="text-xs text-gray-400">{applicant.appliedTime}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="default">
                  View Profile
                </Button>
                <Button size="sm" variant="outline">
                  Shortlist
                </Button>
                <Button size="sm" variant="outline">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}