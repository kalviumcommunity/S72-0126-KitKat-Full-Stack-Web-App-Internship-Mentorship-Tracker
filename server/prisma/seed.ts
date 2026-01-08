import { PrismaClient, UserRole, ApplicationStatus, ApplicationPlatform, FeedbackTag, FeedbackPriority, NotificationType } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.application.deleteMany();
  await prisma.mentorAssignment.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin User
  console.log("👤 Creating admin user...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@uimp.com",
      passwordHash: await hashPassword("Admin123!"),
      role: UserRole.ADMIN,
      firstName: "Admin",
      lastName: "User",
      isActive: true,
    },
  });

  // Create Mentor Users
  console.log("👨‍🏫 Creating mentor users...");
  const mentor1 = await prisma.user.create({
    data: {
      email: "mentor1@uimp.com",
      passwordHash: await hashPassword("Mentor123!"),
      role: UserRole.MENTOR,
      firstName: "John",
      lastName: "Mentor",
      isActive: true,
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      email: "mentor2@uimp.com",
      passwordHash: await hashPassword("Mentor123!"),
      role: UserRole.MENTOR,
      firstName: "Sarah",
      lastName: "Mentor",
      isActive: true,
    },
  });

  // Create Student Users
  console.log("👨‍🎓 Creating student users...");
  const student1 = await prisma.user.create({
    data: {
      email: "student1@uimp.com",
      passwordHash: await hashPassword("Student123!"),
      role: UserRole.STUDENT,
      firstName: "Alice",
      lastName: "Student",
      isActive: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@uimp.com",
      passwordHash: await hashPassword("Student123!"),
      role: UserRole.STUDENT,
      firstName: "Bob",
      lastName: "Student",
      isActive: true,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      email: "student3@uimp.com",
      passwordHash: await hashPassword("Student123!"),
      role: UserRole.STUDENT,
      firstName: "Charlie",
      lastName: "Student",
      isActive: true,
    },
  });

  // Create Mentor Assignments
  console.log("🔗 Creating mentor assignments...");
  await prisma.mentorAssignment.create({
    data: {
      mentorId: mentor1.id,
      studentId: student1.id,
      isActive: true,
    },
  });

  await prisma.mentorAssignment.create({
    data: {
      mentorId: mentor1.id,
      studentId: student2.id,
      isActive: true,
    },
  });

  await prisma.mentorAssignment.create({
    data: {
      mentorId: mentor2.id,
      studentId: student3.id,
      isActive: true,
    },
  });

  // Create Applications for Student 1
  console.log("📝 Creating applications...");
  const app1 = await prisma.application.create({
    data: {
      userId: student1.id,
      company: "Tech Corp",
      role: "Software Engineer Intern",
      platform: ApplicationPlatform.LINKEDIN,
      status: ApplicationStatus.APPLIED,
      resumeUrl: "https://s3.amazonaws.com/bucket/resume1.pdf",
      notes: "Applied through LinkedIn referral. Great company culture!",
      deadline: new Date("2024-03-15"),
      appliedDate: new Date("2024-01-10"),
    },
  });

  const app2 = await prisma.application.create({
    data: {
      userId: student1.id,
      company: "StartupXYZ",
      role: "Full Stack Developer Intern",
      platform: ApplicationPlatform.COMPANY_WEBSITE,
      status: ApplicationStatus.SHORTLISTED,
      resumeUrl: "https://s3.amazonaws.com/bucket/resume1.pdf",
      notes: "Received positive response. Interview scheduled.",
      deadline: new Date("2024-02-20"),
      appliedDate: new Date("2024-01-05"),
    },
  });

  const app3 = await prisma.application.create({
    data: {
      userId: student1.id,
      company: "BigTech Inc",
      role: "Backend Engineer Intern",
      platform: ApplicationPlatform.REFERRAL,
      status: ApplicationStatus.DRAFT,
      notes: "Need to update resume before applying",
      deadline: new Date("2024-04-01"),
    },
  });

  const app4 = await prisma.application.create({
    data: {
      userId: student2.id,
      company: "Cloud Services Ltd",
      role: "DevOps Intern",
      platform: ApplicationPlatform.JOB_BOARD,
      status: ApplicationStatus.INTERVIEW,
      resumeUrl: "https://s3.amazonaws.com/bucket/resume2.pdf",
      notes: "Technical interview next week",
      deadline: new Date("2024-02-25"),
      appliedDate: new Date("2024-01-08"),
    },
  });

  const app5 = await prisma.application.create({
    data: {
      userId: student2.id,
      company: "Data Analytics Co",
      role: "Data Science Intern",
      platform: ApplicationPlatform.CAREER_FAIR,
      status: ApplicationStatus.OFFER,
      resumeUrl: "https://s3.amazonaws.com/bucket/resume2.pdf",
      notes: "Received offer! Negotiating terms.",
      deadline: new Date("2024-02-28"),
      appliedDate: new Date("2024-01-12"),
    },
  });

  const app6 = await prisma.application.create({
    data: {
      userId: student3.id,
      company: "Mobile Apps Inc",
      role: "Mobile Developer Intern",
      platform: ApplicationPlatform.OTHER,
      status: ApplicationStatus.REJECTED,
      resumeUrl: "https://s3.amazonaws.com/bucket/resume3.pdf",
      notes: "Not selected. Will reapply next year.",
      appliedDate: new Date("2024-01-15"),
    },
  });

  // Create Feedback
  console.log("💬 Creating feedback...");
  await prisma.feedback.create({
    data: {
      applicationId: app1.id,
      mentorId: mentor1.id,
      content: "Great application! Your resume looks strong. I noticed you have good project experience. Consider highlighting your leadership roles more prominently. Also, practice common behavioral questions for the interview.",
      tags: [FeedbackTag.RESUME, FeedbackTag.COMMUNICATION],
      priority: FeedbackPriority.HIGH,
    },
  });

  await prisma.feedback.create({
    data: {
      applicationId: app2.id,
      mentorId: mentor1.id,
      content: "Excellent progress! You've been shortlisted. Focus on system design fundamentals and practice coding problems. Review the company's tech stack before the interview.",
      tags: [FeedbackTag.DSA, FeedbackTag.SYSTEM_DESIGN],
      priority: FeedbackPriority.MEDIUM,
    },
  });

  await prisma.feedback.create({
    data: {
      applicationId: app4.id,
      mentorId: mentor1.id,
      content: "Good luck with your interview! Make sure to prepare questions about their infrastructure and deployment processes. Show enthusiasm for learning DevOps tools.",
      tags: [FeedbackTag.COMMUNICATION],
      priority: FeedbackPriority.LOW,
    },
  });

  await prisma.feedback.create({
    data: {
      applicationId: app5.id,
      mentorId: mentor1.id,
      content: "Congratulations on the offer! This is a great opportunity. Review the compensation package carefully and don't hesitate to negotiate if needed. Consider asking about growth opportunities.",
      tags: [FeedbackTag.COMMUNICATION],
      priority: FeedbackPriority.HIGH,
    },
  });

  await prisma.feedback.create({
    data: {
      applicationId: app6.id,
      mentorId: mentor2.id,
      content: "Don't be discouraged by the rejection. Use this as a learning opportunity. I suggest working on more mobile-specific projects and building a portfolio app. Keep applying!",
      tags: [FeedbackTag.RESUME, FeedbackTag.DSA],
      priority: FeedbackPriority.MEDIUM,
    },
  });

  // Create Notifications
  console.log("🔔 Creating notifications...");
  await prisma.notification.create({
    data: {
      userId: student1.id,
      type: NotificationType.FEEDBACK_RECEIVED,
      title: "New Feedback Received",
      message: "You received feedback on your Tech Corp application from John Mentor",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student1.id,
      type: NotificationType.APPLICATION_STATUS_CHANGED,
      title: "Application Status Updated",
      message: "Your StartupXYZ application status changed to SHORTLISTED",
      read: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student2.id,
      type: NotificationType.FEEDBACK_RECEIVED,
      title: "New Feedback Received",
      message: "You received feedback on your Cloud Services Ltd application from John Mentor",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student2.id,
      type: NotificationType.APPLICATION_STATUS_CHANGED,
      title: "Congratulations!",
      message: "You received an OFFER from Data Analytics Co!",
      read: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student3.id,
      type: NotificationType.MENTOR_ASSIGNED,
      title: "Mentor Assigned",
      message: "Sarah Mentor has been assigned as your mentor",
      read: false,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Applications: ${await prisma.application.count()}`);
  console.log(`   - Feedback: ${await prisma.feedback.count()}`);
  console.log(`   - Notifications: ${await prisma.notification.count()}`);
  console.log(`   - Mentor Assignments: ${await prisma.mentorAssignment.count()}`);
  console.log("\n🔑 Test Credentials:");
  console.log("   Admin:   admin@uimp.com / Admin123!");
  console.log("   Mentor1: mentor1@uimp.com / Mentor123!");
  console.log("   Mentor2: mentor2@uimp.com / Mentor123!");
  console.log("   Student1: student1@uimp.com / Student123!");
  console.log("   Student2: student2@uimp.com / Student123!");
  console.log("   Student3: student3@uimp.com / Student123!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

