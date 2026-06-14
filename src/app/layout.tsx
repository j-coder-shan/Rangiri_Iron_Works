// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloatingButton from '@/components/layout/WhatsAppFloatingButton';

export const metadata: Metadata = {
  title: {
    default: 'Rangiri Iron Works | රංගිරි යකඩ වැඩ — Dambulla, Sri Lanka',
    template: '%s | Rangiri Iron Works',
  },
  description: "Sri Lanka's trusted iron fabrication, vehicle painting & canopy workshop. Custom gates, grills, railings, vehicle repaints. රංගිරි යකඩ වැඩ — Dambulla.",
  keywords: ['iron works', 'යකඩ නිෂ්පාදන', 'vehicle painting', 'safari jeep canopy', 'iron gates Kandy', 'ගේට්ටු', 'welding Sri Lanka'],
  openGraph: {
    title: 'Rangiri Iron Works | රංගිරි යකඩ වැඩ',
    description: 'Custom iron fabrication, vehicle painting & canopies — Dambulla, Sri Lanka',
    type: 'website',
    url: 'https://rangiri.lk',
    locale: 'si_LK',
  },
  alternates: {
    canonical: 'https://rangiri.lk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Sinhala:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-iron text-smoke min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-grow pt-16 sm:pt-20">
                {children}
              </main>
              <Footer />
              <WhatsAppFloatingButton />
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

