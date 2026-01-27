// Stats Section Component
// Profile statistics, achievements, and metrics

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function StatsSection() {
  const statsData = {
    profileViews: 1247,
    connections: 342,
    endorsements: 89,
    mentorshipSessions: 24,
    applicationsSubmitted: 42,
    interviewsCompleted: 18,
    offersReceived: 3,
    projectsCompleted: 12,
    githubContributions: 156,
    articlesPublished: 5
  };

  const achievements = [
    {
      icon: '🏆',
      title: 'Top Performer',
      description: 'Top 5% in CS program',
      color: 'text-yellow-600'
    },
    {
      icon: '🎯',
      title: 'Goal Achiever',
      description: '100% goal completion rate',
      color: 'text-green-600'
    },
    {
      icon: '🤝',
      title: 'Mentor Favorite',
      description: '4.9/5 average rating',
      color: 'text-blue-600'
    },
    {
      icon: '📈',
      title: 'Rising Star',
      description: '300% profile growth',
      color: 'text-purple-600'
    }
  ];

  const StatItem = ({ label, value, icon }: { label: string; value: number | string; icon: string }) => (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Profile Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Profile Stats</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Profile Views" value={statsData.profileViews} icon="👁️" />
            <StatItem label="Connections" value={statsData.connections} icon="🤝" />
            <StatItem label="Endorsements" value={statsData.endorsements} icon="👍" />
            <StatItem label="Mentorship Sessions" value={statsData.mentorshipSessions} icon="🎓" />
          </div>
        </CardContent>
      </Card>

      {/* Application Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Application Stats</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Applications" value={statsData.applicationsSubmitted} icon="📝" />
            <StatItem label="Interviews" value={statsData.interviewsCompleted} icon="💼" />
            <StatItem label="Offers" value={statsData.offersReceived} icon="🎉" />
            <StatItem 
              label="Success Rate" 
              value={`${Math.round((statsData.offersReceived / statsData.applicationsSubmitted) * 100)}%`} 
              icon="📊" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Stats */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Projects" value={statsData.projectsCompleted} icon="🚀" />
            <StatItem label="GitHub Contributions" value={statsData.githubContributions} icon="💻" />
            <StatItem label="Articles" value={statsData.articlesPublished} icon="📚" />
            <StatItem label="This Month" value="24" icon="📅" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${achievement.color}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">📊</span>
                <span className="text-blue-800 font-medium">View Analytics</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-green-600">📝</span>
                <span className="text-green-800 font-medium">Update Resume</span>
              </div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-purple-600">🎯</span>
                <span className="text-purple-800 font-medium">Set New Goals</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}