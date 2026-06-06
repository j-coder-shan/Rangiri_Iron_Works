// src/app/layout.tsx
import type { Metadata } from 'next';
import { Oswald, Source_Sans_3, Noto_Sans_Sinhala, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloatingButton from '@/components/layout/WhatsAppFloatingButton';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-source-sans',
  display: 'swap',
});

const notoAutolink = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sinhala',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
    <html lang="si" suppressHydrationWarning className={`${oswald.variable} ${sourceSans.variable} ${notoAutolink.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased bg-iron text-smoke min-h-screen flex flex-col">
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
