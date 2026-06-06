// src/app/admin/blog/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogPosts, deleteBlogPost, saveBlogPost } from '@/lib/db';
import { BlogPost } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, Edit, Trash2, BookOpen, Search, Sparkles, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminBlogPage() {
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch {
      showError('Failed to load blog database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const updated = { 
        ...post, 
        isPublished: !post.isPublished,
        publishedAt: !post.isPublished ? new Date().toISOString() : post.publishedAt
      };
      await saveBlogPost(updated);
      showSuccess(`Article status toggled!`);
      loadData();
    } catch {
      showError('Failed to update publishing status');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the article "${title}"?`)) {
      return;
    }
    try {
      await deleteBlogPost(id);
      showSuccess('Article deleted successfully');
      loadData();
    } catch {
      showError('Failed to delete article');
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleSi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Knowledge Hub & Blog Manager
          </span>
          <p className="text-xs text-gray-500">
            Compose and edit announcements, maintenance instructions, welding guides, and showcase writeups.
          </p>
        </div>

        <Button
          onClick={() => router.push('/admin/blog/new')}
          variant="spark"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5"
        >
          <PlusCircle size={16} />
          <span>Add New Post</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <Card variant="light" className="p-4 border border-gray-100 flex items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by article title or slug..."
            className="w-full bg-gray-50 text-gray-800 pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
          />
        </div>
      </Card>

      {/* Blog Posts table */}
      <Card variant="light" className="border border-gray-100 overflow-hidden shadow-sm">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xs flex flex-col items-center gap-2 bg-white">
            <BookOpen size={36} className="text-gray-300" />
            <span>No articles found. Write your first blog post to get started!</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="px-6 py-4 w-20 text-center">Cover</th>
                  <th className="px-6 py-4">Title (English)</th>
                  <th className="px-6 py-4">Title (Sinhala)</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4 w-32">Created Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Cover Photo */}
                    <td className="px-6 py-4 text-center">
                      <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.titleEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* English Title */}
                    <td className="px-6 py-4 font-semibold text-gray-900 max-w-[200px] truncate">
                      {post.titleEn}
                    </td>

                    {/* Sinhala Title */}
                    <td className="px-6 py-4 font-sinhala text-sm text-gray-700 max-w-[200px] truncate">
                      {post.titleSi}
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-gray-500 font-mono">
                      {post.slug}
                    </td>

                    {/* Created date */}
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(post)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          post.isPublished 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {post.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/admin/blog/${post.id}`)}
                        className="text-gray-500 hover:text-blue-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                        title="Edit Article"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.titleEn)}
                        className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
}
