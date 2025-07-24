'use client';

import React from 'react';
import MainNavbar from '@/components/pages/Navbar';
import TrainLinkHero from '@/components/pages/Home';
import Features from '@/components/pages/Features';
import HowItWorks from '@/components/pages/Workflow';
import FAQSection from '@/components/pages/FAQ';
import Footer from '@/components/pages/Footer';
import TestimonialsPage from '@/components/pages/Testimonal';
import ContactPage from '@/components/pages/Contactus';
import AboutPage from '@/components/pages/Aboutus';
import PricingPage from '@/components/pages/Pricing';

export default function Home() {

  return (
    <div className="">
      <MainNavbar />
      <TrainLinkHero />
      <Features />
      <HowItWorks />
      <PricingPage />
      <TestimonialsPage />
      <AboutPage />
      <FAQSection />
      <ContactPage />
      <Footer />
    </div>
  );
}