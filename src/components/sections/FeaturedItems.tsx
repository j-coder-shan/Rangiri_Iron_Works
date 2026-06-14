// src/components/sections/FeaturedItems.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { getItems } from '@/lib/db';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { Item } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { ArrowRight, Eye, PhoneCall } from 'lucide-react';

export default function FeaturedItems() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const allItems = await getItems();
        // Filter active & featured items
        setItems(allItems.filter(item => item.isActive && item.isFeatured));
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-24 bg-iron-mid/50 bg-mesh relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
              {t('Our Featured Work', 'අපගේ විශේෂ නිෂ්පාදන')}
            </h2>
            <div className="w-16 h-1 bg-spark rounded-full" />
            <p className="text-sm text-steel-light max-w-xl">
              {t(
                'Explore some of our recently fabricated items and premium repaint jobs. High-precision structures crafted to last.',
                'මෑතකදී අප වැඩපලෙන් නිපදවූ සුවිශේෂී නිෂ්පාදන සහ පින්තාරු කටයුතු කිහිපයක්. කල්පැවැත්ම සඳහාම නිමවූ විශිෂ්ට නිමාවන්.'
              )}
            </p>
          </div>
          <Button
            onClick={() => router.push('/gallery')}
            variant="outline"
            className="flex-shrink-0 flex items-center gap-2 text-xs"
          >
            <span>{t('VIEW FULL GALLERY', 'ගැලරියට යන්න')}</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        {/* Horizontal Scroll Row / Flex Grid */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-thin scrollbar-thumb-iron-light scrollbar-track-iron select-none">
          {loading ? (
            // Skeletons
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="min-w-[280px] sm:min-w-[340px] max-w-[340px] bg-iron/40 rounded-lg p-4 space-y-4 border border-iron-light/40 flex-shrink-0"
              >
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="w-full text-center py-12 text-steel-light text-sm">
              {t('No featured items available.', 'විශේෂ නිෂ්පාදන කිසිවක් දැනට නොමැත.')}
            </div>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                variant="glass"
                className="min-w-[290px] sm:min-w-[340px] max-w-[340px] flex-shrink-0 snap-start flex flex-col justify-between h-[420px] group border-iron-light/20 hover:border-spark/30"
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 overflow-hidden bg-iron">
                  <Image
                    src={getOptimizedCloudinaryUrl(item.images[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', 400)}
                    alt={t(item.nameEn, item.nameSi)}
                    width={400}
                    height={300}
                    sizes="(max-width: 640px) 100vw, 340px"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Code badge overlay */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="code">{item.code}</Badge>
                  </div>
                </div>

                {/* Card Content details */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Category Label */}
                    <span className="text-[10px] font-bold text-spark tracking-wider uppercase font-display">
                      {item.categorySlug.replace('-', ' ')}
                    </span>
                    {/* Item Name */}
                    <h3 className="text-base font-display font-bold text-smoke tracking-wide leading-tight group-hover:text-spark transition-colors line-clamp-1">
                      {t(item.nameEn, item.nameSi)}
                    </h3>
                    {/* Description excerpt */}
                    <p className="text-xs text-steel-light leading-relaxed line-clamp-2">
                      {t(item.descriptionEn, item.descriptionSi)}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                      onClick={() => router.push(`/services/${item.categorySlug}/${item.code}`)}
                      variant="ghost"
                      size="sm"
                      className="border border-iron-light/60 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-iron-light hover:text-white"
                    >
                      <Eye size={12} />
                      <span>{t('Details', 'විස්තර')}</span>
                    </Button>
                    <Button
                      onClick={() => router.push(`/quotation?code=${item.code}`)}
                      variant="spark"
                      size="sm"
                      className="text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall size={12} />
                      <span>{t('Get Quote', 'මිල අසන්න')}</span>
                    </Button>
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
