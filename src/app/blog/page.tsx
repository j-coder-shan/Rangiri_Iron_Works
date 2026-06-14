// src/app/blog/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';
import { Calendar, BookOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogListingPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBlogPosts();
        // Only show published articles
        setPosts(data.filter((p) => p.isPublished));
      } catch (err) {
        console.error('Failed to load blog listing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return dateString;
    }
  };

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  );

  // Filter posts based on selected tag
  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className="bg-iron min-h-screen py-12 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-spark tracking-widest uppercase font-display">
            {t('WORKSHOP KNOWLEDGE BASE', 'රංගිරි දැනුම් පියස')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Rangiri Blog', 'අපගේ බ්ලොග් පිටුව')}
          </h1>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm text-steel-light leading-relaxed">
            {t(
              'Expert guides, maintenance checklists, and professional restoration tips from our master craftsmen in Dambulla.',
              'අපගේ පළපුරුදු ලෝහ ශිල්පීන් සහ වාහන පින්තාරුකරුවන් විසින් ලියන ලද වටිනා උපදෙස්, නඩත්තු ක්‍රම සහ තාක්ෂණික ලිපි පෙළක්.'
            )}
          </p>
        </div>

        {/* Tag Filters Row */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto border-b border-iron-light/25 pb-6">
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-3.5 py-1.5 rounded-md border transition-all ${
                selectedTag === null
                  ? 'bg-spark border-spark text-white'
                  : 'bg-iron-mid border-iron-light/35 text-steel-light hover:text-smoke'
              }`}
            >
              {t('All Topics', 'සියලුම ලිපි')}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3.5 py-1.5 rounded-md border transition-all ${
                  selectedTag === tag
                    ? 'bg-spark border-spark text-white'
                    : 'bg-iron-mid border-iron-light/35 text-steel-light hover:text-smoke'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Blog Posts Listing */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-96 rounded-lg bg-iron-mid/50 border border-iron-light/40 p-4 space-y-4">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-iron-mid/25 border border-iron-light/25 rounded-lg text-steel-light text-sm flex flex-col items-center gap-2">
            <BookOpen size={36} className="text-iron-light" />
            <span>{t('No articles published yet.', 'ලිපි කිසිවක් දැනට සොයාගත නොහැක.')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                variant="glass"
                hoverEffect={true}
                onClick={() => router.push(`/blog/${post.slug}`)}
                className="cursor-pointer flex flex-col justify-between h-[440px] group border-iron-light/35 hover:border-spark/40 shadow-xl"
              >
                {/* Cover Photo */}
                <div className="relative h-48 overflow-hidden bg-iron flex-shrink-0">
                  <Image
                    src={getOptimizedCloudinaryUrl(post.coverImage, 400)}
                    alt={t(post.titleEn, post.titleSi)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-iron-mid/95 via-iron-mid/10 to-transparent z-10" />
                  
                  {/* Category tags overlay */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1 z-10">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] bg-iron/80 backdrop-blur-sm border border-iron-light/40 text-smoke font-bold tracking-wider px-2 py-0.5 rounded uppercase font-display">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Date details */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-steel-light uppercase font-mono">
                      <Calendar size={12} className="text-spark" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-display font-bold text-smoke tracking-wide leading-tight group-hover:text-spark transition-colors line-clamp-2">
                      {t(post.titleEn, post.titleSi)}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-steel-light leading-relaxed line-clamp-2 font-light">
                      {t(post.excerptEn, post.excerptSi)}
                    </p>
                  </div>

                  {/* Actions Link */}
                  <div className="flex items-center justify-between text-xs font-bold text-spark group-hover:text-spark-light transition-colors pt-4 border-t border-iron-light/10">
                    <span>{t('READ MORE', 'වැඩිදුර කියවන්න')}</span>
                    <Clock size={12} className="text-steel-light" />
                  </div>
                </div>

              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
