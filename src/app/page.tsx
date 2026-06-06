// src/app/page.tsx
import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import StatsBar from '@/components/sections/StatsBar';
import ServicesSection from '@/components/sections/ServicesSection';
import FeaturedItems from '@/components/sections/FeaturedItems';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import GalleryPreview from '@/components/sections/GalleryPreview';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogPreview from '@/components/sections/BlogPreview';
import CTASection from '@/components/sections/CTASection';

export default function Home() {
  return (
    <>
      {/* 1. Hero View with weld sparks */}
      <HeroSection />

      {/* 2. Stats Bar Counter */}
      <StatsBar />

      {/* 3. Service Category Grid List */}
      <ServicesSection />

      {/* 4. Featured items slide-row */}
      <FeaturedItems />

      {/* 5. Why Choose Us values */}
      <WhyChooseUs />

      {/* 6. Gallery previews grid */}
      <GalleryPreview />

      {/* 7. Testimonials client reviews */}
      <TestimonialsSection />

      {/* 8. Recent Blog Posts (conditionally hides if empty) */}
      <BlogPreview />

      {/* 9. Final Call-to-action bar */}
      <CTASection />
    </>
  );
}
