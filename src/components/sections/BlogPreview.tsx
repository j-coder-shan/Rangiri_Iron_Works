// src/components/sections/BlogPreview.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { ArrowRight, Calendar, ArrowRightCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPreview() {
  const { t } = useLanguage();
  const router = useRouter();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBlogPosts();
        // Only show published posts, limit to 3 items
        setPosts(data.filter((p) => p.isPublished).slice(0, 3));
      } catch (err) {
        console.error('Failed to load blog preview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  // Hide section completely if loading is finished and no posts exist
  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-iron relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-smoke uppercase tracking-tight">
              {t('Latest from Our Blog', 'අපගේ බ්ලොග් පිටුව')}
            </h2>
            <div className="w-16 h-1 bg-spark rounded-full" />
            <p className="text-sm text-steel-light max-w-xl">
              {t(
                'Read tips on maintaining iron structures, vehicle painting recommendations, and safari canopy modification insights.',
                'යකඩ නිෂ්පාදන නඩත්තුව, වාහන පින්තාරු කිරීම් සහ සෆාරි ජීප් රථ කැනොපි වෙනස් කිරීම් පිළිබඳ උපදෙස් සහ තොරතුරු.'
              )}
            </p>
          </div>
          <Button
            onClick={() => router.push('/blog')}
            variant="outline"
            className="flex-shrink-0 flex items-center gap-2 text-xs"
          >
            <span>{t('READ ALL ARTICLES', 'සියලුම ලිපි කියවන්න')}</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // Skeletons
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-[380px] rounded-lg bg-iron-mid/50 p-4 border border-iron-light/40 flex flex-col justify-between">
                <Skeleton className="h-44 w-full mb-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                variant="glass"
                hoverEffect={true}
                onClick={() => router.push(`/blog/${post.slug}`)}
                className="cursor-pointer flex flex-col justify-between h-[420px] group border-iron-light/20 hover:border-spark/30"
              >
                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden bg-iron">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={t(post.titleEn, post.titleSi)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-iron-mid/90 via-iron-mid/20 to-transparent" />
                </div>

                {/* Content details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Date Tag */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-steel-light uppercase font-mono">
                      <Calendar size={12} className="text-spark" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-display font-bold text-smoke tracking-wide leading-tight group-hover:text-spark transition-colors line-clamp-2">
                      {t(post.titleEn, post.titleSi)}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-steel-light leading-relaxed line-clamp-2">
                      {t(post.excerptEn, post.excerptSi)}
                    </p>
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-spark group-hover:text-spark-light transition-colors mt-4">
                    <span>{t('READ ARTICLE', 'ලිපිය කියවන්න')}</span>
                    <ArrowRightCircle size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </Card>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
