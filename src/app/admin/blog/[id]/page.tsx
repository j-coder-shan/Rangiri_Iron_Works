// src/app/admin/blog/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBlogPostById, saveBlogPost } from '@/lib/db';
import { BlogPost } from '@/types';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminEditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      try {
        const found = await getBlogPostById(postId);
        if (found) {
          setPost(found);
        } else {
          showErrorToast('Blog post not found');
          router.push('/admin/blog');
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Failed to load blog post details');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, router, showErrorToast]);

  const handleFormSubmit = async (formData: Omit<BlogPost, 'id' | 'createdAt' | 'publishedAt'>) => {
    if (!post) return;

    const updatedPost: BlogPost = {
      ...post,
      ...formData,
      publishedAt: formData.isPublished 
        ? (post.publishedAt || new Date().toISOString()) 
        : '',
    };

    await saveBlogPost(updatedPost);
    showSuccessToast('Blog post updated successfully!');
    router.push('/admin/blog');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Back link */}
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8500A] hover:text-[#FF6B2B] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        <span>Back to Blog List</span>
      </Link>

      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-gray-950 uppercase tracking-wide">
          Edit Blog Post
        </h2>
        <p className="text-xs text-gray-500">
          Modify the body, title translations, excerpts, or cover pictures for this article.
        </p>
      </div>

      {/* Render unified BlogPostForm */}
      {post && (
        <BlogPostForm
          initialData={post}
          onSubmit={handleFormSubmit}
          onCancel={() => router.push('/admin/blog')}
        />
      )}

    </div>
  );
}
