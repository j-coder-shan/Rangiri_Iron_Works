// src/components/layout/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/Logo';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for changing header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Handle Item Code Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    let code = searchQuery.trim().toUpperCase();
    
    // Normalize code prefix (e.g. IF-0001 -> RIW-IF-0001, 0001 -> RIW-IF-0001 depending on context, or direct redirect)
    if (!code.startsWith('RIW-')) {
      // If code starts with category prefix (IF, IP, VP, VC, TW, RM)
      const prefixes = ['IF', 'IP', 'VP', 'VC', 'TW', 'RM'];
      const hasPrefix = prefixes.some(p => code.startsWith(p + '-'));
      if (hasPrefix) {
        code = `RIW-${code}`;
      } else {
        // Fallback or attempt to search directly
        code = `RIW-IF-${code.padStart(4, '0')}`; // default or direct
      }
    }

    setSearchQuery('');
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/item/${code}`);
  };

  // Nav items configuration
  const navLinks = [
    { href: '/', labelEn: 'Home', labelSi: 'මුල් පිටුව' },
    { href: '/gallery', labelEn: 'Gallery', labelSi: 'ගැලරිය' },
    { href: '/blog', labelEn: 'Blog', labelSi: 'බ්ලොග්' },
    { href: '/about', labelEn: 'About Us', labelSi: 'අප ගැන' },
    { href: '/contact', labelEn: 'Contact', labelSi: 'අමතන්න' },
  ];

  // Services dropdown categories
  const categoriesList = [
    { slug: 'iron-fabrication', nameEn: 'Iron Fabrication', nameSi: 'යකඩ නිෂ්පාදන' },
    { slug: 'iron-painting', nameEn: 'Iron Painting', nameSi: 'යකඩ පින්තාරු' },
    { slug: 'vehicle-painting', nameEn: 'Vehicle Painting', nameSi: 'වාහන පින්තාරු' },
    { slug: 'vehicle-canopies', nameEn: 'Vehicle Canopies', nameSi: 'වාහන කැනොපි' },
    { slug: 'three-wheeler-repairs', nameEn: 'Three Wheeler Repairs', nameSi: 'ත්‍රිරෝද රථ අලුත්වැඩියා' },
    { slug: 'repair-maintenance', nameEn: 'Repair & Maintenance', nameSi: 'අලුත්වැඩියා සහ නඩත්තු' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Don't render Navbar on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-iron/90 backdrop-blur-md border-b border-iron-light/40 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex-shrink-0">
            <Logo height={scrolled ? 36 : 42} variant="light" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Home Link */}
            <Link
              href="/"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-spark ${
                isActive('/') ? 'text-spark border-b-2 border-spark pb-1' : 'text-smoke'
              }`}
            >
              {t('Home', 'මුල් පිටුව')}
            </Link>

            {/* Services Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-spark ${
                  pathname.startsWith('/services') ? 'text-spark' : 'text-smoke'
                }`}
              >
                {t('Services', 'සේවා')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-64 bg-iron-mid border border-iron-light/60 rounded-md shadow-2xl py-2 z-50 animate-fadeIn"
                >
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/services/${cat.slug}`}
                      className="block px-4 py-3 text-xs font-semibold tracking-wide text-smoke hover:bg-iron-light hover:text-spark transition-colors border-b border-iron-light/20 last:border-0"
                    >
                      {t(cat.nameEn, cat.nameSi)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other links */}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-spark ${
                  isActive(link.href) ? 'text-spark border-b-2 border-spark pb-1' : 'text-smoke'
                }`}
              >
                {t(link.labelEn, link.labelSi)}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Panel (Search, Lang Toggle, Quote Button) */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Search Input inline Toggle */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-slideLeft">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('Enter code (eg. IF-0001)...', 'කේතය ඇතුළත් කරන්න...')}
                    className="bg-iron-mid text-smoke text-xs px-3 py-1.5 rounded-l-md border border-iron-light focus:border-spark w-48 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="bg-iron-light text-steel-light hover:text-smoke p-1.5 rounded-r-md border-y border-r border-iron-light"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-smoke hover:text-spark p-2 transition-colors"
                  title={t('Search by item code', 'කේතයෙන් සොයන්න')}
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Language Toggle Pill */}
            <div className="flex items-center bg-iron-mid rounded-full p-1 border border-iron-light/40">
              <button
                onClick={() => setLang('en')}
                className={`text-xs px-2.5 py-1 rounded-full transition-all font-semibold ${
                  lang === 'en' ? 'bg-spark text-white shadow-md' : 'text-steel-light hover:text-smoke'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('si')}
                className={`text-xs px-2.5 py-1 rounded-full transition-all font-sinhala ${
                  lang === 'si' ? 'bg-spark text-white shadow-md' : 'text-steel-light hover:text-smoke'
                }`}
              >
                සිං
              </button>
            </div>

            {/* Get Quote Button */}
            <Button
              onClick={() => router.push('/quotation')}
              variant="spark"
              size="sm"
            >
              {t('Get Quote', 'කෝටේෂන්')}
            </Button>
          </div>

          {/* Mobile Right Controls & Hamburger Menu */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Quick Lang Toggle on Mobile */}
            <button
              onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
              className="bg-iron-mid text-smoke text-xs px-2.5 py-1 rounded-md border border-iron-light/40 font-semibold uppercase"
            >
              {lang === 'en' ? 'සිං' : 'EN'}
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-smoke hover:text-spark p-2 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Drawer panel on mobile) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-20 bg-iron/95 backdrop-blur-lg z-40 overflow-y-auto animate-fadeIn border-t border-iron-light/30">
          <div className="px-4 pt-6 pb-12 space-y-6 flex flex-col items-center">
            
            {/* Mobile Item Search Form */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-sm flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search item code (eg. IF-0001)...', 'කේතයෙන් සොයන්න (උදා. IF-0001)...')}
                className="bg-iron-mid text-smoke text-sm px-4 py-2.5 rounded-l-md border border-iron-light focus:border-spark w-full font-mono"
              />
              <button
                type="submit"
                className="bg-spark hover:bg-spark-light text-white px-4 py-2.5 rounded-r-md transition-colors"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Mobile Menu Links */}
            <div className="flex flex-col items-center space-y-4 w-full">
              <Link
                href="/"
                className={`text-lg font-medium tracking-wide py-2 w-full text-center border-b border-iron-light/10 ${
                  isActive('/') ? 'text-spark' : 'text-smoke'
                }`}
              >
                {t('Home', 'මුල් පිටුව')}
              </Link>

              {/* Mobile Services Expansion List */}
              <div className="w-full border-b border-iron-light/10 flex flex-col items-center">
                <span className="text-steel-light text-xs uppercase tracking-widest pt-2 pb-1">
                  {t('Our Services', 'අපගේ සේවා')}
                </span>
                <div className="grid grid-cols-2 gap-2 w-full py-3">
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/services/${cat.slug}`}
                      className="text-center text-xs py-2 bg-iron-mid border border-iron-light/20 rounded-md text-smoke hover:text-spark hover:border-spark transition-all"
                    >
                      {t(cat.nameEn, cat.nameSi)}
                    </Link>
                  ))}
                </div>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium tracking-wide py-2 w-full text-center border-b border-iron-light/10 ${
                    isActive(link.href) ? 'text-spark' : 'text-smoke'
                  }`}
                >
                  {t(link.labelEn, link.labelSi)}
                </Link>
              ))}
            </div>

            {/* Mobile CTA Button */}
            <Button
              onClick={() => router.push('/quotation')}
              variant="spark"
              size="lg"
              className="w-full max-w-sm mt-4"
            >
              {t('Request Free Quote', 'නොමිලේ කෝටේෂන් එකක් ගන්න')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
