export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About UIMP
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Unified Internship & Mentorship Portal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              For Students
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Track internship applications</li>
              <li>• Manage application status pipeline</li>
              <li>• Upload and organize resumes</li>
              <li>• Receive structured mentor feedback</li>
              <li>• Get notifications for important updates</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              For Mentors
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• View assigned students</li>
              <li>• Review student applications</li>
              <li>• Provide structured feedback</li>
              <li>• Track feedback status</li>
              <li>• Support student growth</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Application Status Pipeline
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Draft', 'Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'].map((status, index) => (
              <div key={status} className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                  {status}
                </div>
                {index < 5 && (
                  <div className="mx-2 text-gray-400">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}