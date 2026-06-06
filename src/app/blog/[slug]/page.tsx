// src/app/blog/[slug]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/db';
import { BlogPost } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, ArrowLeft, Calendar, Share2, Clock, Hash, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/Toast';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const { t } = useLanguage();
  const router = useRouter();
  const { success: showSuccessToast } = useToast();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const postData = await getBlogPostBySlug(slug);
        if (postData) {
          setPost(postData);
          
          // Load related posts (filter out current post, limit to 2)
          const allPosts = await getBlogPosts();
          setRelatedPosts(
            allPosts
              .filter((p) => p.isPublished && p.id !== postData.id)
              .slice(0, 2)
          );
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Copy share link and notify
  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showSuccessToast(t('Article link copied!', 'ලිපියේ සබැඳිය පිටපත් කරන ලදී!'));
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (typeof window === 'undefined' || !post) return;
    const text = encodeURIComponent(
      `${t('Read this article from Rangiri Iron Works: ', 'රංගිරි යකඩ වැඩ බ්ලොග් ලිපිය කියවන්න: ')} ${t(post.titleEn, post.titleSi)} \n\n ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <h2 className="text-2xl font-bold text-smoke">
          {t('Article Not Found', 'මෙම ලිපිය සොයාගත නොහැක')}
        </h2>
        <Button onClick={() => router.push('/blog')} variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          <span>{t('Back to Blog Listing', 'ලිපි ලැයිස්තුව වෙත')}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-iron min-h-screen py-10 relative overflow-hidden">
      
      {/* Background glow spot */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-steel-light tracking-wide uppercase select-none">
          <Link href="/" className="hover:text-smoke transition-colors">
            {t('Home', 'මුල් පිටුව')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <Link href="/blog" className="hover:text-smoke transition-colors">
            {t('Blog', 'බ්ලොග්')}
          </Link>
          <ChevronRight size={12} className="text-iron-light" />
          <span className="text-spark font-bold truncate max-w-[200px]">
            {t(post.titleEn, post.titleSi)}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-spark hover:text-spark-light transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} />
          <span>{t('Back to Blog', 'බ්ලොග් පිටුවට')}</span>
        </Link>

        {/* Article header banner details */}
        <div className="space-y-4">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-steel-light uppercase font-mono">
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-spark" />
              {formatDate(post.createdAt)}
            </span>
            <span className="text-iron-light">|</span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-spark" />
              {t('5 Min Read', 'විනාඩි 5ක කියවීමක්')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight leading-tight">
            {t(post.titleEn, post.titleSi)}
          </h1>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-steel-light font-light leading-relaxed italic border-l-2 border-spark pl-4 py-1">
            {t(post.excerptEn, post.excerptSi)}
          </p>
        </div>

        {/* Full cover image */}
        <div className="relative h-64 sm:h-[400px] rounded-lg overflow-hidden border border-iron-light/40 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={t(post.titleEn, post.titleSi)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Share buttons bar */}
        <div className="flex items-center justify-between border-y border-iron-light/25 py-4 my-2">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((t) => (
              <span key={t} className="flex items-center text-[10px] font-bold text-steel-light uppercase font-display bg-iron-mid px-2.5 py-1 rounded border border-iron-light/40">
                <Hash size={10} className="text-spark mr-0.5" />
                {t}
              </span>
            ))}
          </div>

          {/* Share Actions */}
          <div className="flex items-center gap-2">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="p-2 bg-iron-mid rounded-md border border-iron-light/50 text-steel-light hover:text-smoke transition-colors"
              title={t('Copy Page Link', 'සබැඳිය පිටපත් කරන්න')}
            >
              {copiedLink ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
            </button>
            {/* WhatsApp Share */}
            <Button
              onClick={handleWhatsAppShare}
              variant="success"
              size="sm"
              className="bg-[#25D366] hover:bg-[#128C7E] text-[10px] font-bold uppercase tracking-wider py-2 flex items-center gap-1.5 border-none"
            >
              <Share2 size={12} />
              <span>WhatsApp</span>
            </Button>
          </div>

        </div>

        {/* Markdown Rendered Content body */}
        <article className="prose prose-invert max-w-none pt-4 text-smoke prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-smoke prose-p:text-sm prose-p:leading-relaxed prose-p:font-light prose-strong:text-spark prose-a:text-spark hover:prose-a:text-spark-light prose-li:text-xs sm:prose-li:text-sm prose-li:font-light">
          <ReactMarkdown>
            {t(post.contentEn, post.contentSi)}
          </ReactMarkdown>
        </article>

        {/* Related Posts section */}
        {relatedPosts.length > 0 && (
          <div className="pt-16 border-t border-iron-light/25 space-y-6">
            <h3 className="text-xl font-display font-bold text-smoke uppercase tracking-wider">
              {t('You May Also Like', 'වෙනත් බ්ලොග් ලිපි')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((relPost) => (
                <Card
                  key={relPost.id}
                  variant="glass"
                  hoverEffect={true}
                  className="flex flex-col justify-between h-[340px] border-iron-light/35 hover:border-spark/40 group cursor-pointer"
                  onClick={() => router.push(`/blog/${relPost.slug}`)}
                >
                  <div className="relative h-40 bg-iron overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={relPost.coverImage}
                      alt={t(relPost.titleEn, relPost.titleSi)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-steel-light font-mono block">
                        {formatDate(relPost.createdAt)}
                      </span>
                      <h4 className="text-sm font-display font-bold text-smoke group-hover:text-spark transition-colors line-clamp-2 leading-tight">
                        {t(relPost.titleEn, relPost.titleSi)}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-spark tracking-wider uppercase block mt-3">
                      {t('READ ARTICLE →', 'ලිපිය කියවන්න →')}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
