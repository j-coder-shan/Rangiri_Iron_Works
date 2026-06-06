// src/components/sections/StatsBar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

function CountUp({ end, suffix = '', duration = 1500 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure exact final count
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsBar() {
  const { t } = useLanguage();

  const stats = [
    {
      end: 15,
      suffix: '+',
      labelEn: 'Years of Experience',
      labelSi: 'අවුරුදු 15+ ක පළපුරුද්ද',
    },
    {
      end: 250,
      suffix: '+',
      labelEn: 'Projects Completed',
      labelSi: 'ව්‍යාපෘති 250+ නිමවා ඇත',
    },
    {
      end: 200,
      suffix: '+',
      labelEn: 'Happy Customers',
      labelSi: 'තෘප්තිමත් පාරිභෝගිකයින් 200+',
    },
    {
      end: 6,
      suffix: '',
      labelEn: 'Service Categories',
      labelSi: 'විවිධ සේවා කාණ්ඩ 6ක්',
    },
  ];

  return (
    <section className="bg-iron-mid border-y border-iron-light/40 py-10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-iron-light/30">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`text-center space-y-2 flex flex-col justify-center ${
                idx % 2 === 1 ? 'pt-0' : 'pt-4 md:pt-0'
              }`}
            >
              <div className="text-4xl sm:text-5xl font-display font-bold text-spark tracking-tight leading-none">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm font-medium tracking-wide text-steel-light uppercase">
                {t(stat.labelEn, stat.labelSi)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
