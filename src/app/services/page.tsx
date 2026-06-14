// src/app/services/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategories } from '@/lib/db';
import { Category } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import ItemCodeSearch from '@/components/services/ItemCodeSearch';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import * as Icons from 'lucide-react';

export default function ServicesPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCategories();
        setCategories(data.filter(c => c.isActive));
      } catch (err) {
        console.error('Failed to load categories page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    if (LucideIcon) {
      return <LucideIcon className="w-8 h-8 text-spark" />;
    }
    return <Icons.Wrench className="w-8 h-8 text-spark" />;
  };

  return (
    <div className="bg-iron min-h-screen py-12 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-spark tracking-widest uppercase font-display">
            {t('RANGIRI WORKSHOP', 'රංගිරි වැඩපල')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Our Services', 'අපගේ සේවා කාණ්ඩ')}
          </h1>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-steel-light leading-relaxed">
            {t(
              'Browse through our specialized fabrication, paint, and restoration categories. We offer professional grade services tailored to your needs.',
              'අපගේ විශේෂිත නිෂ්පාදන, පින්තාරු සහ අලුත්වැඩියා සේවා කාණ්ඩයන් නරඹන්න. ඔබගේ අවශ්‍යතා අනුව වෘත්තීය මට්ටමේ සේවාවන් අපි සපයන්නෙමු.'
            )}
          </p>
        </div>

        {/* Prominent Search bar wrapper */}
        <div className="space-y-4">
          <h3 className="text-center text-xs font-bold text-steel-light uppercase tracking-widest">
            {t('LOOKING FOR A SPECIFIC ITEM? ENTER ITS CODE BELOW', 'නිශ්චිත භාණ්ඩයක් සොයන්නේද? එහි කේතය ඇතුළත් කරන්න')}
          </h3>
          <ItemCodeSearch />
        </div>

        {/* Categories Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-lg bg-iron-mid/50 border border-iron-light/40 p-6 flex gap-6">
                <Skeleton className="w-1/3 h-full rounded-md" />
                <div className="w-2/3 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <Card
                key={cat.id}
                variant="glass"
                hoverEffect={true}
                onClick={() => router.push(`/services/${cat.slug}`)}
                className="cursor-pointer border-l-4 border-l-spark p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-stretch group h-auto sm:h-64"
              >
                {/* Image block */}
                <div className="w-full sm:w-2/5 h-44 sm:h-auto rounded-md overflow-hidden bg-iron flex-shrink-0 relative">
                  <Image
                    src={getOptimizedCloudinaryUrl(cat.coverImage, 400)}
                    alt={t(cat.nameEn, cat.nameSi)}
                    fill
                    sizes="(max-width: 640px) 100vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300 z-10" />
                </div>

                {/* Details block */}
                <div className="w-full sm:w-3/5 flex flex-col justify-between py-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-spark/10 border border-spark/20 rounded-md text-spark">
                        {renderIcon(cat.icon)}
                      </div>
                      <h3 className="text-xl font-display font-bold tracking-wide text-smoke group-hover:text-spark transition-colors leading-none">
                        {t(cat.nameEn, cat.nameSi)}
                      </h3>
                    </div>
                    
                    <p className="text-xs text-steel-light leading-relaxed line-clamp-4">
                      {t(cat.descriptionEn, cat.descriptionSi)}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <div className="flex items-center gap-2 text-xs font-bold text-spark group-hover:text-spark-light transition-colors pt-4 sm:pt-0">
                    <span>{t('EXPLORE ALL PRODUCTS', 'සියලුම නිෂ්පාදන බලන්න')}</span>
                    <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
