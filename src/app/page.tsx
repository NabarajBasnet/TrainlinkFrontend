import React from 'react';
import TrainLinkHero from '@/components/pages/Home';
import Features from '@/components/pages/Features';
import HowItWorks from '@/components/pages/Workflow';
import FAQSection from '@/components/pages/FAQ';
import TestimonialsPage from '@/components/pages/Testimonal';
import ContactPage from '@/components/pages/Contactus';
import AboutPage from '@/components/pages/Aboutus';
import PricingPage from '@/components/pages/Pricing';

export default async function Home() {

  return (
    <div>
      <TrainLinkHero />
      <Features />
      <HowItWorks />
      <PricingPage />
      <TestimonialsPage />
      <AboutPage />
      <FAQSection />
      <ContactPage />
    </div>
  );
}