// Problem-Solution Section Component
// Alternating layout showing problems and solutions

'use client';

export function ProblemSolutionSection() {
  const problemSolutions = [
    {
      problem: "Lost track of 50 applications?",
      solution: "Smart tracking with automated status updates",
      description: "Never lose track of your applications again. Our intelligent system automatically organizes and tracks all your internship applications with real-time status updates.",
      icon: "📊",
      image: "/api/placeholder/400/300",
      stats: "95% of users report better organization"
    },
    {
      problem: "No guidance from professionals?",
      solution: "1-on-1 mentorship from industry experts",
      description: "Get personalized feedback and career guidance from experienced professionals in your field. Our mentors have helped thousands of students land their dream internships.",
      icon: "🎯",
      image: "/api/placeholder/400/300",
      stats: "2,000+ active mentors ready to help"
    },
    {
      problem: "Companies overwhelmed with applicants?",
      solution: "Organized pipeline and smart matching",
      description: "Streamline your hiring process with our intelligent applicant management system. Find the right candidates faster with AI-powered matching and organized workflows.",
      icon: "⚡",
      image: "/api/placeholder/400/300",
      stats: "70% faster hiring process"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            We Solve Real Problems
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From scattered applications to successful placements, we've built solutions for every challenge in the internship journey.
          </p>
        </div>

        {/* Problem-Solution Cards */}
        <div className="space-y-20">
          {problemSolutions.map((item, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                {/* Problem */}
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">❌</div>
                    <div>
                      <h3 className="text-xl font-semibold text-red-800 mb-2">
                        The Problem
                      </h3>
                      <p className="text-red-700 text-lg font-medium">
                        {item.problem}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Our Solution
                      </h3>
                      <p className="text-green-700 text-lg font-medium mb-3">
                        {item.solution}
                      </p>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="text-blue-800 font-semibold">
                      {item.stats}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual/Screenshot */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-xl">
                  {/* Mock Interface */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* Content based on solution type */}
                    <div className="p-6">
                      {index === 0 && (
                        // Application Tracking Interface
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">My Applications</h4>
                            <div className="text-sm text-gray-500">12 total</div>
                          </div>
                          <div className="space-y-3">
                            {['Google', 'Microsoft', 'Apple'].map((company, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                                  <div>
                                    <div className="font-medium text-gray-900">{company}</div>
                                    <div className="text-sm text-gray-500">Software Engineer Intern</div>
                                  </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  i === 0 ? 'bg-green-100 text-green-800' : 
                                  i === 1 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {i === 0 ? 'Interview' : i === 1 ? 'Review' : 'Applied'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {index === 1 && (
                        // Mentorship Interface
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                            <div>
                              <div className="font-semibold text-gray-900">Sarah Chen</div>
                              <div className="text-sm text-gray-500">Senior SWE at Google</div>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-sm text-blue-800 font-medium mb-2">Latest Feedback</div>
                            <div className="text-gray-700">"Great improvement on your resume structure. Consider adding more quantifiable achievements..."</div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">Schedule Session</button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">View Profile</button>
                          </div>
                        </div>
                      )}

                      {index === 2 && (
                        // Company Pipeline Interface
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">Hiring Pipeline</h4>
                            <div className="text-sm text-gray-500">45 candidates</div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="bg-blue-100 p-2 rounded text-center">
                              <div className="font-bold text-blue-800">23</div>
                              <div className="text-blue-600">Applied</div>
                            </div>
                            <div className="bg-yellow-100 p-2 rounded text-center">
                              <div className="font-bold text-yellow-800">12</div>
                              <div className="text-yellow-600">Review</div>
                            </div>
                            <div className="bg-green-100 p-2 rounded text-center">
                              <div className="font-bold text-green-800">7</div>
                              <div className="text-green-600">Interview</div>
                            </div>
                            <div className="bg-purple-100 p-2 rounded text-center">
                              <div className="font-bold text-purple-800">3</div>
                              <div className="text-purple-600">Offer</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm animate-pulse">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}