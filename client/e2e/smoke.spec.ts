// Smoke Tests for UIMP
// Basic functionality tests to verify deployment

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/UIMP|Internship|Mentorship/);
    
    // Check for main navigation or key elements
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('signup page is accessible', async ({ page }) => {
    await page.goto('/signup');
    
    // Check for signup form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to login
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
    
    // Test navigation to signup
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*signup/);
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check that content is visible on mobile
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Check that navigation is accessible (might be in a hamburger menu)
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('error pages work correctly', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    
    // Should show 404 or redirect to home
    const is404 = await page.locator('text=404').isVisible();
    const isHome = await page.locator('h1').isVisible();
    
    expect(is404 || isHome).toBeTruthy();
  });

  test('accessibility basics', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility features
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check for lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('performance basics', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (generous for CI)
    expect(loadTime).toBeLessThan(10000);
  });
});