// src/components/sections/GalleryPreview.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { getGallery } from '@/lib/db';
import { GalleryPhoto } from '@/types';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function GalleryPreview() {
  const { t } = useLanguage();
  const router = useRouter();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getGallery();
        setPhotos(data);
      } catch (err) {
        console.error('Failed to load gallery preview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter chips configuration
  const filters = [
    { id: 'all', labelEn: 'All Projects', labelSi: 'සියලුම වැඩ' },
    { id: 'cat-1', labelEn: 'Iron Fabrication', labelSi: 'යකඩ වැඩ' },
    { id: 'cat-3', labelEn: 'Vehicle Painting', labelSi: 'වාහන පින්තාරු' },
    { id: 'cat-4', labelEn: 'Vehicle Canopies', labelSi: 'වාහන කැනොපි' },
  ];

  // Filter photos. On homepage, limit to 8 items max
  const filteredPhotos = (activeFilter === 'all'
    ? photos
    : photos.filter((p) => p.categoryId === activeFilter)
  ).slice(0, 8);

  return (
    <section className="py-24 bg-iron relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Our Workshop Projects', 'අපගේ ව්‍යාපෘති ගැලරිය')}
          </h2>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm text-steel-light">
            {t(
              'A glimpse of recent custom orders fabricated and painted in our workshop. Built with premium grade finish.',
              'අපගේ වැඩපලෙන් මෑතකදී නිම කරන ලද යකඩ වැඩ සහ පින්තාරු වැඩපළෙහි පින්තූර කිහිපයක්.'
            )}
          </p>
        </div>

        {/* Filter Chips Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                activeFilter === filter.id
                  ? 'bg-spark border-spark text-white shadow-lg'
                  : 'bg-iron-mid border-iron-light/40 text-steel-light hover:text-smoke hover:border-iron-light'
              }`}
            >
              {t(filter.labelEn, filter.labelSi)}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            // Skeletons
            Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="h-48 rounded-lg" />
            ))
          ) : filteredPhotos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-steel-light text-sm flex flex-col items-center gap-2">
              <ImageIcon size={32} className="text-iron-light" />
              <span>{t('No photos available in this category.', 'මෙම කාණ්ඩයෙහි පින්තූර කිසිවක් දැනට නොමැත.')}</span>
            </div>
          ) : (
            filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => router.push('/gallery')}
                className="relative h-48 sm:h-56 rounded-lg overflow-hidden group cursor-pointer border border-iron-light/20 shadow-md"
              >
                {/* Image */}
                <Image
                  src={getOptimizedCloudinaryUrl(photo.imageUrl, 400)}
                  alt={t(photo.captionEn, photo.captionSi)}
                  width={400}
                  height={300}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] font-bold text-spark tracking-wider uppercase font-display mb-1">
                    {t('VIEW DETAILS', 'විස්තර බලන්න')}
                  </span>
                  <h4 className="text-xs font-semibold text-smoke leading-tight line-clamp-2">
                    {t(photo.captionEn, photo.captionSi)}
                  </h4>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Explore More Trigger */}
        <div className="text-center mt-12">
          <Button
            onClick={() => router.push('/gallery')}
            variant="outline"
            className="flex items-center gap-2 mx-auto text-xs"
          >
            <span>{t('EXPLORE ALL PHOTOS', 'සියලුම පින්තූර නරඹන්න')}</span>
            <ArrowRight size={14} />
          </Button>
        </div>

      </div>
    </section>
  );
}
