// src/components/sections/WhyChooseUs.tsx
'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
import { Wrench, ShieldCheck, Compass, Zap } from 'lucide-react';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: Wrench,
      titleEn: 'Expert Craftsmanship',
      titleSi: 'පළපුරුදු ශිල්පීන්',
      descEn: 'Over 15 years fabricating premium iron structures, gates, and vehicle upgrades for Sri Lankan homes.',
      descSi: 'ශ්‍රී ලාංකීය නිවාස සඳහා වටිනා යකඩ නිමවුම්, ගේට්ටු සහ වාහන අලුත්වැඩියාවන් සිදු කිරීමේ වසර 15කට අධික පළපුරුද්ද.',
    },
    {
      icon: ShieldCheck,
      titleEn: 'Quality Materials',
      titleSi: 'උසස් අමුද්‍රව්‍ය',
      descEn: 'We use only high-grade steel, hot-dip galvanised iron, and premium weatherproofing rust coats.',
      descSi: 'අපි භාවිත කරන්නේ උසස්ම තත්ත්වයේ වානේ, ගැල්වනයිස් කරන ලද යකඩ සහ උසස්ම මලකඩ විරෝධී ආරක්ෂණ ආලේපන පමණි.',
    },
    {
      icon: Compass,
      titleEn: 'Custom Designs',
      titleSi: 'අවශ්‍ය පරිදි නිමවීම්',
      descEn: 'Every gate, canopy, and grill is built to your exact site specifications, sizes, and layout choices.',
      descSi: 'සෑම ගේට්ටුවක්ම, කැනොපියක්ම සහ ග්‍රිල් එකක්ම ඔබේ මිනුම්, ප්‍රමාණයන් සහ මෝස්තර තේරීම් අනුව නිමවා දෙනු ලැබේ.',
    },
    {
      icon: Zap,
      titleEn: 'Fast Turnaround',
      titleSi: 'ඉක්මන් සේවාව',
      descEn: 'Most iron fabrication and vehicle repaint orders are completed and delivered within 7 to 14 working days.',
      descSi: 'බොහෝ යකඩ නිෂ්පාදන සහ වාහන පින්තාරු කිරීම් වැඩ කරන දින 7 සිට 14ක් වැනි කෙටි කාලයක් තුළ අවසන් කර භාර දෙනු ලැබේ.',
    },
  ];

  return (
    <section className="py-24 bg-iron relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Why Choose Rangiri', 'අපව තෝරාගත යුත්තේ ඇයි')}
          </h2>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm text-steel-light">
            {t(
              'Uncompromising quality, personalized customer care, and industrial strength structures built in Dambulla.',
              'කිසිවිටකත් අඩු නොවන ප්‍රමිතිය, කාරුණික පාරිභෝගික සේවාව සහ දඹුල්ලේ සාදන ශක්තිමත් යකඩ නිෂ්පාදන.'
            )}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                hoverEffect={true}
                className="p-6 flex flex-col items-center text-center space-y-4 border-iron-light/20 hover:border-spark/30 h-[280px] justify-center"
              >
                {/* Icon wrapper */}
                <div className="p-4 bg-spark/10 rounded-full border border-spark/20 text-spark group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Content details */}
                <div className="space-y-2">
                  <h3 className="text-base font-display font-bold text-smoke uppercase tracking-wide">
                    {t(item.titleEn, item.titleSi)}
                  </h3>
                  <p className="text-xs text-steel-light leading-relaxed">
                    {t(item.descEn, item.descSi)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
