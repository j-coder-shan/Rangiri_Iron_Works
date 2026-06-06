// src/components/sections/TestimonialsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTestimonials } from '@/lib/db';
import { Testimonial } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const { t } = useLanguage();
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTestimonials();
        setTestimonials(data.filter(test => test.isActive));
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-24 bg-iron-mid/50 relative z-20 overflow-hidden">
      
      {/* Decorative Spark glow spots */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('What Our Clients Say', 'පාරිභෝගික අදහස්')}
          </h2>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm text-steel-light">
            {t(
              'Read honest reviews from homeowners, safari operators, and vehicle owners across Sri Lanka.',
              'අපගෙන් සේවාවන් ලබාගත් ගෘහස්ථ පාරිභෝගිකයින්, සෆාරි ජීප් රථ හිමියන් සහ අනෙකුත් පාරිභෝගිකයින්ගේ අදහස් කිහිපයක්.'
            )}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Skeletons
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-lg bg-iron/40 p-6 space-y-4 border border-iron-light/40">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ))
          ) : testimonials.length === 0 ? (
            <div className="col-span-full text-center py-12 text-steel-light text-sm">
              {t('No reviews available yet.', 'පාරිභෝගික අදහස් කිසිවක් දැනට නොමැත.')}
            </div>
          ) : (
            testimonials.map((test) => (
              <Card
                key={test.id}
                variant="glass"
                hoverEffect={true}
                className="p-8 flex flex-col justify-between border-iron-light/25 hover:border-spark/30 relative"
              >
                {/* Quote Icon overlay */}
                <Quote className="absolute right-6 top-6 w-10 h-10 text-iron-light/20 flex-shrink-0" />

                <div className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < test.rating ? '#E8500A' : 'none'}
                        className={i < test.rating ? 'text-spark' : 'text-steel'}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-smoke leading-relaxed font-light italic">
                    "{t(test.reviewEn, test.reviewSi)}"
                  </p>
                </div>

                {/* Reviewer Meta info */}
                <div className="flex items-center gap-4 mt-8 pt-4 border-t border-iron-light/25">
                  {/* Initials Avatar */}
                  <div className="w-10 h-10 rounded-full bg-steel text-white flex items-center justify-center font-bold font-display text-xs border border-white/10 flex-shrink-0">
                    {test.avatarInitials}
                  </div>
                  <div className="text-xs">
                    <h4 className="font-semibold text-smoke">
                      {t(test.nameEn, test.nameSi)}
                    </h4>
                    <span className="text-steel-light block">
                      {t(test.serviceEn, test.serviceSi)} &bull; {t(test.locationEn, test.locationSi)}
                    </span>
                  </div>
                </div>

              </Card>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
