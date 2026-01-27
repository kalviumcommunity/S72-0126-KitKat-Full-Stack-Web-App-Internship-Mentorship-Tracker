import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorSuppression } from '@/components/providers/ErrorSuppression';

// Initialize error suppression for development
import '@/lib/error-suppression';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UIMP - Unified Internship & Mentorship Portal",
  description: "A comprehensive platform for internship application tracking and mentorship feedback",
  keywords: ["internship", "mentorship", "career", "applications", "feedback"],
  authors: [{ name: "UIMP Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <ErrorSuppression />
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}