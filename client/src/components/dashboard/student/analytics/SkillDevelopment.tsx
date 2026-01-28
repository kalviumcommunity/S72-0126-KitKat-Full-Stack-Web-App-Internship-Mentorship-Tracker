// Skill Development Component
// Skills heatmap, learning path progress, and development tracking

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { TimeRange } from '@/app/dashboard/user/analytics/page';

interface SkillDevelopmentProps {
  timeRange: TimeRange;
}

export function SkillDevelopment({ timeRange }: SkillDevelopmentProps) {
  const skillsHeatmap = [
    { skill: 'JavaScript', proficiency: 85, growth: 15, mentorGaps: false },
    { skill: 'React', proficiency: 80, growth: 20, mentorGaps: false },
    { skill: 'Python', proficiency: 75, growth: 10, mentorGaps: false },
    { skill: 'Node.js', proficiency: 70, growth: 25, mentorGaps: false },
    { skill: 'AWS', proficiency: 60, growth: 30, mentorGaps: true },
    { skill: 'Docker', proficiency: 45, growth: 35, mentorGaps: true },
    { skill: 'System Design', proficiency: 55, growth: 20, mentorGaps: true },
    { skill: 'SQL', proficiency: 65, growth: 15, mentorGaps: false }
  ];

  const learningPath = {
    coursesCompleted: 8,
    totalCourses: 12,
    certificationsEarned: 3,
    projectsCompleted: 5,
    nextSuggestedSkill: 'Docker',
    recommendedCourses: [
      { title: 'Docker Fundamentals', provider: 'Coursera', duration: '4 weeks' },
      { title: 'Kubernetes Basics', provider: 'Udemy', duration: '3 weeks' },
      { title: 'System Design Interview', provider: 'Educative', duration: '6 weeks' }
    ]
  };

  const getSkillColor = (proficiency: number) => {
    if (proficiency >= 80) return 'bg-green-500';
    if (proficiency >= 60) return 'bg-yellow-500';
    if (proficiency >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 25) return 'text-green-600';
    if (growth >= 15) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Skill Development</h2>
      
      <div className="space-y-6">
        {/* Skills Heatmap */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Skills Assessment</h3>
            <p className="text-sm text-gray-600">Proficiency levels and growth tracking</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillsHeatmap.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{skill.skill}</span>
                      {skill.mentorGaps && (
                        <Badge className="bg-red-100 text-red-800" size="sm">
                          Gap Identified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">
                        {skill.proficiency}%
                      </span>
                      <span className={`text-xs font-medium ${getGrowthColor(skill.growth)}`}>
                        +{skill.growth}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getSkillColor(skill.proficiency)}`}
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <div className="w-16 bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(skill.growth * 2, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Proficiency:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Expert (80%+)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Intermediate (60-79%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Beginner (40-59%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Learning (&lt;40%)</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Growth Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Path Progress */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Learning Path Progress</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {learningPath.coursesCompleted}/{learningPath.totalCourses}
                  </div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {learningPath.certificationsEarned}
                  </div>
                  <p className="text-sm text-gray-600">Certifications Earned</p>
                </div>
              </div>

              {/* Course Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-gray-600">
                    {Math.round((learningPath.coursesCompleted / learningPath.totalCourses) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(learningPath.coursesCompleted / learningPath.totalCourses) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Projects Completed */}
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Projects Completed
                  </span>
                  <Badge className="bg-green-100 text-green-800">
                    {learningPath.projectsCompleted}
                  </Badge>
                </div>
              </div>

              {/* Next Suggested Skill */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Next Suggested Skill</h4>
                    <p className="text-sm text-blue-700">{learningPath.nextSuggestedSkill}</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Learning
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Courses */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recommended Courses</h3>
            <p className="text-sm text-gray-600">Based on your skill gaps and career goals</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningPath.recommendedCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">
                      {course.provider} • {course.duration}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      View Course
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Enroll
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}