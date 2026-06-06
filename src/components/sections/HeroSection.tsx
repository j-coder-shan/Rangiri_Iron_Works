// src/components/sections/HeroSection.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();

  // Create an array of spark details to map over for particles
  const sparks = [
    { left: '10%', delay: '0s', duration: 'animate-spark-float-1' },
    { left: '25%', delay: '1.5s', duration: 'animate-spark-float-2' },
    { left: '40%', delay: '0.5s', duration: 'animate-spark-float-3' },
    { left: '55%', delay: '2.5s', duration: 'animate-spark-float-1' },
    { left: '70%', delay: '1s', duration: 'animate-spark-float-2' },
    { left: '85%', delay: '3s', duration: 'animate-spark-float-3' },
    { left: '15%', delay: '4s', duration: 'animate-spark-float-2' },
    { left: '60%', delay: '3.5s', duration: 'animate-spark-float-1' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero bg-mesh overflow-hidden py-20">
      
      {/* Spark Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {sparks.map((spark, idx) => (
          <div
            key={idx}
            className={`absolute bottom-0 w-1.5 h-1.5 bg-gradient-spark rounded-full opacity-0 ${spark.duration}`}
            style={{
              left: spark.left,
              animationDelay: spark.delay,
              boxShadow: '0 0 10px #FF6B2B, 0 0 20px #E8500A',
            }}
          />
        ))}
      </div>

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center space-y-8">
        
        {/* Pulsing Forge Icon */}
        <div className="flex justify-center animate-forge-glow mb-4">
          <div className="bg-iron-mid/80 p-5 rounded-full border border-spark/30 shadow-spark">
            <svg
              className="w-14 h-14 text-spark"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 70C20 70 30 70 35 65C40 60 40 50 43 45H57C60 50 60 60 65 65C70 70 80 70 80 70V78H20V70Z"
                fill="#E8500A"
              />
              <path
                d="M15 30C30 30 35 38 45 38H65C78 38 82 30 82 30V42C82 42 70 46 65 46H35C30 46 15 42 15 42V30Z"
                fill="#FAFAF9"
              />
              <path
                d="M50 10L45 28L55 28L50 48"
                stroke="#E8500A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-smoke uppercase tracking-tight leading-tight">
            {t(
              "Sri Lanka's Trusted Iron & Vehicle Workshop",
              "ශ්‍රී ලංකාවේ විශ්වාසදායකම යකඩ සහ වාහන වැඩපල"
            )}
          </h1>
          <p className="text-lg sm:text-2xl text-steel-light font-light tracking-wide max-w-2xl mx-auto">
            {t(
              "Crafted in Steel. Built to Last. Exceptional custom metalwork, canopies, and spray painting in Dambulla.",
              "වානේවලින් නිර්මිත. කල් පවතින නිෂ්පාදන. දඹුල්ලේ විශිෂ්ටතම අභිරුචි ලෝහ වැඩ, වාහන කැනොපි සහ පින්තාරු සේවා."
            )}
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => {
              const el = document.getElementById('services-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="spark"
            size="lg"
            className="w-full sm:w-auto"
          >
            {t('Explore Services', 'අපගේ සේවාවන්')}
          </Button>
          <Button
            onClick={() => router.push('/quotation')}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto hover:bg-white/5"
          >
            {t('Get Free Quote', 'නොමිලේ කෝටේෂන්')}
          </Button>
        </div>

      </div>

      {/* Decorative Bottom Mesh Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-iron to-transparent pointer-events-none" />
      
    </section>
  );
}
