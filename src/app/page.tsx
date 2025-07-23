'use client';

import React from 'react';
import MainNavbar from '@/components/pages/Navbar';
import TrainLinkHero from '@/components/pages/Home';
import Features from '@/components/pages/Features';
import HowItWorks from '@/components/pages/Workflow';
import FAQSection from '@/components/pages/FAQ';

export default function Home() {

  return (
    <div className="">
      <MainNavbar />
      <TrainLinkHero />
      <Features />
      <HowItWorks />
      <FAQSection />
    </div>
  );
}