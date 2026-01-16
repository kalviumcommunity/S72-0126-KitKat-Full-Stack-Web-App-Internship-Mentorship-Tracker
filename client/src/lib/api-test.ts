// API Integration Testing Utilities
// Tools for testing API integration and connectivity

import { auth, applications, feedback, notifications, dashboard } from './api';
import { checkApiHealth, getApiStatus } from './api-integration';

// ============================================
// TEST RESULTS
// ============================================

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
  error?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  duration: number;
}

// ============================================
// API CONNECTIVITY TESTS
// ============================================

export async function testApiConnectivity(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const isHealthy = await checkApiHealth();
    const duration = Date.now() - startTime;
    
    return {
      name: 'API Connectivity',
      passed: isHealthy,
      message: isHealthy 
        ? 'Successfully connected to API' 
        : 'Failed to connect to API',
      duration,
    };
  } catch (error) {
    return {
      name: 'API Connectivity',
      passed: false,
      message: 'Error testing API connectivity',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function testApiStatus(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const status = await getApiStatus();
    const duration = Date.now() - startTime;
    
    return {
      name: 'API Status Check',
      passed: status.isConnected,
      message: `API ${status.isConnected ? 'connected' : 'disconnected'} at ${status.baseUrl}`,
      duration,
    };
  } catch (error) {
    return {
      name: 'API Status Check',
      passed: false,
      message: 'Error checking API status',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// AUTHENTICATION TESTS
// ============================================

export async function testAuthEndpoints(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const startTime = Date.now();
  
  // Test 1: Get current user (should fail if not authenticated)
  const test1Start = Date.now();
  try {
    const response = await auth.getCurrentUser();
    tests.push({
      name: 'Get Current User',
      passed: response.success || response.error === 'Unauthorized',
      message: response.success 
        ? 'Successfully retrieved current user' 
        : 'Not authenticated (expected)',
      duration: Date.now() - test1Start,
    });
  } catch (error) {
    tests.push({
      name: 'Get Current User',
      passed: false,
      message: 'Error calling getCurrentUser',
      duration: Date.now() - test1Start,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;
  
  return {
    name: 'Authentication Endpoints',
    tests,
    passed,
    failed,
    duration: Date.now() - startTime,
  };
}

// ============================================
// APPLICATION TESTS
// ============================================

export async function testApplicationEndpoints(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const startTime = Date.now();
  
  // Test 1: Get all applications
  const test1Start = Date.now();
  try {
    const response = await applications.getAll();
    tests.push({
      name: 'Get All Applications',
      passed: response.success || response.error?.includes('Unauthorized'),
      message: response.success 
        ? `Retrieved ${response.data?.data?.length || 0} applications` 
        : response.error || 'Failed',
      duration: Date.now() - test1Start,
    });
  } catch (error) {
    tests.push({
      name: 'Get All Applications',
      passed: false,
      message: 'Error calling getAll',
      duration: Date.now() - test1Start,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;
  
  return {
    name: 'Application Endpoints',
    tests,
    passed,
    failed,
    duration: Date.now() - startTime,
  };
}

// ============================================
// FEEDBACK TESTS
// ============================================

export async function testFeedbackEndpoints(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const startTime = Date.now();
  
  // Test 1: Get all feedback
  const test1Start = Date.now();
  try {
    const response = await feedback.getAll();
    tests.push({
      name: 'Get All Feedback',
      passed: response.success || response.error?.includes('Unauthorized'),
      message: response.success 
        ? `Retrieved ${response.data?.data?.length || 0} feedback items` 
        : response.error || 'Failed',
      duration: Date.now() - test1Start,
    });
  } catch (error) {
    tests.push({
      name: 'Get All Feedback',
      passed: false,
      message: 'Error calling getAll',
      duration: Date.now() - test1Start,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;
  
  return {
    name: 'Feedback Endpoints',
    tests,
    passed,
    failed,
    duration: Date.now() - startTime,
  };
}

// ============================================
// NOTIFICATION TESTS
// ============================================

export async function testNotificationEndpoints(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const startTime = Date.now();
  
  // Test 1: Get unread notifications
  const test1Start = Date.now();
  try {
    const response = await notifications.getUnread();
    tests.push({
      name: 'Get Unread Notifications',
      passed: response.success || response.error?.includes('Unauthorized'),
      message: response.success 
        ? `Retrieved ${response.data?.length || 0} unread notifications` 
        : response.error || 'Failed',
      duration: Date.now() - test1Start,
    });
  } catch (error) {
    tests.push({
      name: 'Get Unread Notifications',
      passed: false,
      message: 'Error calling getUnread',
      duration: Date.now() - test1Start,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;
  
  return {
    name: 'Notification Endpoints',
    tests,
    passed,
    failed,
    duration: Date.now() - startTime,
  };
}

// ============================================
// DASHBOARD TESTS
// ============================================

export async function testDashboardEndpoints(): Promise<TestSuite> {
  const tests: TestResult[] = [];
  const startTime = Date.now();
  
  // Test 1: Get student dashboard
  const test1Start = Date.now();
  try {
    const response = await dashboard.getStudentData();
    tests.push({
      name: 'Get Student Dashboard',
      passed: response.success || response.error?.includes('Unauthorized'),
      message: response.success 
        ? 'Successfully retrieved dashboard data' 
        : response.error || 'Failed',
      duration: Date.now() - test1Start,
    });
  } catch (error) {
    tests.push({
      name: 'Get Student Dashboard',
      passed: false,
      message: 'Error calling getStudentData',
      duration: Date.now() - test1Start,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
  
  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;
  
  return {
    name: 'Dashboard Endpoints',
    tests,
    passed,
    failed,
    duration: Date.now() - startTime,
  };
}

// ============================================
// RUN ALL TESTS
// ============================================

export async function runAllTests(): Promise<{
  suites: TestSuite[];
  totalPassed: number;
  totalFailed: number;
  totalDuration: number;
}> {
  const startTime = Date.now();
  
  console.log('🧪 Running API Integration Tests...\n');
  
  // Connectivity tests
  const connectivityTest = await testApiConnectivity();
  const statusTest = await testApiStatus();
  
  const connectivitySuite: TestSuite = {
    name: 'Connectivity',
    tests: [connectivityTest, statusTest],
    passed: [connectivityTest, statusTest].filter(t => t.passed).length,
    failed: [connectivityTest, statusTest].filter(t => !t.passed).length,
    duration: connectivityTest.duration + statusTest.duration,
  };
  
  // Endpoint tests
  const authSuite = await testAuthEndpoints();
  const appSuite = await testApplicationEndpoints();
  const feedbackSuite = await testFeedbackEndpoints();
  const notificationSuite = await testNotificationEndpoints();
  const dashboardSuite = await testDashboardEndpoints();
  
  const suites = [
    connectivitySuite,
    authSuite,
    appSuite,
    feedbackSuite,
    notificationSuite,
    dashboardSuite,
  ];
  
  const totalPassed = suites.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = suites.reduce((sum, suite) => sum + suite.failed, 0);
  const totalDuration = Date.now() - startTime;
  
  // Print results
  console.log('\n📊 Test Results:\n');
  suites.forEach(suite => {
    console.log(`${suite.name}:`);
    console.log(`  ✅ Passed: ${suite.passed}`);
    console.log(`  ❌ Failed: ${suite.failed}`);
    console.log(`  ⏱️  Duration: ${suite.duration}ms\n`);
  });
  
  console.log(`\n🎯 Total: ${totalPassed} passed, ${totalFailed} failed (${totalDuration}ms)\n`);
  
  return {
    suites,
    totalPassed,
    totalFailed,
    totalDuration,
  };
}

// ============================================
// EXPORT TEST RUNNER
// ============================================

export default {
  testApiConnectivity,
  testApiStatus,
  testAuthEndpoints,
  testApplicationEndpoints,
  testFeedbackEndpoints,
  testNotificationEndpoints,
  testDashboardEndpoints,
  runAllTests,
};