// src/app/services/[categorySlug]/[itemCode]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getItemByCode, getItemsByCategory } from '@/lib/db';
import { Item } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { ChevronRight, ArrowLeft, Share2, Copy, Check, MessageSquare, PhoneCall, Phone, AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ categorySlug: string; itemCode: string }>;
}

export default function ItemDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { categorySlug, itemCode } = resolvedParams;
  
  const { t, lang } = useLanguage();
  const router = useRouter();
  const { success: showSuccessToast } = useToast();

  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const itemData = await getItemByCode(itemCode);
        if (itemData) {
          setItem(itemData);
          setActiveImage(itemData.images[0] || '');
          
          // Load related items in the same category
          const categoryItems = await getItemsByCategory(categorySlug);
          // Filter out the current item, limit to 3
          setRelatedItems(
            categoryItems.filter((i) => i.code !== itemData.code).slice(0, 3)
          );
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error('Failed to load item detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [itemCode, categorySlug]);

  // Copy item code to clipboard
  const handleCopyCode = () => {
    if (!item) return;
    navigator.clipboard.writeText(item.code);
    setCopiedCode(true);
    showSuccessToast(t('Item code copied!', 'භාණ්ඩ කේතය පිටපත් කරන ලදී!'));
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy shareable link to clipboard
  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showSuccessToast(t('Page link copied!', 'පිටුවේ සබැඳිය පිටපත් කරන ලදී!'));
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <Skeleton className="h-6 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <h2 className="text-2xl font-bold text-smoke">
          {t('Item Not Found', 'මෙම නිෂ්පාදනය සොයාගත නොහැක')}
        </h2>
        <Button onClick={() => router.push(`/services/${categorySlug}`)} variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          <span>{t('Back to Category', 'කාණ්ඩය වෙත')}</span>
        </Button>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/94723169847?text=${encodeURIComponent(
    `Hi Rangiri Iron Works, I am interested in item ${item.code} (${item.nameEn}). Please provide more details.`
  )}`;

  return (
    <div className="bg-iron min-h-screen py-10 relative overflow-hidden">
      
      {/* Background glow spot */}
      <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        <nav className="flex items-center space-x-2 text-xs font-semibold text-steel-light tracking-wide uppercase select-none">
          <Link href="/" className="hover:text-smoke transition-colors">
            {t('Home', 'මුල් පිටුව')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <Link href="/services" className="hover:text-smoke transition-colors">
            {t('Services', 'සේවා')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <Link href={`/services/${categorySlug}`} className="hover:text-smoke transition-colors">
            {categorySlug.replace('-', ' ')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <span className="text-spark font-bold">{item.code}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery Slider (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Large Active Image display */}
            <div className="relative h-[300px] sm:h-[450px] rounded-lg overflow-hidden bg-iron-mid border border-iron-light/40 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={t(item.nameEn, item.nameSi)}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {/* Monospace Code Badge Overlay */}
              <div className="absolute top-4 left-4">
                <Badge variant="code">{item.code}</Badge>
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            {item.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 select-none scrollbar-thin">
                {item.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden bg-iron-mid flex-shrink-0 border-2 transition-all ${
                      activeImage === imgUrl ? 'border-spark' : 'border-iron-light/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & CTAs (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Badge & Share Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="code" className="text-sm font-bold">{item.code}</Badge>
                  {/* Copy code button */}
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 text-steel-light hover:text-smoke bg-iron-mid rounded-md border border-iron-light/50 transition-colors"
                    title={t('Copy Item Code', 'කේතය පිටපත් කරන්න')}
                  >
                    {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
                
                {/* Share Page link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-steel-light hover:text-smoke bg-iron-mid rounded-md border border-iron-light/50 transition-colors"
                >
                  {copiedLink ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                  <span>{t('Share Item', 'බෙදාහරින්න')}</span>
                </button>
              </div>

              {/* Bilingual Title */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight leading-tight">
                  {t(item.nameEn, item.nameSi)}
                </h1>
                <span className="text-xs font-bold text-spark tracking-widest uppercase font-display block">
                  {t(categorySlug.replace('-', ' '), categorySlug.replace('-', ' '))}
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-steel-light leading-relaxed font-light">
                  {t(item.descriptionEn, item.descriptionSi)}
                </p>
              </div>

              {/* Specifications / Features Grid checklist */}
              {(item.features.length > 0 || item.featuresSi.length > 0) && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-smoke tracking-wider uppercase font-display">
                    {t('Specifications & Highlights', 'තාක්ෂණික විස්තර සහ විශේෂතා')}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(lang === 'si' ? item.featuresSi : item.features).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-steel-light">
                        <Check size={14} className="text-spark mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pricing Disclaimer & CTAs */}
            <div className="space-y-6 pt-4 border-t border-iron-light/30">
              
              {/* NO PRICES SHOWN - Disclaimer */}
              <div className="flex items-center gap-3 p-4 bg-spark-glow border border-spark/20 rounded-md">
                <AlertCircle size={20} className="text-spark flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-smoke block uppercase tracking-wide">
                    {t('Contact us for pricing', 'මිල ගණන් සඳහා අමතන්න')}
                  </span>
                  <span className="text-steel-light text-[11px]">
                    {t(
                      'Pricing depends on custom dimensions, layout choices, and material specifications. Request a free quote today.',
                      'මිල ගණන් මිනුම් ප්‍රමාණ, සැලසුම් මෝස්තර සහ අමුද්‍රව්‍ය මත වෙනස් වේ. අදම අපගෙන් නොමිලේ ඇස්තමේන්තුවක් ලබාගන්න.'
                    )}
                  </span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Quotation */}
                <Button
                  onClick={() => router.push(`/quotation?code=${item.code}`)}
                  variant="spark"
                  size="md"
                  className="flex items-center justify-center gap-2 font-bold py-3"
                >
                  <MessageSquare size={16} />
                  <span>{t('Request Quote', 'මිල අසන්න')}</span>
                </Button>
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="success"
                    size="md"
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] border-none flex items-center justify-center gap-2 font-bold py-3"
                  >
                    <PhoneCall size={16} />
                    <span>{t('WhatsApp Us', 'වට්ස්ඇප්')}</span>
                  </Button>
                </a>
                {/* Direct Call */}
                <a href="tel:0723169847" className="w-full">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full border-iron-light hover:border-spark flex items-center justify-center gap-2 font-bold py-3"
                  >
                    <Phone size={16} />
                    <span>{t('Call Shop', 'අමතන්න')}</span>
                  </Button>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Related Items row (3 items) */}
        {relatedItems.length > 0 && (
          <div className="pt-12 border-t border-iron-light/30 space-y-6">
            <h3 className="text-xl font-display font-bold text-smoke uppercase tracking-wider">
              {t('Related Services in this Category', 'මෙම කාණ්ඩයේ වෙනත් නිෂ්පාදන')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedItems.map((relItem) => (
                <Card
                  key={relItem.id}
                  variant="glass"
                  hoverEffect={true}
                  className="flex flex-col justify-between h-[340px] border-iron-light/35 hover:border-spark/40 group cursor-pointer"
                  onClick={() => router.push(`/services/${categorySlug}/${relItem.code}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-iron overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={relItem.images[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'}
                      alt={t(relItem.nameEn, relItem.nameSi)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="code">{relItem.code}</Badge>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-display font-bold text-smoke group-hover:text-spark transition-colors line-clamp-1">
                        {t(relItem.nameEn, relItem.nameSi)}
                      </h4>
                      <p className="text-xs text-steel-light leading-relaxed line-clamp-3">
                        {t(relItem.descriptionEn, relItem.descriptionSi)}
                      </p>
                    </div>
                    
                    <span className="text-[10px] font-bold text-spark tracking-wider uppercase block mt-3">
                      {t('VIEW DETAILS →', 'විස්තර බලන්න →')}
                    </span>
                  </div>

                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
