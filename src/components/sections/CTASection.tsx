// src/components/sections/CTASection.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';
import { Phone, MessageSquare } from 'lucide-react';

export default function CTASection() {
  const { t } = useLanguage();
  const router = useRouter();

  const phoneNumber = '0723169847';
  const whatsappNumber = '94723169847'; // International format
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Rangiri%20Iron%20Works%2C%20I%20need%20a%20quotation`;

  return (
    <section className="relative py-24 bg-gradient-hero bg-mesh border-t border-iron-light/40 overflow-hidden z-20">
      
      {/* Spark glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-spark/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Headlines */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Ready to Start Your Project?', 'ඔබේ ව්‍යාපෘතිය ආරම්භ කිරීමට සූදානම්ද?')}
          </h2>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-base sm:text-lg text-steel-light max-w-2xl mx-auto leading-relaxed">
            {t(
              'Get in touch today for custom gates, vehicle painting, safari canopy upgrades or repairs. We provide free design consultations and clear quotes.',
              'අභිරුචි ගේට්ටු, වාහන පින්තාරු කිරීම්, සෆාරි ජීප් රථ කැනොපි වෙනස් කිරීම් හෝ වෙනත් ඕනෑම අලුත්වැඩියාවක් සඳහා අදම අපව අමතන්න.'
            )}
          </p>
        </div>

        {/* Highlighted Phone Display */}
        <div className="bg-iron-mid/80 border border-iron-light/60 p-6 rounded-lg max-w-sm mx-auto shadow-xl">
          <span className="block text-xs font-bold text-steel-light uppercase tracking-widest mb-1">
            {t('DIRECT HOTLINE', 'දුරකථන අංකය')}
          </span>
          <a
            href={`tel:${phoneNumber}`}
            className="text-2xl sm:text-3xl font-display font-bold text-spark hover:text-spark-light transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={24} />
            <span>{phoneNumber}</span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="success"
              size="lg"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] border-none flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              <span>{t('Chat on WhatsApp', 'වට්ස්ඇප් මඟින් අමතන්න')}</span>
            </Button>
          </a>
          <Button
            onClick={() => router.push('/quotation')}
            variant="spark"
            size="lg"
            className="w-full sm:w-auto flex items-center justify-center"
          >
            {t('Request Free Quote', 'නොමිලේ කෝටේෂන් ගන්න')}
          </Button>
        </div>

      </div>
    </section>
  );
}
