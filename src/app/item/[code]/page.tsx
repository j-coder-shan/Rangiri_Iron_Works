// src/app/item/[code]/page.tsx
'use client';

import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getItemByCode } from '@/lib/db';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function ItemLookupPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { code } = resolvedParams;
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState('');

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

  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://rangiri.lk');
    const canonicalUrl = `${siteUrl}/item/${code}`;
    
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(canonicalUrl, { width: 120, margin: 1 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR code generation failed', err));
    }).catch(err => console.error('Failed to load qrcode package', err));
  }, [code]);

  return (
    <div className="min-h-screen bg-iron flex flex-col items-center justify-center gap-6 p-4">
      {/* Loading Spinner */}
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-spark"></div>
      <p className="text-xs font-semibold text-steel-light tracking-widest uppercase">
        Looking up item code {code}...
      </p>

      {/* QR Code Section per requirement 3a */}
      {qrCodeUrl && (
        <div className="p-4 bg-iron-mid/50 border border-iron-light/40 rounded-lg flex flex-col items-center gap-2 mt-4 max-w-xs text-center">
          <div className="bg-white p-1 rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24" />
          </div>
          <p className="text-[10px] font-bold text-spark uppercase tracking-wider">
            Scan to share this item / මෙම අයිතමය බෙදාගැනීමට QR කේතය ස්කෑන් කරන්න
          </p>
        </div>
      )}
    </div>
  );
}
