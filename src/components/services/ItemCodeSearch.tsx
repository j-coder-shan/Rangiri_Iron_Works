// src/components/services/ItemCodeSearch.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ItemCodeSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    let code = query.trim().toUpperCase();
    
    // Normalize prefix
    if (!code.startsWith('RIW-')) {
      const prefixes = ['IF', 'IP', 'VP', 'VC', 'TW', 'RM'];
      const hasPrefix = prefixes.some(p => code.startsWith(p + '-'));
      if (hasPrefix) {
        code = `RIW-${code}`;
      } else {
        code = `RIW-IF-${code.padStart(4, '0')}`;
      }
    }

    router.push(`/item/${code}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full flex items-center shadow-lg rounded-md overflow-hidden border border-iron-light bg-iron-mid">
      <div className="pl-4 text-steel-light flex-shrink-0">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(
          "Enter item code (e.g., RIW-IF-0001 or IF-0001)...",
          "භාණ්ඩ කේතය ඇතුළත් කරන්න (උදා. RIW-IF-0001)..."
        )}
        className="bg-transparent text-smoke text-sm px-3 py-3.5 w-full focus:outline-none placeholder-steel-light font-mono"
      />
      <Button
        type="submit"
        variant="spark"
        className="rounded-none px-6 py-4"
      >
        {t('Search', 'සොයන්න')}
      </Button>
    </form>
  );
}
