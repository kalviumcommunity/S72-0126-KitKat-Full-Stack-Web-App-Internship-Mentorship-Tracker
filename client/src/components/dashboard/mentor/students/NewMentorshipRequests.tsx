// New Mentorship Requests Component
// Shows pending mentorship requests for mentor approval

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function NewMentorshipRequests() {
  const requests = [
    {
      id: 1,
      student: {
        name: 'Alex Rodriguez',
        avatar: '👨‍💻',
        email: 'alex.rodriguez@mit.edu',
        school: 'MIT',
        major: 'Computer Science',
        year: 'Junior',
        gpa: '3.8'
      },
      requestDate: '2 days ago',
      reason: 'I am passionate about machine learning and AI, and I would love to learn from your experience at Google. I am particularly interested in your work on recommendation systems and would appreciate guidance on technical interviews and career development in AI/ML.',
      goals: [
        'Land an ML engineering internship at a top tech company',
        'Improve technical interview skills, especially system design',
        'Build a strong portfolio of ML projects',
        'Network with professionals in the AI/ML field'
      ],
      background: 'Currently working on a computer vision project for autonomous vehicles. Previous internship at a startup focusing on NLP. Strong foundation in Python, TensorFlow, and PyTorch.',
      compatibilityScore: 92,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Computer Vision', 'NLP'],
      projects: [
        'Autonomous Vehicle Object Detection System',
        'Sentiment Analysis for Social Media',
        'Recommendation Engine for E-commerce'
      ]
    },
    {
      id: 2,
      student: {
        name: 'Priya Patel',
        avatar: '👩‍💼',
        email: 'priya.patel@stanford.edu',
        school: 'Stanford University',
        major: 'Computer Science',
        year: 'Senior',
        gpa: '3.9'
      },
      requestDate: '1 day ago',
      reason: 'As a senior preparing for full-time roles, I would benefit greatly from your mentorship. Your experience in both technical leadership and product management aligns perfectly with my career aspirations. I am particularly interested in learning about the transition from individual contributor to tech lead.',
      goals: [
        'Secure a software engineering role at a FAANG company',
        'Develop leadership and communication skills',
        'Learn about product management and technical strategy',
        'Build a network in the tech industry'
      ],
      background: 'Software engineering intern at Meta last summer. Led a team of 4 students in a capstone project. Strong background in full-stack development and system design.',
      compatibilityScore: 88,
      skills: ['React', 'Node.js', 'System Design', 'Leadership', 'Product Management'],
      projects: [
        'Social Media Analytics Platform',
        'Distributed Task Scheduler',
        'Real-time Collaboration Tool'
      ]
    },
    {
      id: 3,
      student: {
        name: 'David Kim',
        avatar: '👨‍🎓',
        email: 'david.kim@berkeley.edu',
        school: 'UC Berkeley',
        major: 'Electrical Engineering & Computer Science',
        year: 'Sophomore',
        gpa: '3.7'
      },
      requestDate: '3 hours ago',
      reason: 'I am early in my career journey and would love guidance on choosing the right specialization and building relevant skills. Your diverse experience across different domains would help me make informed decisions about my career path.',
      goals: [
        'Decide between software engineering and data science career paths',
        'Secure my first technical internship',
        'Build foundational skills in algorithms and data structures',
        'Learn about different tech company cultures'
      ],
      background: 'Strong academic performance with focus on algorithms and mathematics. Completed several online courses in data science and web development. Looking for real-world guidance.',
      compatibilityScore: 75,
      skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'SQL'],
      projects: [
        'Personal Finance Tracker Web App',
        'Data Analysis of Campus Energy Usage',
        'Algorithm Visualization Tool'
      ]
    }
  ];

  const getCompatibilityColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">New Mentorship Requests</h2>
        <Badge className="bg-blue-100 text-blue-800">
          {requests.length} pending
        </Badge>
      </div>

      {requests.map((request) => (
        <Card key={request.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                  {request.student.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.student.name}</h3>
                  <p className="text-gray-600">{request.student.email}</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{request.student.school}</span>
                    <span>•</span>
                    <span>{request.student.major}</span>
                    <span>•</span>
                    <span>{request.student.year}</span>
                    <span>•</span>
                    <span>GPA: {request.student.gpa}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getCompatibilityColor(request.compatibilityScore)}>
                  {request.compatibilityScore}% Match
                </Badge>
                <p className="text-sm text-gray-500 mt-1">Requested {request.requestDate}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Why they want mentorship */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Why they want you as their mentor:</h4>
                <p className="text-gray-700 leading-relaxed">{request.reason}</p>
              </div>

              {/* Goals */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Their goals:</h4>
                <ul className="space-y-1">
                  {request.goals.map((goal, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">🎯</span>
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Background */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Background:</h4>
                <p className="text-gray-700">{request.background}</p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {request.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recent Projects:</h4>
                <ul className="space-y-1">
                  {request.projects.map((project, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">🚀</span>
                      <span className="text-gray-700">{project}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <Button className="bg-green-600 hover:bg-green-700">
                  Accept Request
                </Button>
                <Button variant="outline">
                  View Full Profile
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:border-red-300">
                  Decline
                </Button>
                <Button variant="outline">
                  Schedule Interview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}