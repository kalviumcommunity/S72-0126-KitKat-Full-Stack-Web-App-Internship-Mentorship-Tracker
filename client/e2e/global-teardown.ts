// Playwright Global Teardown
// Cleanup tasks that run after all tests

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  try {
    // Cleanup test data if needed
    console.log('🗑️ Cleaning up test data...');
    
    // You can add API calls here to cleanup test data
    // Example: Delete test users, clean database, etc.
    
    console.log('✅ Global teardown completed successfully');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown;