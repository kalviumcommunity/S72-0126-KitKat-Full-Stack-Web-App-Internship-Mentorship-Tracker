import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ErrorSuppression } from '@/components/providers/ErrorSuppression';
import { PWAProvider } from '@/components/providers/PWAProvider';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UIMP",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "UIMP",
    title: "UIMP - Unified Internship & Mentorship Portal",
    description: "A comprehensive platform for internship application tracking and mentorship feedback",
  },
  twitter: {
    card: "summary",
    title: "UIMP - Unified Internship & Mentorship Portal",
    description: "A comprehensive platform for internship application tracking and mentorship feedback",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="UIMP" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <PWAProvider>
          <ErrorSuppression />
          <OfflineIndicator />
          <AuthProvider>
            <ToastProvider>
              {children}
              <PWAInstallPrompt />
            </ToastProvider>
          </AuthProvider>
        </PWAProvider>
      </body>
    </html>
  );
}