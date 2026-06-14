// src/app/about/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { MapPin, ShieldCheck, Hammer, Users } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Embedded map url matching user link https://maps.app.goo.gl/WoPEB7M6tReRWz3WA
  // Note: For iframe embed, we use the corresponding standard Google Maps embed URL for Kandy Road, Dambulla
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3533816656717!2d80.64165561081541!3d7.858022792131976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae345db59c11bd3%3A0xe6ab1e48ebdf7522!2sRangiri%20Iron%20Works%20(රංගිරි%20යකඩ%20වැඩ)!5e0!3m2!1sen!2slk!4v1717657000000!5m2!1sen!2slk";

  const coreValues = [
    {
      icon: ShieldCheck,
      titleEn: 'Unyielding Quality',
      titleSi: 'නොබිඳෙන විශ්වාසය',
      descEn: 'We use high-grade steel and premium coatings to ensure every product stands the test of time and weather.',
      descSi: 'අපි භාවිත කරන්නේ උසස්ම තත්ත්වයේ වානේ සහ උසස්ම ආරක්ෂිත ආලේපන පමණි. එමඟින් නිෂ්පාදනවල කල්පැවැත්ම තහවුරු වේ.',
    },
    {
      icon: Hammer,
      titleEn: 'Precise Craftsmanship',
      titleSi: 'විශිෂ්ට ශිල්පීය හැකියාව',
      descEn: 'Every cut, weld, and coat of paint is executed with extreme attention to detail and precision engineering.',
      descSi: 'සෑම කැපීමක්ම, වෙල්ඩිං කිරීමක්ම සහ පින්තාරු කිරීමක්ම ඉහළම නිරවද්‍යතාවයෙන් සහ සැලකිල්ලෙන් යුතුව සිදු කෙරේ.',
    },
    {
      icon: Users,
      titleEn: 'Customer First',
      titleSi: 'පාරිභෝගිකයාට මුල් තැන',
      descEn: 'We work closely with you from measurement to installation, delivering exactly what you specify and need.',
      descSi: 'මිනුම් ලබාගැනීමේ සිට සවි කිරීම දක්වාම අපි ඔබ සමඟ සමීපව කටයුතු කරමින් ඔබේ අවශ්‍යතාවයටම නිමවුම සකස් කර දෙන්නෙමු.',
    },
  ];

  return (
    <div className="bg-iron min-h-screen py-12 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-spark tracking-widest uppercase font-display">
            {t('OUR WORKSHOP STORY', 'අපගේ ඉතිහාසය')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('About Rangiri Iron Works', 'රංගිරි යකඩ වැඩ ගැන')}
          </h1>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
        </div>

        {/* Story details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-display font-bold text-smoke uppercase tracking-wide">
              {t('Crafting Steel in Dambulla Since 2011', '2011 වසරේ සිට දඹුල්ලේ සාදන ශක්තිමත් යකඩ නිමවුම්')}
            </h2>
            <p className="text-sm text-steel-light leading-relaxed font-light">
              {t(
                'Established in Dambulla, Sri Lanka, Rangiri Iron Works has grown into a highly trusted workshop for customized metal fabrication, vehicle spray painting, and specialized vehicle canopy modifications (particularly for safari jeeps operating in Sigiriya and Minneriya national parks).',
                'දඹුල්ල කේන්ද්‍ර කරගනිමින් ආරම්භ වූ රංගිරි යකඩ වැඩ ආයතනය, මේ වන විට අභිරුචි යකඩ භාණ්ඩ නිෂ්පාදනය, වාහන ස්ප්‍රේ පින්තාරු කිරීම සහ විශේෂිත වාහන කැනොපි වෙනස් කිරීම් (විශේෂයෙන් සීගිරිය සහ මින්නේරිය ජාතික වනෝද්‍යානවල ධාවනය වන සෆාරි ජීප් රථ සඳහා) සඳහා මහත් විශ්වාසයක් දිනාගත් සේවා ස්ථානයක් බවට පත්ව ඇත.'
              )}
            </p>
            <p className="text-sm text-steel-light leading-relaxed font-light">
              {t(
                'Under the guidance of skilled metalworkers and automotive painters, we combine traditional craftsmanship with precision welding techniques. Whether it is a sliding gate for your home, anti-rust coating for structures, or a complete vehicle paint job, we ensure the highest grade finish.',
                'පළපුරුදු ලෝහ ශිල්පීන් සහ වාහන පින්තාරුකරුවන්ගේ මඟපෙන්වීම යටතේ, අපි සාම්ප්‍රදායික ශිල්පීය හැකියාවන් සහ නූතන තාක්ෂණයන් එකට එකතු කරමු. ඔබේ නිවස සඳහා සවිකරන ස්ලයිඩින් ගේට්ටුවක් වේවා, වානේ ව්‍යුහයන් සඳහා මලකඩ විරෝධී ආලේපනයක් වේවා, හෝ වාහනයක් පින්තාරු කිරීමක් වේවා, අපි ඉහළම තත්ත්වයේ නිමාවක් සහතික කරමු.'
              )}
            </p>
            
            {/* Mission statement quote block */}
            <div className="p-5 border-l-4 border-spark bg-iron-mid/60 rounded-r-md">
              <span className="block text-xs font-bold text-spark font-display tracking-widest uppercase mb-1">
                {t('OUR MISSION', 'අපගේ අරමුණ')}
              </span>
              <p className="text-xs sm:text-sm text-smoke italic">
                "{t(
                  'To design and fabricate metal structures of industrial strength, and deliver vehicle restorations that exceed customer expectations, contributing to local Sri Lankan craftsmanship.',
                  'කාර්මික මට්ටමේ ශක්තියෙන් යුත් ලෝහ නිෂ්පාදනයන් සැලසුම් කර නිමවීමත්, පාරිභෝගික අපේක්ෂාවන් ඉක්මවා යන වාහන ප්‍රතිසංස්කරණ සේවා සැපයීමත්, එමඟින් දේශීය ශිල්පීය හැකියාවන් නංවාලීමත් අපගේ අරමුණයි.'
                )}"
              </p>
            </div>
          </div>

          {/* Photo banner card (5 cols) */}
          <div className="lg:col-span-5 relative h-80 rounded-lg overflow-hidden border border-iron-light/30 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"
              alt="Workshop worker welding steel"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 text-smoke z-10">
              <span className="text-[10px] font-bold text-spark tracking-wider uppercase font-display block mb-1">
                {t('DAMBULLA WORKSHOP', 'දඹුල්ල වැඩපල')}
              </span>
              <span className="text-sm font-bold block">
                {t('Precision Welding & Fabrication', 'නිරවද්‍ය වෙල්ඩිං සහ නිමවුම්')}
              </span>
            </div>
          </div>
        </div>

        {/* Core Values grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-display font-bold text-smoke uppercase tracking-wider">
              {t('Our Core Workshop Principles', 'අපගේ මූලධර්ම')}
            </h3>
            <div className="w-12 h-0.5 bg-spark mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <Card
                  key={idx}
                  variant="glass"
                  className="p-6 border-iron-light/20 flex flex-col items-center text-center space-y-3"
                >
                  <div className="p-3 bg-spark/10 rounded-md border border-spark/20 text-spark">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-sm font-display font-bold text-smoke uppercase tracking-wide">
                    {t(val.titleEn, val.titleSi)}
                  </h4>
                  <p className="text-xs text-steel-light leading-relaxed">
                    {t(val.descEn, val.descSi)}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Maps Embed Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-display font-bold text-smoke uppercase tracking-wider flex items-center justify-center gap-2">
              <MapPin size={20} className="text-spark" />
              <span>{t('Find Our Workshop', 'වැඩපල පිහිටීම')}</span>
            </h3>
            <p className="text-xs text-steel-light">
              {t('We are located along Kandy Road, Dambulla. Drop by for discussions and measurements.', 'අපගේ වැඩපල දඹුල්ල, මහනුවර පාරේ පිහිටා ඇත. සාකච්ඡා සහ මිනුම් ලබාගැනීම සඳහා පැමිණෙන්න.')}
            </p>
          </div>

          {/* Iframe map wrapper */}
          <div className="rounded-lg overflow-hidden border border-iron-light/40 h-80 sm:h-96 shadow-2xl relative">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Rangiri Iron Works Workshop Location Map"
            />
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Button
            onClick={() => router.push('/quotation')}
            variant="spark"
            size="lg"
            className="font-bold uppercase tracking-widest text-xs"
          >
            {t('GET A FREE DESIGN QUOTE →', 'නොමිලේ කෝටේෂන් එකක් ගන්න →')}
          </Button>
        </div>

      </div>
    </div>
  );
}
