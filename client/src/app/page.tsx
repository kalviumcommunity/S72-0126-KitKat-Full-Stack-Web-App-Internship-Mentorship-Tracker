import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900">UIMP</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Unified Internship &<br />
            <span className="text-blue-600">Mentorship Portal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for internship application tracking and mentorship feedback.
            Manage your applications, receive structured feedback from mentors, and track your progress.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Application Tracking
            </h3>
            <p className="text-gray-600">
              Keep track of all your internship applications in one place with status updates and deadlines.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mentor Feedback
            </h3>
            <p className="text-gray-600">
              Receive structured feedback from experienced mentors to improve your applications and skills.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Progress Analytics
            </h3>
            <p className="text-gray-600">
              Visualize your application progress and success rates with comprehensive analytics.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 UIMP. Built for internship tracking and mentorship.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}