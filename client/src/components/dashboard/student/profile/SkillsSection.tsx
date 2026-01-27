// Skills Section Component
// Technical skills with endorsements, soft skills, and languages

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function SkillsSection() {
  const skillsData = {
    technicalSkills: [
      { name: 'JavaScript', level: 'Advanced', endorsements: 12 },
      { name: 'React', level: 'Advanced', endorsements: 10 },
      { name: 'Python', level: 'Intermediate', endorsements: 8 },
      { name: 'Node.js', level: 'Intermediate', endorsements: 6 },
      { name: 'AWS', level: 'Beginner', endorsements: 4 },
      { name: 'MongoDB', level: 'Intermediate', endorsements: 5 }
    ],
    softSkills: [
      'Problem Solving',
      'Team Collaboration',
      'Communication',
      'Leadership',
      'Time Management',
      'Critical Thinking'
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Conversational' },
      { language: 'French', proficiency: 'Basic' }
    ]
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Advanced': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Beginner': 'bg-blue-100 text-blue-800'
    };
    return colors[level as keyof typeof colors];
  };

  const getLevelWidth = (level: string) => {
    const widths = {
      'Advanced': 'w-full',
      'Intermediate': 'w-3/4',
      'Beginner': 'w-1/2'
    };
    return widths[level as keyof typeof widths];
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Technical Skills */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Technical Skills</h3>
          <div className="space-y-4">
            {skillsData.technicalSkills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={getLevelColor(skill.level)} size="sm">
                      {skill.level}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {skill.endorsements} endorsements
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`bg-blue-600 h-2 rounded-full ${getLevelWidth(skill.level)}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Soft Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skillsData.softSkills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Languages</h3>
          <div className="space-y-2">
            {skillsData.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-900">{lang.language}</span>
                <Badge variant="outline" size="sm">
                  {lang.proficiency}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}