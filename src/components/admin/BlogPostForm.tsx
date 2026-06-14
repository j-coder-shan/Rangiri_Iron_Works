// src/components/admin/BlogPostForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Save, X } from 'lucide-react';

interface BlogPostFormProps {
  initialData?: BlogPost | null;
  onSubmit: (data: Omit<BlogPost, 'id' | 'createdAt' | 'publishedAt'>) => Promise<void>;
  onCancel: () => void;
}

export default function BlogPostForm({ initialData, onSubmit, onCancel }: BlogPostFormProps) {
  const { error: showErrorToast } = useToast();

  const [titleEn, setTitleEn] = useState(initialData?.titleEn || '');
  const [titleSi, setTitleSi] = useState(initialData?.titleSi || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerptEn, setExcerptEn] = useState(initialData?.excerptEn || '');
  const [excerptSi, setExcerptSi] = useState(initialData?.excerptSi || '');
  const [contentEn, setContentEn] = useState(initialData?.contentEn || '');
  const [contentSi, setContentSi] = useState(initialData?.contentSi || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isPublished, setIsPublished] = useState(initialData?.isPublished !== false);

  const [loading, setLoading] = useState(false);
  const [slugModified, setSlugModified] = useState(!!initialData);

  // Auto-generate slug from English title
  useEffect(() => {
    if (slugModified || !titleEn.trim()) return;
    const generated = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
  }, [titleEn, slugModified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn.trim() || !titleSi.trim() || !slug.trim() || !contentEn.trim() || !contentSi.trim()) {
      showErrorToast('Titles, Slug, and Content (both languages) are required');
      return;
    }

    setLoading(true);

    try {
      // Parse tags
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      await onSubmit({
        titleEn: titleEn.trim(),
        titleSi: titleSi.trim(),
        slug: slug.trim(),
        excerptEn: excerptEn.trim(),
        excerptSi: excerptSi.trim(),
        contentEn: contentEn.trim(),
        contentSi: contentSi.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        tags,
        isPublished,
      });
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="light" className="p-6 sm:p-8 border border-gray-100 max-w-5xl mx-auto shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        
        {/* Title Fields (EN + SI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Post Title (English) *
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. 5 Maintenance Tips for Steel Gates"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Post Title (Sinhala) *
            </label>
            <input
              type="text"
              value={titleSi}
              onChange={(e) => setTitleSi(e.target.value)}
              placeholder="e.g. යකඩ ගේට්ටු නඩත්තු කිරීම සඳහා උපදෙස් 5ක්"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala"
            />
          </div>
        </div>

        {/* Slug & Tags Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugModified(true);
              }}
              placeholder="e.g. steel-gate-maintenance-tips"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. maintenance, gates, welding"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
            />
          </div>
        </div>

        {/* Cover Photo URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
            Cover Image URL
          </label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="e.g. https://images.unsplash.com/photo-..."
            className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-mono"
          />
        </div>

        {/* Excerpts (EN + SI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Excerpt / Brief Summary (English)
            </label>
            <textarea
              value={excerptEn}
              onChange={(e) => setExcerptEn(e.target.value)}
              rows={3}
              placeholder="Provide a short summary in English..."
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Excerpt / Brief Summary (Sinhala)
            </label>
            <textarea
              value={excerptSi}
              onChange={(e) => setExcerptSi(e.target.value)}
              rows={3}
              placeholder="Provide a short summary in Sinhala..."
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala"
            />
          </div>
        </div>

        {/* Body Contents (EN + SI) - Tall Markdown Editors */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Blog Article Content (English Markdown) *
            </label>
            <textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={14}
              placeholder="# Heading 1&#10;Write details here..."
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Blog Article Content (Sinhala Markdown) *
            </label>
            <textarea
              value={contentSi}
              onChange={(e) => setContentSi(e.target.value)}
              rows={14}
              placeholder="# ප්‍රධාන මාතෘකාව&#10;ලිපියේ විස්තර මෙහි ලියන්න..."
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Publish Setting Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <label className="flex items-center gap-2 cursor-pointer py-3 text-xs font-bold text-gray-700 uppercase select-none">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-[#E8500A]"
            />
            <span>Publish Article Immediately (Visible on Website)</span>
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-3"
          >
            <X size={14} />
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            variant="spark"
            loading={loading}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-3"
          >
            <Save size={14} />
            <span>Save Article</span>
          </Button>
        </div>

      </form>
    </Card>
  );
}
