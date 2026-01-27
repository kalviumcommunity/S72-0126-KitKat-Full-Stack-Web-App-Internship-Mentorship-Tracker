// Experience Section Component
// Previous internships, projects, achievements, and publications

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ExperienceSection() {
  const experienceData = {
    internships: [
      {
        title: 'Software Engineering Intern',
        company: 'TechCorp',
        duration: 'Summer 2023',
        location: 'San Francisco, CA',
        description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
      }
    ],
    projects: [
      {
        title: 'AI-Powered Study Assistant',
        duration: 'Jan 2024 - Present',
        description: 'Built a machine learning application that helps students optimize their study schedules using natural language processing and recommendation algorithms.',
        technologies: ['Python', 'TensorFlow', 'Flask', 'React'],
        link: 'https://github.com/johndoe/study-assistant'
      },
      {
        title: 'E-commerce Platform',
        duration: 'Sep 2023 - Dec 2023',
        description: 'Developed a full-stack e-commerce platform with user authentication, payment processing, and inventory management.',
        technologies: ['Next.js', 'PostgreSQL', 'Stripe API', 'Tailwind CSS'],
        link: 'https://github.com/johndoe/ecommerce-platform'
      }
    ],
    achievements: [
      {
        title: 'Dean\'s List',
        organization: 'Stanford University',
        date: 'Fall 2023',
        description: 'Achieved GPA of 3.9+ for academic excellence'
      },
      {
        title: 'Hackathon Winner',
        organization: 'Stanford TreeHacks 2023',
        date: 'Feb 2023',
        description: 'First place in AI/ML category for developing an innovative healthcare solution'
      },
      {
        title: 'Open Source Contributor',
        organization: 'React.js Community',
        date: 'Ongoing',
        description: 'Active contributor to React ecosystem with 50+ merged pull requests'
      }
    ],
    publications: [
      {
        title: 'Machine Learning Approaches to Student Performance Prediction',
        venue: 'Stanford Undergraduate Research Journal',
        date: 'Dec 2023',
        authors: 'John Doe, Dr. Jane Smith',
        link: 'https://example.com/publication'
      }
    ]
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Internships */}
        {experienceData.internships.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Internships</h3>
            <div className="space-y-4">
              {experienceData.internships.map((internship, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{internship.title}</h4>
                      <p className="text-blue-600 font-medium">{internship.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{internship.duration}</p>
                      <p>{internship.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{internship.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {internship.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Projects</h3>
          <div className="space-y-4">
            {experienceData.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{project.title}</h4>
                    {project.link && (
                      <a href={project.link} className="text-blue-600 hover:underline text-sm">
                        View Project →
                      </a>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{project.duration}</span>
                </div>
                <p className="text-gray-700 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-4">
            {experienceData.achievements.map((achievement, index) => (
              <div key={index} className="border-l-4 border-yellow-500 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-yellow-600 font-medium">{achievement.organization}</p>
                  </div>
                  <span className="text-sm text-gray-500">{achievement.date}</span>
                </div>
                <p className="text-gray-700">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Publications */}
        {experienceData.publications.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Publications</h3>
            <div className="space-y-4">
              {experienceData.publications.map((publication, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{publication.title}</h4>
                      <p className="text-purple-600 font-medium">{publication.venue}</p>
                      <p className="text-sm text-gray-600">{publication.authors}</p>
                    </div>
                    <span className="text-sm text-gray-500">{publication.date}</span>
                  </div>
                  {publication.link && (
                    <a href={publication.link} className="text-blue-600 hover:underline text-sm">
                      Read Publication →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}