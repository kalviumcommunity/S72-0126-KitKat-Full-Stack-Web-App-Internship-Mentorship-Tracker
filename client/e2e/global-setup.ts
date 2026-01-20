// Playwright Global Setup
// Setup tasks that run before all tests

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3000');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify the application is working
    const title = await page.title();
    console.log(`✅ Application is ready. Title: ${title}`);
    
    // Setup test data if needed
    console.log('📝 Setting up test data...');
    
    // You can add API calls here to setup test data
    // Example: Create test users, seed database, etc.
    
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;