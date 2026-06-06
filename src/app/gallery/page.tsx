// src/app/gallery/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getGallery } from '@/lib/db';
import { GalleryPhoto } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, ZoomIn } from 'lucide-react';

export default function GalleryPage() {
  const { t } = useLanguage();

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getGallery();
        setPhotos(data);
      } catch (err) {
        console.error('Failed to load gallery photos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filters categories config
  const filters = [
    { id: 'all', labelEn: 'All Projects', labelSi: 'සියලුම වැඩ' },
    { id: 'cat-1', labelEn: 'Iron Fabrication', labelSi: 'යකඩ නිෂ්පාදන' },
    { id: 'cat-2', labelEn: 'Iron Painting', labelSi: 'යකඩ පින්තාරු' },
    { id: 'cat-3', labelEn: 'Vehicle Painting', labelSi: 'වාහන පින්තාරු' },
    { id: 'cat-4', labelEn: 'Vehicle Canopies', labelSi: 'වාහන කැනොපි' },
    { id: 'cat-5', labelEn: 'Three Wheeler Repairs', labelSi: 'ත්‍රිරෝද රථ' },
    { id: 'cat-6', labelEn: 'Repair & Maintenance', labelSi: 'අලුත්වැඩියා/නඩත්තු' },
  ];

  // Filter photos
  const filteredPhotos = activeFilter === 'all'
    ? photos
    : photos.filter((p) => p.categoryId === activeFilter);

  // Lightbox navigation functions
  const openLightbox = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const nextPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length);
  }, [filteredPhotos]);

  const prevPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [filteredPhotos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

  return (
    <div className="bg-iron min-h-screen py-12 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-spark tracking-widest uppercase font-display">
            {t('PORTFOLIO SHOWCASE', 'අපගේ නිර්මාණ')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Project Gallery', 'ව්‍යාපෘති ගැලරිය')}
          </h1>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-steel-light leading-relaxed">
            {t(
              'Take a visual tour of our work. Use the filters below to browse specific workshop fabrication jobs and vehicle paint transformations.',
              'අපගේ නිමකළ සේවාවන් නරඹන්න. යකඩ වැඩ සහ වාහන පින්තාරු කිරීම් වෙන වෙනම පෙරීමට පහත පෙරහන් භාවිතා කරන්න.'
            )}
          </p>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto border-b border-iron-light/25 pb-6">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentIndex(0);
              }}
              className={`text-xs px-4 py-2.5 rounded-full border transition-all duration-300 font-semibold ${
                activeFilter === filter.id
                  ? 'bg-spark border-spark text-white shadow-lg shadow-spark/20'
                  : 'bg-iron-mid border-iron-light/40 text-steel-light hover:text-smoke hover:border-iron-light'
              }`}
            >
              {t(filter.labelEn, filter.labelSi)}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <Skeleton key={idx} className="h-60 rounded-lg" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-24 bg-iron-mid/20 border border-iron-light/20 rounded-lg text-steel-light text-sm flex flex-col items-center gap-2">
            <ImageIcon size={36} className="text-iron-light" />
            <span>{t('No photos found in this category.', 'මෙම කාණ්ඩයෙහි පින්තූර කිසිවක් දැනට සොයාගත නොහැක.')}</span>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid relative rounded-lg overflow-hidden border border-iron-light/20 shadow-md group cursor-pointer"
              >
                {/* Image element */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imageUrl}
                  alt={t(photo.captionEn, photo.captionSi)}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="self-end p-2 bg-spark/20 border border-spark/30 rounded-md text-spark">
                    <ZoomIn size={14} />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-spark tracking-wider uppercase font-display">
                      {photo.categoryId.replace('cat-', 'Category ')}
                    </span>
                    <h4 className="text-xs font-semibold text-smoke leading-tight">
                      {t(photo.captionEn, photo.captionSi)}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* LIGHTBOX FULLSCREEN OVERLAY MODAL */}
      {lightboxOpen && filteredPhotos.length > 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 select-none animate-fadeIn">
          
          {/* Top Bar (Close) */}
          <div className="flex items-center justify-between px-6 py-4 text-smoke">
            <span className="text-xs font-mono">
              {currentIndex + 1} / {filteredPhotos.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 text-steel-light hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Middle Row (Left Arrow, Photo, Right Arrow) */}
          <div className="flex-grow flex items-center justify-between px-4 sm:px-10 gap-4">
            {/* Prev Trigger */}
            <button
              onClick={prevPhoto}
              className="p-3 text-steel-light hover:text-white bg-iron-mid/30 hover:bg-iron-mid border border-iron-light/20 hover:border-spark/40 rounded-full transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Photo Wrapper */}
            <div className="max-w-4xl max-h-[70vh] flex flex-col items-center justify-center p-2 bg-iron-mid/10 rounded-md border border-iron-light/10 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filteredPhotos[currentIndex].imageUrl}
                alt={t(filteredPhotos[currentIndex].captionEn, filteredPhotos[currentIndex].captionSi)}
                className="max-w-full max-h-[68vh] object-contain rounded-md"
              />
            </div>

            {/* Next Trigger */}
            <button
              onClick={nextPhoto}
              className="p-3 text-steel-light hover:text-white bg-iron-mid/30 hover:bg-iron-mid border border-iron-light/20 hover:border-spark/40 rounded-full transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Bar (Caption details) */}
          <div className="bg-iron-mid/50 border-t border-iron-light/20 px-6 py-6 text-center max-w-2xl mx-auto w-full rounded-t-lg">
            <h3 className="text-sm font-semibold text-smoke">
              {t(filteredPhotos[currentIndex].captionEn, filteredPhotos[currentIndex].captionSi)}
            </h3>
            <span className="text-[10px] font-bold text-spark tracking-wider uppercase font-display block mt-1">
              {filters.find((f) => f.id === filteredPhotos[currentIndex].categoryId)?.labelEn}
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
