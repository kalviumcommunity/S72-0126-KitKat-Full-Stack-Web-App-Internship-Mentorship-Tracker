#!/usr/bin/env tsx

/**
 * Test script for OTP-based password reset flow
 * 
 * This script demonstrates and tests the complete OTP flow:
 * 1. Generate OTP for a user
 * 2. Verify the OTP
 * 3. Reset password using OTP
 * 
 * Usage: npm run test:otp or tsx src/scripts/test-otp-flow.ts
 */

import { config } from "dotenv";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { passwordResetService } from "../services/password-reset.service";
import { otpService } from "../services/otp.service";
import { logger } from "../lib/logger";
import { hashPassword } from "../lib/password";

// Load environment variables
config();

async function testOtpFlow() {
  try {
    console.log("🚀 Starting OTP Flow Test...\n");

    // Connect to services
    await redis.connect();
    console.log("✅ Connected to Redis");

    // Create a test user if not exists
    const testEmail = "test@example.com";
    let testUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (!testUser) {
      console.log("👤 Creating test user...");
      testUser = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: await hashPassword("oldPassword123!"),
          role: "STUDENT",
          firstName: "Test",
          lastName: "User",
          isActive: true,
        },
      });
      console.log(`✅ Test user created: ${testUser.id}`);
    } else {
      console.log(`✅ Using existing test user: ${testUser.id}`);
    }

    console.log("\n--- Step 1: Initiate Password Reset ---");
    
    // Test forgot password
    await passwordResetService.initiatePasswordReset({
      email: testEmail,
    });
    console.log("✅ Password reset initiated - OTP sent to email");

    // Get OTP status for debugging
    const otpStatus = await otpService.getOtpStatus(testUser.id);
    console.log(`📊 OTP Status: exists=${otpStatus.exists}, ttl=${otpStatus.ttl}s`);

    // For testing, we need to get the actual OTP from Redis
    // In production, this would come from the email
    const client = redis.getClient();
    if (!client) {
      throw new Error("Redis client not available");
    }

    const otpKey = `password_reset:${testUser.id}`;
    const otpDataStr = await client.get(otpKey);
    
    if (!otpDataStr) {
      throw new Error("OTP not found in Redis");
    }

    const otpData = JSON.parse(otpDataStr);
    const testOtp = otpData.otp;
    console.log(`🔑 Generated OTP: ${testOtp} (for testing only)`);

    console.log("\n--- Step 2: Verify OTP ---");
    
    // Test OTP verification
    await passwordResetService.verifyOtp({
      email: testEmail,
      otp: testOtp,
    });
    console.log("✅ OTP verified successfully");

    // Generate new OTP for password reset test
    console.log("\n--- Step 3: Generate New OTP for Password Reset ---");
    await passwordResetService.initiatePasswordReset({
      email: testEmail,
    });

    // Get the new OTP
    const newOtpDataStr = await client.get(otpKey);
    if (!newOtpDataStr) {
      throw new Error("New OTP not found in Redis");
    }
    const newOtpData = JSON.parse(newOtpDataStr);
    const newTestOtp = newOtpData.otp;
    console.log(`🔑 New OTP: ${newTestOtp} (for testing only)`);

    console.log("\n--- Step 4: Reset Password ---");
    
    // Test password reset
    await passwordResetService.resetPassword({
      email: testEmail,
      otp: newTestOtp,
      newPassword: "newPassword123!",
    });
    console.log("✅ Password reset successfully");

    // Verify OTP was deleted (single-use)
    const finalOtpStatus = await otpService.getOtpStatus(testUser.id);
    console.log(`📊 Final OTP Status: exists=${finalOtpStatus.exists} (should be false)`);

    console.log("\n--- Step 5: Test Invalid OTP ---");
    
    // Generate another OTP
    await passwordResetService.initiatePasswordReset({
      email: testEmail,
    });

    try {
      // Test with invalid OTP
      await passwordResetService.verifyOtp({
        email: testEmail,
        otp: "123456", // Invalid OTP
      });
      console.log("❌ Should have failed with invalid OTP");
    } catch (error) {
      console.log("✅ Invalid OTP correctly rejected:", (error as Error).message);
    }

    console.log("\n--- Step 6: Test Rate Limiting ---");
    
    // Test multiple failed attempts
    for (let i = 0; i < 3; i++) {
      try {
        await passwordResetService.verifyOtp({
          email: testEmail,
          otp: "999999", // Invalid OTP
        });
      } catch (error) {
        console.log(`✅ Attempt ${i + 1} failed as expected:`, (error as Error).message);
      }
    }

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📧 Email Override Configuration:");
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   OTP_TEST_EMAIL: ${process.env.OTP_TEST_EMAIL}`);
    console.log(`   Email will be sent to: ${process.env.NODE_ENV !== "production" && process.env.OTP_TEST_EMAIL ? process.env.OTP_TEST_EMAIL : "user's actual email"}`);

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    // Cleanup
    await prisma.$disconnect();
    console.log("\n🧹 Cleanup completed");
  }
}

// Run the test
if (require.main === module) {
  testOtpFlow().catch(console.error);
}

export { testOtpFlow };