// Feedback Templates Component
// Pre-built templates for common feedback scenarios

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function FeedbackTemplates() {
  const templates = [
    {
      id: 1,
      name: 'Resume Review Checklist',
      category: 'Resume',
      icon: '📝',
      description: 'Comprehensive template for reviewing student resumes',
      usageCount: 23,
      lastUsed: '2 days ago',
      sections: {
        strengths: [
          'Clear and professional formatting',
          'Relevant technical skills highlighted',
          'Quantified achievements where possible',
          'Appropriate length and structure'
        ],
        improvements: [
          'Add more quantifiable metrics to achievements',
          'Improve action verb usage',
          'Optimize for ATS systems',
          'Enhance project descriptions'
        ],
        recommendations: [
          'Use stronger action verbs (implemented, optimized, developed)',
          'Add specific metrics and impact numbers',
          'Include relevant keywords for target roles',
          'Consider adding a brief summary section'
        ],
        actionItems: [
          'Revise project descriptions with quantified impact',
          'Research and add industry-specific keywords',
          'Get resume reviewed by 2-3 professionals',
          'Create tailored versions for different role types'
        ]
      }
    },
    {
      id: 2,
      name: 'Technical Interview Feedback',
      category: 'Interview',
      icon: '🎤',
      description: 'Structured feedback for technical interview performance',
      usageCount: 18,
      lastUsed: '1 day ago',
      sections: {
        strengths: [
          'Strong problem-solving approach',
          'Good communication during coding',
          'Solid understanding of data structures',
          'Asked clarifying questions'
        ],
        improvements: [
          'Practice more complex algorithm problems',
          'Improve time complexity analysis',
          'Work on explaining thought process clearly',
          'Practice coding under time pressure'
        ],
        recommendations: [
          'Focus on LeetCode medium-level problems',
          'Practice whiteboard coding sessions',
          'Study system design fundamentals',
          'Mock interview with peers weekly'
        ],
        actionItems: [
          'Complete 5 LeetCode problems daily',
          'Schedule weekly mock interviews',
          'Review time/space complexity concepts',
          'Practice explaining solutions out loud'
        ]
      }
    },
    {
      id: 3,
      name: 'Behavioral Interview Assessment',
      category: 'Interview',
      icon: '💬',
      description: 'Template for behavioral interview feedback and improvement',
      usageCount: 15,
      lastUsed: '3 days ago',
      sections: {
        strengths: [
          'Used STAR method effectively',
          'Provided concrete examples',
          'Showed leadership potential',
          'Demonstrated growth mindset'
        ],
        improvements: [
          'Prepare more diverse examples',
          'Practice storytelling techniques',
          'Work on concise responses',
          'Develop failure/learning stories'
        ],
        recommendations: [
          'Prepare 5-7 core stories using STAR method',
          'Practice with common behavioral questions',
          'Research company values and culture',
          'Develop questions to ask interviewers'
        ],
        actionItems: [
          'Write out 7 STAR method stories',
          'Practice responses with timer (2-3 minutes)',
          'Research target company culture',
          'Prepare thoughtful questions for interviewer'
        ]
      }
    },
    {
      id: 4,
      name: 'Career Strategy Discussion',
      category: 'Career',
      icon: '🎯',
      description: 'Framework for career planning and goal setting',
      usageCount: 12,
      lastUsed: '1 week ago',
      sections: {
        strengths: [
          'Clear vision of career goals',
          'Strong technical foundation',
          'Good self-awareness',
          'Proactive learning approach'
        ],
        improvements: [
          'Develop more specific short-term goals',
          'Build stronger professional network',
          'Gain more industry exposure',
          'Create measurable milestones'
        ],
        recommendations: [
          'Set SMART goals for next 6 months',
          'Attend industry meetups and conferences',
          'Connect with professionals on LinkedIn',
          'Consider informational interviews'
        ],
        actionItems: [
          'Define 3 specific 6-month goals',
          'Join 2 relevant professional groups',
          'Reach out to 5 industry professionals',
          'Create monthly progress review schedule'
        ]
      }
    },
    {
      id: 5,
      name: 'Mock Interview Assessment',
      category: 'Interview',
      icon: '🎭',
      description: 'Comprehensive evaluation template for mock interviews',
      usageCount: 20,
      lastUsed: '4 hours ago',
      sections: {
        strengths: [
          'Confident presentation',
          'Good technical knowledge',
          'Handled pressure well',
          'Professional demeanor'
        ],
        improvements: [
          'Improve initial problem analysis',
          'Practice edge case consideration',
          'Work on code optimization',
          'Enhance communication clarity'
        ],
        recommendations: [
          'Practice more system design problems',
          'Focus on code readability and structure',
          'Prepare for follow-up questions',
          'Study company-specific interview formats'
        ],
        actionItems: [
          'Complete system design course',
          'Practice 3 coding problems daily',
          'Schedule follow-up mock interview',
          'Research target company interview process'
        ]
      }
    }
  ];

  const handleUseTemplate = (templateId: number) => {
    console.log('Using template:', templateId);
    // Navigate to create feedback with template pre-filled
  };

  const handleCustomizeTemplate = (templateId: number) => {
    console.log('Customizing template:', templateId);
    // Open template editor
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Resume': 'bg-blue-100 text-blue-800',
      'Interview': 'bg-green-100 text-green-800',
      'Career': 'bg-purple-100 text-purple-800',
      'Technical': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Feedback Templates</h2>
          <p className="text-gray-600 mt-1">Pre-built templates to streamline your feedback process</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Create New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Usage Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Used {template.usageCount} times</span>
                  <span>Last used {template.lastUsed}</span>
                </div>

                {/* Template Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Template Structure:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Strengths ({template.sections.strengths.length} points)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚠</span>
                      <span>Areas for Improvement ({template.sections.improvements.length} points)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">💡</span>
                      <span>Recommendations ({template.sections.recommendations.length} points)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600">📋</span>
                      <span>Action Items ({template.sections.actionItems.length} tasks)</span>
                    </div>
                  </div>
                </div>

                {/* Sample Content Preview */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-1">Sample Strengths:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {template.sections.strengths.slice(0, 2).map((strength, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                    {template.sections.strengths.length > 2 && (
                      <li className="text-blue-600">+ {template.sections.strengths.length - 2} more...</li>
                    )}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Use Template
                  </Button>
                  <Button
                    onClick={() => handleCustomizeTemplate(template.id)}
                    variant="outline"
                  >
                    Customize
                  </Button>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Custom Template */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">➕</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Template</h3>
          <p className="text-gray-600 mb-4">
            Build your own feedback template tailored to your mentoring style
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Start Building
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}