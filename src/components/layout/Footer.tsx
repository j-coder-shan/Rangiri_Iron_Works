// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/Logo';
import { Phone, Mail, Clock, MapPin, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  // Categories list matching Navbar
  const categoriesList = [
    { slug: 'iron-fabrication', nameEn: 'Iron Fabrication', nameSi: 'යකඩ නිෂ්පාදන' },
    { slug: 'iron-painting', nameEn: 'Iron Painting', nameSi: 'යකඩ පින්තාරු' },
    { slug: 'vehicle-painting', nameEn: 'Vehicle Painting', nameSi: 'වාහන පින්තාරු' },
    { slug: 'vehicle-canopies', nameEn: 'Vehicle Canopies', nameSi: 'වාහන කැනොපි' },
    { slug: 'three-wheeler-repairs', nameEn: 'Three Wheeler Repairs', nameSi: 'ත්‍රිරෝද රථ අලුත්වැඩියා' },
    { slug: 'repair-maintenance', nameEn: 'Repair & Maintenance', nameSi: 'අලුත්වැඩියා සහ නඩත්තු' },
  ];

  // Quick links
  const quickLinks = [
    { href: '/gallery', labelEn: 'Project Gallery', labelSi: 'ගැලරිය' },
    { href: '/blog', labelEn: 'Latest Blog', labelSi: 'බ්ලොග් ලිපි' },
    { href: '/about', labelEn: 'About Our Workshop', labelSi: 'අප ගැන' },
    { href: '/contact', labelEn: 'Contact Us', labelSi: 'අමතන්න' },
    { href: '/quotation', labelEn: 'Get Free Quote', labelSi: 'නොමිලේ කෝටේෂන්' },
  ];

  // Don't render Footer on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-iron text-smoke border-t-2 border-spark relative z-10">
      
      {/* Upper Footer: 4-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Logo height={48} variant="light" showTagline={true} />
            <p className="text-xs text-steel-light leading-relaxed">
              {t(
                'Dambulla\'s premier workshop specializing in heavy iron fabrication, professional vehicle painting, and custom canopy structures since 2011.',
                '2011 වසරේ සිට දඹුල්ලේ පිහිටි යකඩ භාණ්ඩ නිෂ්පාදනය, වෘත්තීය වාහන පින්තාරු කිරීම සහ කැනොපි සැකසීමේ ප්‍රමුඛතම සේවා ස්ථානය.'
              )}
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-steel-light hover:text-spark transition-colors p-2 bg-iron-mid border border-iron-light/40 rounded-full"
                aria-label="Visit Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-steel-light hover:text-spark transition-colors p-2 bg-iron-mid border border-iron-light/40 rounded-full"
                aria-label="Visit YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Our Services */}
          <div>
            <h4 className="text-sm font-display font-semibold tracking-wider text-spark uppercase mb-6">
              {t('Our Services', 'අපගේ සේවා')}
            </h4>
            <ul className="space-y-3">
              {categoriesList.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="text-xs text-steel-light hover:text-white transition-colors"
                  >
                    {t(cat.nameEn, cat.nameSi)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-sm font-display font-semibold tracking-wider text-spark uppercase mb-6">
              {t('Quick Links', 'පිටු සහ සබැඳි')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-steel-light hover:text-white transition-colors"
                  >
                    {t(link.labelEn, link.labelSi)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h4 className="text-sm font-display font-semibold tracking-wider text-spark uppercase mb-6">
              {t('Contact Info', 'සබඳතා තොරතුරු')}
            </h4>
            <ul className="space-y-4">
              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-spark mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="block text-steel-light">{t('Call Us', 'දුරකථන අංකය')}</span>
                  <a href="tel:0723169847" className="font-semibold text-smoke hover:text-spark transition-colors">
                    0723169847
                  </a>
                </div>
              </li>
              {/* Address */}
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-spark mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="block text-steel-light">{t('Workshop Address', 'වැඩපල ලිපිනය')}</span>
                  <a
                    href="https://maps.app.goo.gl/WoPEB7M6tReRWz3WA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-smoke hover:text-spark transition-colors"
                  >
                    {t(
                      'Kandy Road, Dambulla, Sri Lanka',
                      'මහනුවර පාර, දඹුල්ල, ශ්‍රී ලංකාව'
                    )}
                  </a>
                </div>
              </li>
              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-spark mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="block text-steel-light">{t('Email Address', 'විද්‍යුත් තැපෑල')}</span>
                  <a href="mailto:prabod.jay02@gmail.com" className="text-smoke hover:text-spark transition-colors">
                    prabod.jay02@gmail.com
                  </a>
                </div>
              </li>
              {/* Working Hours */}
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-spark mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="block text-steel-light">{t('Working Hours', 'වැඩ කරන වේලාවන්')}</span>
                  <span className="text-smoke">
                    {t('Mon–Sat: 7:30 AM – 6:00 PM', 'සඳුදා–සෙනසුරාදා: පෙ.ව. 7:30 – ප.ව. 6:00')}
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-iron-mid border-t border-iron-light/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[11px] text-steel-light">
            Copyright &copy; {new Date().getFullYear()} Rangiri Iron Works. {t('All rights reserved.', 'සියලුම හිමිකම් ඇවිරිණි.')}
          </p>
          <p className="text-[11px] text-steel-light flex items-center gap-1.5 justify-center">
            <span>රංගිරි යකඩ වැඩ</span>
            <span className="text-iron-light">|</span>
            <span>{t('Designed for Sri Lanka 🇱🇰', 'ශ්‍රී ලංකාව සඳහාම නිපදවන ලදී 🇱🇰')}</span>
          </p>
        </div>
      </div>
      
    </footer>
  );
}
