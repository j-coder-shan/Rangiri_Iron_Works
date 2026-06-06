// src/components/sections/ServicesSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategories } from '@/lib/db';
import { Category } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import * as Icons from 'lucide-react';

export default function ServicesSection() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCategories();
        // Only show active categories
        setCategories(data.filter(c => c.isActive));
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Dynamic Lucide icon renderer
  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    if (LucideIcon) {
      return <LucideIcon className="w-6 h-6 text-spark" />;
    }
    return <Icons.Wrench className="w-6 h-6 text-spark" />;
  };

  return (
    <section id="services-section" className="py-24 bg-iron relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('What We Do', 'අපගේ සේවාවන්')}
          </h2>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-steel-light">
            {t(
              'Explore our core expertise. We deliver precision-engineered metal solutions and premium automotive painting.',
              'අපගේ ප්‍රධාන සේවා ක්ෂේත්‍රයන් නරඹන්න. අපි උසස් ප්‍රමිතියෙන් යුත් ලෝහ නිෂ්පාදන සහ වෘත්තීය වාහන පින්තාරු සේවා සපයන්නෙමු.'
            )}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-[320px] rounded-lg border border-iron-light bg-iron-mid/50 p-6 flex flex-col justify-between">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <Card
                key={cat.id}
                variant="glass"
                hoverEffect={true}
                onClick={() => router.push(`/services/${cat.slug}`)}
                className="cursor-pointer border-l-4 border-l-spark flex flex-col justify-between h-[360px] group transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.coverImage}
                    alt={t(cat.nameEn, cat.nameSi)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-iron-mid via-iron-mid/20 to-transparent" />
                  
                  {/* Floating Category Icon */}
                  <div className="absolute bottom-4 left-4 bg-iron p-3 rounded-full border border-iron-light/40 shadow-lg">
                    {renderIcon(cat.icon)}
                  </div>
                </div>

                {/* Info & Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-display font-semibold tracking-wide text-smoke group-hover:text-spark transition-colors">
                      {t(cat.nameEn, cat.nameSi)}
                    </h3>
                    <p className="text-xs text-steel-light leading-relaxed line-clamp-2">
                      {t(cat.descriptionEn, cat.descriptionSi)}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-spark group-hover:text-spark-light transition-colors mt-4">
                    <span>{t('EXPLORE CATEGORY', 'සේවා නරඹන්න')}</span>
                    <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
