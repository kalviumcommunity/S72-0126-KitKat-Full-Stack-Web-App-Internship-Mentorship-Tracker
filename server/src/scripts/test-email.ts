#!/usr/bin/env tsx

/**
 * Email Test Script
 * Standalone script to test Mailtrap SMTP integration
 * 
 * Usage:
 * npm run test:email your-email@example.com
 * or
 * tsx src/scripts/test-email.ts your-email@example.com
 */

import { config } from 'dotenv';
import { mailService } from '../services/mail.service';
import { logger } from '../lib/logger';

// Load environment variables
config();

async function testEmail() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Please provide an email address as an argument');
    console.log('Usage: tsx src/scripts/test-email.ts your-email@example.com');
    process.exit(1);
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Invalid email address format');
    process.exit(1);
  }

  console.log('🚀 Testing Mailtrap SMTP integration...');
  console.log(`📧 Sending test email to: ${email}`);
  console.log('');

  // Check email service status
  const status = mailService.getStatus();
  console.log('📊 Email Service Status:');
  console.log(`   Configured: ${status.configured ? '✅' : '❌'}`);
  console.log(`   Transporter Available: ${status.transporterAvailable ? '✅' : '❌'}`);
  console.log(`   SMTP Host: ${status.host || 'Not configured'}`);
  console.log(`   SMTP Port: ${status.port || 'Not configured'}`);
  console.log(`   From Address: ${status.from || 'Not configured'}`);
  console.log('');

  if (!status.configured) {
    console.error('❌ Email service is not properly configured');
    console.log('Please check your .env file and ensure all SMTP variables are set:');
    console.log('   - SMTP_HOST');
    console.log('   - SMTP_PORT');
    console.log('   - SMTP_USER');
    console.log('   - SMTP_PASS');
    console.log('   - SMTP_FROM');
    process.exit(1);
  }

  try {
    // Send test email
    const result = await mailService.sendTestEmail(email);

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log(`📬 Message ID: ${result.messageId}`);
      console.log('');
      console.log('🎉 Check your Mailtrap inbox to verify the email was received.');
      console.log('📱 Login to https://mailtrap.io/inboxes to view the email.');
    } else {
      console.error('❌ Failed to send test email');
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error occurred:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testEmail().catch((error) => {
  console.error('❌ Script execution failed:', error);
  process.exit(1);
});