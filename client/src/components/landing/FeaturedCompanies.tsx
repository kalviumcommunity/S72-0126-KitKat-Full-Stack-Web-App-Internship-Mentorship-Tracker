// Featured Companies Section Component
// Scrolling logo strip of partner companies

'use client';

export function FeaturedCompanies() {
  const companies = [
    { name: 'Google', logo: '🔍' },
    { name: 'Microsoft', logo: '🪟' },
    { name: 'Apple', logo: '🍎' },
    { name: 'Amazon', logo: '📦' },
    { name: 'Meta', logo: '📘' },
    { name: 'Netflix', logo: '🎬' },
    { name: 'Tesla', logo: '⚡' },
    { name: 'Spotify', logo: '🎵' },
    { name: 'Airbnb', logo: '🏠' },
    { name: 'Uber', logo: '🚗' },
    { name: 'Stripe', logo: '💳' },
    { name: 'Slack', logo: '💬' }
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 500+ companies that are already using UIMP to find exceptional talent and streamline their internship programs.
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center mb-12">
          {companies.map((company, index) => (
            <div
              key={index}
              className="group flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {company.logo}
              </div>
              <div className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                {company.name}
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling Animation */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="flex items-center space-x-8 animate-scroll">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-sm whitespace-nowrap"
              >
                <span className="text-2xl">{company.logo}</span>
                <span className="font-medium text-gray-700">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Partner Companies</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
            <div className="text-gray-600">Internship Positions</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-600">Hiring Success Rate</div>
          </div>
        </div>

        {/* CTA for Companies */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Find Your Next Intern?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of companies that have successfully hired exceptional interns through our platform. Post your opportunities and connect with top talent today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Post Internship
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}