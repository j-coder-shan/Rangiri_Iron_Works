// src/app/admin/blog/new/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { saveBlogPost } from '@/lib/db';
import { BlogPost } from '@/types';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNewBlogPostPage() {
  const router = useRouter();
  const { success: showSuccessToast } = useToast();

  const handleFormSubmit = async (formData: Omit<BlogPost, 'id' | 'createdAt' | 'publishedAt'>) => {
    const newId = `blog-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();
    
    const newPost: BlogPost = {
      id: newId,
      ...formData,
      createdAt: now,
      publishedAt: formData.isPublished ? now : '',
    };

    await saveBlogPost(newPost);
    showSuccessToast('Blog post created successfully!');
    router.push('/admin/blog');
  };

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
          Compose New Blog Post
        </h2>
        <p className="text-xs text-gray-500">
          Create a bilingual article with markdown styling, excerpts, and image links.
        </p>
      </div>

      {/* Unified BlogPostForm */}
      <BlogPostForm
        onSubmit={handleFormSubmit}
        onCancel={() => router.push('/admin/blog')}
      />

    </div>
  );
}
