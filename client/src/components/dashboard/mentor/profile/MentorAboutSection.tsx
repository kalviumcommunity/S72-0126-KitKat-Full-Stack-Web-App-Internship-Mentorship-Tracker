// Mentor About Section Component
// Bio, expertise, and mentoring philosophy

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function MentorAboutSection() {
  const aboutData = {
    bio: "Passionate software engineer with 8+ years of experience at Google, specializing in AI/ML systems and large-scale distributed architectures. I've mentored over 127 students, helping them secure positions at top tech companies including Google, Meta, Amazon, and Microsoft. My approach focuses on practical skills, interview preparation, and career strategy.",
    mentorPhilosophy: "I believe in empowering students through hands-on learning and personalized guidance. Every mentee is unique, and I tailor my approach to their specific goals, strengths, and areas for improvement. My goal is not just to help you land a job, but to build a sustainable and fulfilling career in tech.",
    expertise: [
      "Technical Interview Preparation",
      "System Design & Architecture",
      "Machine Learning & AI",
      "Career Strategy & Planning",
      "Resume & Portfolio Review",
      "Behavioral Interview Coaching",
      "Salary Negotiation",
      "Leadership Development"
    ],
    achievements: [
      "127 students mentored with 85% success rate",
      "Top 1% mentor on the platform",
      "Published 15+ technical articles",
      "Speaker at 10+ tech conferences",
      "Led teams of 20+ engineers at Google",
      "Contributed to open-source projects with 50K+ stars"
    ],
    languages: ["English (Native)", "Spanish (Fluent)", "Mandarin (Conversational)"]
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">About</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Professional Background</h3>
          <p className="text-gray-700 leading-relaxed">{aboutData.bio}</p>
        </div>

        {/* Mentoring Philosophy */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Mentoring Philosophy</h3>
          <p className="text-gray-700 leading-relaxed">{aboutData.mentorPhilosophy}</p>
        </div>

        {/* Expertise Areas */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Areas of Expertise</h3>
          <div className="grid grid-cols-2 gap-2">
            {aboutData.expertise.map((area, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Achievements */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Key Achievements</h3>
          <div className="space-y-2">
            {aboutData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">🏆</span>
                <span className="text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {aboutData.languages.map((language, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}