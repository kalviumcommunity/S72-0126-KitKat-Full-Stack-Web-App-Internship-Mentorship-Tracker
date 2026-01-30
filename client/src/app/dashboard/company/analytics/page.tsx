// Analytics Report Page
// Clean interface for viewing company analytics and reports

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalJobs: number;
    totalApplications: number;
    hireRate: number;
    avgTimeToHire: number;
  };
  applicationTrends: {
    month: string;
    applications: number;
    hires: number;
  }[];
  topPerformingJobs: {
    title: string;
    applications: number;
    hires: number;
    conversionRate: number;
  }[];
  candidateSource: {
    source: string;
    applications: number;
    percentage: number;
  }[];
  hiringFunnel: {
    stage: string;
    count: number;
    percentage: number;
  }[];
}

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  overview: {
    totalJobs: 12,
    totalApplications: 245,
    hireRate: 18.4,
    avgTimeToHire: 21,
  },
  applicationTrends: [
    { month: 'Oct', applications: 45, hires: 8 },
    { month: 'Nov', applications: 52, hires: 12 },
    { month: 'Dec', applications: 38, hires: 6 },
    { month: 'Jan', applications: 67, hires: 15 },
  ],
  topPerformingJobs: [
    { title: 'Software Engineer Intern', applications: 89, hires: 12, conversionRate: 13.5 },
    { title: 'Product Manager', applications: 56, hires: 8, conversionRate: 14.3 },
    { title: 'Data Analyst Intern', applications: 43, hires: 5, conversionRate: 11.6 },
    { title: 'UX Designer', applications: 34, hires: 4, conversionRate: 11.8 },
  ],
  candidateSource: [
    { source: 'LinkedIn', applications: 98, percentage: 40 },
    { source: 'Company Website', applications: 73, percentage: 30 },
    { source: 'Indeed', applications: 49, percentage: 20 },
    { source: 'Referrals', applications: 25, percentage: 10 },
  ],
  hiringFunnel: [
    { stage: 'Applications', count: 245, percentage: 100 },
    { stage: 'Screening', count: 147, percentage: 60 },
    { stage: 'Interview', count: 73, percentage: 30 },
    { stage: 'Final Round', count: 49, percentage: 20 },
    { stage: 'Hired', count: 45, percentage: 18.4 },
  ],
};

export default function AnalyticsReportPage() {
  const { user } = useAuth();
  const [analytics] = useState<AnalyticsData>(mockAnalytics);
  const [selectedPeriod, setSelectedPeriod] = useState('Last 3 Months');

  if (!user || user.role !== UserRole.MENTOR) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium text-gray-900">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const periods = ['Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/company">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                  Analytics Report
                </h1>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Insights and metrics for your hiring performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {periods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6">
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-3xl font-light text-gray-900 mb-1">{analytics.overview.totalJobs}</p>
                <p className="text-sm text-gray-600">Active Job Postings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-3xl font-light text-gray-900 mb-1">{analytics.overview.totalApplications}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-3xl font-light text-gray-900 mb-1">{analytics.overview.hireRate}%</p>
                <p className="text-sm text-gray-600">Hire Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-3xl font-light text-gray-900 mb-1">{analytics.overview.avgTimeToHire}</p>
                <p className="text-sm text-gray-600">Avg. Days to Hire</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Application Trends */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Application Trends</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analytics.applicationTrends.map((trend, index) => (
                  <div key={trend.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600">{trend.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Applications: {trend.applications}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Hires: {trend.hires}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-1">
                          <div 
                            className="h-2 bg-blue-200 rounded-full"
                            style={{ width: `${(trend.applications / 70) * 100}%` }}
                          ></div>
                          <div 
                            className="h-2 bg-green-200 rounded-full"
                            style={{ width: `${(trend.hires / 70) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hiring Funnel */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Hiring Funnel</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analytics.hiringFunnel.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{stage.count}</span>
                        <Badge variant="neutral" size="sm" className="rounded-full">
                          {stage.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Performing Jobs */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Top Performing Jobs</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analytics.topPerformingJobs.map((job, index) => (
                  <div key={job.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{job.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{job.applications} applications</span>
                        <span>•</span>
                        <span>{job.hires} hires</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-green-600">{job.conversionRate}%</div>
                      <div className="text-xs text-gray-500">conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Candidate Sources */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Candidate Sources</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analytics.candidateSource.map((source, index) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{source.applications}</span>
                        <Badge variant="neutral" size="sm" className="rounded-full">
                          {source.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}