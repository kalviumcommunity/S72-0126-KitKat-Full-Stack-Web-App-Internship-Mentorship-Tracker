// Education Section Component
// Academic background, courses, certifications, and GPA

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function EducationSection() {
  const educationData = {
    degrees: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Stanford University',
        duration: '2022 - 2026 (Expected)',
        location: 'Stanford, CA',
        gpa: '3.9/4.0',
        status: 'In Progress',
        relevantCourses: [
          'Data Structures and Algorithms',
          'Machine Learning',
          'Database Systems',
          'Software Engineering',
          'Computer Networks',
          'Artificial Intelligence'
        ]
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: 'Dec 2023',
        credentialId: 'AWS-CCP-2023-001',
        link: 'https://aws.amazon.com/certification/verify'
      },
      {
        name: 'Google Analytics Certified',
        issuer: 'Google',
        date: 'Oct 2023',
        credentialId: 'GA-2023-456',
        link: 'https://skillshop.exceedlms.com/student/award/verify'
      },
      {
        name: 'React Developer Certification',
        issuer: 'Meta',
        date: 'Sep 2023',
        credentialId: 'META-REACT-789',
        link: 'https://www.coursera.org/account/accomplishments/verify'
      }
    ],
    onlineCourses: [
      {
        title: 'Deep Learning Specialization',
        provider: 'Coursera (deeplearning.ai)',
        completion: 'Jan 2024',
        grade: '98%'
      },
      {
        title: 'Full Stack Web Development',
        provider: 'freeCodeCamp',
        completion: 'Aug 2023',
        grade: 'Completed'
      },
      {
        title: 'Advanced React Patterns',
        provider: 'Udemy',
        completion: 'Jun 2023',
        grade: '95%'
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Education</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Degrees */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Academic Background</h3>
          <div className="space-y-4">
            {educationData.degrees.map((degree, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{degree.degree}</h4>
                    <p className="text-blue-600 font-medium">{degree.institution}</p>
                    <p className="text-sm text-gray-600">{degree.location}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">{degree.duration}</p>
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      GPA: {degree.gpa}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h5 className="font-medium text-gray-800 mb-2">Relevant Coursework:</h5>
                  <div className="flex flex-wrap gap-2">
                    {degree.relevantCourses.map((course, courseIndex) => (
                      <Badge key={courseIndex} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Certifications</h3>
          <div className="space-y-4">
            {educationData.certifications.map((cert, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-green-600 font-medium">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{cert.date}</p>
                    <a 
                      href={cert.link} 
                      className="text-blue-600 hover:underline text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Courses */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Online Learning</h3>
          <div className="space-y-4">
            {educationData.onlineCourses.map((course, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                    <p className="text-purple-600 font-medium">{course.provider}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">{course.completion}</p>
                    <Badge className="bg-purple-100 text-purple-800 mt-1" size="sm">
                      {course.grade}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}