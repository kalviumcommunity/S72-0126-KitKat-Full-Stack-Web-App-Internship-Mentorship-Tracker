// Loading component for feedback page

import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function FeedbackLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 w-28 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List Skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Tags */}
                <div className="flex gap-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}