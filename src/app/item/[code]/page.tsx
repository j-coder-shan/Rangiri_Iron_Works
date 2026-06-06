// src/app/item/[code]/page.tsx
'use client';

import React, { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getItemByCode } from '@/lib/db';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function ItemLookupPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { code } = resolvedParams;
  const router = useRouter();

  useEffect(() => {
    async function lookupAndRedirect() {
      try {
        const item = await getItemByCode(code);
        if (item) {
          router.replace(`/services/${item.categorySlug}/${item.code}`);
        } else {
          // If code is not found, redirect to services with query param
          router.replace(`/services?search_error=${encodeURIComponent(code)}`);
        }
      } catch (err) {
        console.error('Error looking up item code:', err);
        router.replace('/services');
      }
    }
    lookupAndRedirect();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-iron flex flex-col items-center justify-center gap-4">
      {/* Loading Spinner */}
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-spark"></div>
      <p className="text-xs font-semibold text-steel-light tracking-widest uppercase">
        Looking up item code {code}...
      </p>
    </div>
  );
}
