// src/components/layout/WhatsAppFloatingButton.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const phoneNumber = '94723169847'; // 0723169847 in international format
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello%20Rangiri%20Iron%20Works%2C%20I%20need%20a%20quotation`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-green-500/20 flex items-center justify-center border border-white/10 group"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform duration-300"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.035-4.148l.388.23c1.785 1.06 3.861 1.62 5.981 1.621 5.765 0 10.457-4.69 10.461-10.46.002-2.796-1.084-5.424-3.06-7.4-1.977-1.977-4.609-3.065-7.408-3.067-5.772 0-10.463 4.69-10.467 10.46-.001 2.155.563 4.258 1.634 6.046l.254.423-1.006 3.676 3.766-.988zM17.65 14.288c-.314-.157-1.855-.915-2.133-1.016-.279-.102-.482-.153-.684.153-.203.305-.788 1.016-.965 1.219-.178.203-.355.229-.669.071-1.026-.514-1.724-.908-2.408-1.579-.582-.572-1.042-1.258-1.205-1.57-.164-.314-.018-.484.139-.639.141-.14.314-.366.471-.55.157-.183.209-.314.314-.523.107-.209.053-.393-.026-.55-.08-.157-.684-1.649-.938-2.259-.247-.595-.5-.514-.684-.523-.178-.009-.38-.009-.583-.009-.203 0-.533.076-.813.38-.28.305-1.066 1.041-1.066 2.538 0 1.497 1.091 2.943 1.243 3.146.153.203 2.147 3.279 5.203 4.598.727.314 1.294.5 1.737.641.73.232 1.393.199 1.918.121.584-.087 1.855-.758 2.116-1.455.26-.697.26-1.296.183-1.423-.078-.127-.279-.203-.593-.36z" />
      </svg>
      {/* Tooltip */}
      <span className="absolute right-16 bg-iron-mid text-smoke text-xs font-semibold px-3 py-1.5 rounded-md border border-iron-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
        WhatsApp Us
      </span>
    </a>
  );
}
