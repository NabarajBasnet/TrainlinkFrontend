'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, Play, Star, Users, Target, TrendingUp, ArrowRight } from 'lucide-react';
import MainNavbar from '@/components/pages/Navbar';
import TrainLinkHero from '@/components/pages/Home';

export default function Home() {

  return (
    <div className="">
      <MainNavbar />
      <TrainLinkHero />
    </div>
  );
}