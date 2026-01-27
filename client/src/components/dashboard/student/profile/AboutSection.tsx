// About Section Component
// Bio, career objectives, and interests

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function AboutSection() {
  const aboutData = {
    bio: "Passionate Computer Science student at Stanford University with a strong foundation in software development and a keen interest in artificial intelligence and machine learning. I enjoy solving complex problems and building innovative solutions that make a positive impact.",
    careerObjectives: [
      "Secure a software engineering internship at a leading tech company",
      "Develop expertise in machine learning and AI technologies",
      "Contribute to open-source projects and build a strong portfolio",
      "Transition into a full-time software engineering role after graduation"
    ],
    interests: [
      "Artificial Intelligence & Machine Learning",
      "Web Development",
      "Open Source Contribution",
      "Competitive Programming",
      "Tech Entrepreneurship",
      "Blockchain Technology"
    ]
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
          <p className="text-gray-700 leading-relaxed">{aboutData.bio}</p>
        </div>

        {/* Career Objectives */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Career Objectives</h3>
          <ul className="space-y-2">
            {aboutData.careerObjectives.map((objective, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">🎯</span>
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interests */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {aboutData.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}