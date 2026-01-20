'use client';

// API Integration Test Page
// Admin page for testing API connectivity and endpoints

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { runAllTests, type TestSuite } from '@/lib/api-test';
import { getApiStatus, type ApiIntegrationStatus } from '@/lib/api-integration';

export default function ApiTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiIntegrationStatus | null>(null);
  const [testResults, setTestResults] = useState<{
    suites: TestSuite[];
    totalPassed: number;
    totalFailed: number;
    totalDuration: number;
  } | null>(null);

  const handleCheckStatus = async () => {
    const status = await getApiStatus();
    setApiStatus(status);
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const results = await runAllTests();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Integration Test</h1>
        <p className="text-gray-600 mt-1">
          Test API connectivity and endpoint functionality
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Button onClick={handleCheckStatus} variant="outline">
          Check API Status
        </Button>
        <Button onClick={handleRunTests} disabled={isRunning}>
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {/* API Status */}
      {apiStatus && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">API Status</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Connection Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={apiStatus.isConnected ? 'default' : 'destructive'}>
                    {apiStatus.isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Base URL</p>
                <p className="text-sm text-gray-900 mt-1">{apiStatus.baseUrl}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Using Mock Data</p>
                <p className="text-sm text-gray-900 mt-1">
                  {apiStatus.useMockData ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Checked</p>
                <p className="text-sm text-gray-900 mt-1">
                  {apiStatus.lastChecked.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Test Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {testResults.totalPassed}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Passed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-3xl font-bold text-red-600">
                    {testResults.totalFailed}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Failed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {testResults.totalDuration}ms
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Suites */}
          <div className="space-y-4">
            {testResults.suites.map((suite) => (
              <Card key={suite.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {suite.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">{suite.passed} passed</Badge>
                      {suite.failed > 0 && (
                        <Badge variant="destructive">{suite.failed} failed</Badge>
                      )}
                      <span className="text-sm text-gray-500">{suite.duration}ms</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suite.tests.map((test, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          test.passed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {test.passed ? '✅' : '❌'}
                              </span>
                              <p className="font-medium text-gray-900">
                                {test.name}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {test.message}
                            </p>
                            {test.error && (
                              <p className="text-xs text-red-600 mt-1 font-mono">
                                {test.error}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-4">
                            {test.duration}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Instructions */}
      {!testResults && !isRunning && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Before Running Tests:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Ensure the backend server is running on port 3001</li>
                  <li>Check that the database is connected</li>
                  <li>Verify environment variables are configured</li>
                  <li>Make sure CORS is enabled for localhost:3000</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">What Gets Tested:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>API connectivity and health check</li>
                  <li>Authentication endpoints</li>
                  <li>Application CRUD endpoints</li>
                  <li>Feedback endpoints</li>
                  <li>Notification endpoints</li>
                  <li>Dashboard data endpoints</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Some tests may fail if you're not authenticated. 
                  This is expected behavior. The tests verify that endpoints are reachable 
                  and respond correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}