// Talent Pool Highlights Component
// Summary of saved candidates and talent pool

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function TalentPoolHighlights() {
  const stats = [
    { label: 'Saved candidates', count: 23, icon: '⭐' },
    { label: 'Watchlist', count: 15, icon: '👀' },
    { label: 'Rejected but reconsidering', count: 8, icon: '🔄' }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Talent Pool Highlights</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-sm text-gray-700">{stat.label}</span>
              </div>
              <span className="font-semibold text-gray-900">{stat.count}</span>
            </div>
          ))}
          
          <div className="pt-4">
            <Button variant="default" size="sm" className="w-full">
              Browse Talent Pool
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}