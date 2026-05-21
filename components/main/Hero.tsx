import React from 'react';
import Hero3D from './Hero3D';
import HeroButtons from './HeroButtons';

const Hero = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <Hero3D />
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
        AI + ML Powered Centralized Company Review Aggregator
      </h1>
      <p className="mt-4 text-lg md:text-xl text-neutral-300 max-w-4xl">
        A COMPLETE ENTERPRISE-LEVEL FULL STACK WEB APPLICATION that aggregates company reviews, ratings, analytics, and intelligent company insights from multiple platforms into one centralized AI + ML inspired analytics dashboard.
      </p>
      <HeroButtons />
    </div>
  );
};

export default Hero;