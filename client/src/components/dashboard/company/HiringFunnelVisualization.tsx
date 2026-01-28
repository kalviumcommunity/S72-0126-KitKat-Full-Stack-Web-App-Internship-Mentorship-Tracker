// Hiring Funnel Visualization Component
// Visual representation of hiring pipeline across all positions

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function HiringFunnelVisualization() {
  const funnelData = [
    { stage: 'Applied', count: 184, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Reviewed', count: 120, percentage: 65, color: 'bg-green-500' },
    { stage: 'Shortlisted', count: 45, percentage: 24, color: 'bg-yellow-500' },
    { stage: 'Interview', count: 12, percentage: 7, color: 'bg-orange-500' },
    { stage: 'Offer', count: 6, percentage: 3, color: 'bg-purple-500' },
    { stage: 'Hired', count: 4, percentage: 2, color: 'bg-emerald-500' }
  ];

  const conversionRates = [
    { from: 'Applied', to: 'Reviewed', rate: 65 },
    { from: 'Reviewed', to: 'Shortlisted', rate: 38 },
    { from: 'Shortlisted', to: 'Interview', rate: 27 },
    { from: 'Interview', to: 'Offer', rate: 50 },
    { from: 'Offer', to: 'Hired', rate: 67 }
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Hiring Funnel Visualization</h2>
        <p className="text-sm text-gray-600">Across all active positions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Funnel Visualization */}
          <div className="space-y-3">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{stage.count}</span>
                    <span className="text-sm text-gray-500">({stage.percentage}%)</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-center text-white font-medium text-sm`}
                    style={{ width: `${stage.percentage}%` }}
                  >
                    {stage.count}
                  </div>
                </div>

                {/* Conversion Rate Arrow */}
                {index < funnelData.length - 1 && (
                  <div className="flex items-center justify-center mt-2 mb-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>↓</span>
                      <span className="font-medium">{conversionRates[index]?.rate}% conversion</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Drop-off Analysis */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Drop-off Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Biggest drop-off:</p>
                <p className="font-medium text-red-600">Reviewed → Shortlisted (62% drop)</p>
              </div>
              <div>
                <p className="text-gray-600">Best conversion:</p>
                <p className="font-medium text-green-600">Offer → Hired (67%)</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}