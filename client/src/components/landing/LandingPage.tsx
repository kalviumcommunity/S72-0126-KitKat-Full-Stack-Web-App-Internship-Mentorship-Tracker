// Landing Page - Complete redesign with all sections
// Comprehensive landing page according to design specification

'use client';

import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { ProblemSolutionSection } from './ProblemSolutionSection';
import { FeaturesOverview } from './FeaturesOverview';
import { HowItWorksSection } from './HowItWorksSection';
import { StatisticsSection } from './StatisticsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FeaturedCompanies } from './FeaturedCompanies';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { FinalCTASection } from './FinalCTASection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection />
        
        {/* 2. Problem-Solution Section */}
        <ProblemSolutionSection />
        
        {/* 3. Features Overview */}
        <FeaturesOverview />
        
        {/* 4. How It Works */}
        <HowItWorksSection />
        
        {/* 5. Statistics */}
        <StatisticsSection />
        
        {/* 6. Testimonials */}
        <TestimonialsSection />
        
        {/* 7. Featured Companies */}
        <FeaturedCompanies />
        
        {/* 8. Pricing */}
        <PricingSection />
        
        {/* 9. FAQ */}
        <FAQSection />
        
        {/* 10. Final CTA */}
        <FinalCTASection />
      </main>
      
      {/* 11. Footer */}
      <Footer />
    </div>
  );
}