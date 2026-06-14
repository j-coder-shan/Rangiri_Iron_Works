// src/app/services/[categorySlug]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryBySlug, getItemsByCategory } from '@/lib/db';
import { Category, Item } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ItemCodeSearch from '@/components/services/ItemCodeSearch';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { ChevronRight, ArrowLeft, Eye, MessageSquare, Tag } from 'lucide-react';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { categorySlug } = resolvedParams;
  const { t } = useLanguage();
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const catData = await getCategoryBySlug(categorySlug);
        if (catData) {
          setCategory(catData);
          const itemsData = await getItemsByCategory(categorySlug);
          setItems(itemsData);
        } else {
          setCategory(null);
        }
      } catch (err) {
        console.error('Failed to load category page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <h2 className="text-2xl font-bold text-smoke">{t('Category Not Found', 'මෙම සේවා කාණ්ඩය සොයාගත නොහැක')}</h2>
        <Button onClick={() => router.push('/services')} variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          <span>{t('Back to All Services', 'සියලුම සේවාවන් වෙත')}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-iron min-h-screen py-10 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/10 w-96 h-96 bg-spark/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-steel-light tracking-wide uppercase select-none">
          <Link href="/" className="hover:text-smoke transition-colors">
            {t('Home', 'මුල් පිටුව')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <Link href="/services" className="hover:text-smoke transition-colors">
            {t('Services', 'සේවා')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <span className="text-spark font-bold">
            {t(category.nameEn, category.nameSi)}
          </span>
        </nav>

        {/* Category Hero Block */}
        <div className="relative rounded-lg overflow-hidden border border-iron-light/35 bg-iron-mid/80 backdrop-blur-md p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
          
          {/* Cover image */}
          <div className="w-full md:w-1/3 h-52 rounded-md overflow-hidden bg-iron relative">
            <Image
              src={getOptimizedCloudinaryUrl(category.coverImage, 600)}
              alt={t(category.nameEn, category.nameSi)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 z-10" />
          </div>

          {/* Description details */}
          <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
              {t(category.nameEn, category.nameSi)}
            </h1>
            <p className="text-sm text-steel-light leading-relaxed">
              {t(category.descriptionEn, category.descriptionSi)}
            </p>
          </div>
        </div>

        {/* Search Bar Block */}
        <div className="py-4">
          <ItemCodeSearch />
        </div>

        {/* Product Items List Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-iron-light/30 pb-4">
            <h2 className="text-lg font-display font-bold text-smoke uppercase tracking-wider flex items-center gap-2">
              <Tag size={16} className="text-spark" />
              <span>
                {t(
                  `Fabricated Products (${items.length})`,
                  `නිෂ්පාදන සහ සේවා එකතුව (${items.length})`
                )}
              </span>
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-iron-mid/30 border border-iron-light/20 rounded-lg text-steel-light text-sm">
              {t('No items available in this category yet.', 'මෙම කාණ්ඩයේ භාණ්ඩ කිසිවක් දැනට ඇතුළත් කර නොමැත.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  variant="glass"
                  hoverEffect={true}
                  className="flex flex-col justify-between h-[390px] border-iron-light/35 hover:border-spark/40 group"
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-44 bg-iron overflow-hidden">
                    <Image
                      src={getOptimizedCloudinaryUrl(item.images[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', 600)}
                      alt={t(item.nameEn, item.nameSi)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Code overlay */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="code">{item.code}</Badge>
                    </div>
                  </div>

                  {/* Card Content details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base font-display font-bold text-smoke tracking-wide leading-tight group-hover:text-spark transition-colors line-clamp-1">
                        {t(item.nameEn, item.nameSi)}
                      </h3>
                      <p className="text-xs text-steel-light leading-relaxed line-clamp-3">
                        {t(item.descriptionEn, item.descriptionSi)}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button
                        onClick={() => router.push(`/services/${categorySlug}/${item.code}`)}
                        variant="ghost"
                        size="sm"
                        className="border border-iron-light/60 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-iron-light hover:text-smoke"
                      >
                        <Eye size={12} />
                        <span>{t('View Details', 'විස්තර බලන්න')}</span>
                      </Button>
                      <Button
                        onClick={() => router.push(`/quotation?code=${item.code}`)}
                        variant="spark"
                        size="sm"
                        className="text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare size={12} />
                        <span>{t('Enquire', 'විමසන්න')}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
