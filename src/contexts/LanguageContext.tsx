// src/contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, si: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('si'); // Default to Sinhala

  // Load language preference from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rangiri-lang') as Language;
    if (saved === 'en' || saved === 'si') {
      setLang(saved);
    }
  }, []);

  // Update HTML tag lang attribute dynamically
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('rangiri-lang', newLang);
  };

  // Translation helper function
  const t = (en: string, si: string) => {
    return lang === 'si' ? si : en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
