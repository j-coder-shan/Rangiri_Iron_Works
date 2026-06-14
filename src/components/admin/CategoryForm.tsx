// src/components/admin/CategoryForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Save, X } from 'lucide-react';

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

export default function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const { error: showErrorToast } = useToast();

  const [nameEn, setNameEn] = useState(initialData?.nameEn || '');
  const [nameSi, setNameSi] = useState(initialData?.nameSi || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [icon, setIcon] = useState(initialData?.icon || 'Wrench');
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn || '');
  const [descriptionSi, setDescriptionSi] = useState(initialData?.descriptionSi || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [order, setOrder] = useState(initialData?.order || 1);
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);

  const [loading, setLoading] = useState(false);
  const [slugModified, setSlugModified] = useState(!!initialData);

  // Auto-generate slug from English name
  useEffect(() => {
    if (slugModified || !nameEn.trim()) return;
    const generated = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
  }, [nameEn, slugModified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameSi.trim() || !slug.trim()) {
      showErrorToast('All asterisk (*) fields are required');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        nameEn: nameEn.trim(),
        nameSi: nameSi.trim(),
        slug: slug.trim(),
        icon: icon.trim(),
        descriptionEn: descriptionEn.trim(),
        descriptionSi: descriptionSi.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        order: Number(order) || 1,
        isActive,
      });
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const iconsList = ['Wrench', 'Paintbrush', 'Car', 'Truck', 'Zap', 'Settings', 'Flame', 'Hammer', 'Layers'];

  return (
    <Card variant="light" className="p-6 sm:p-8 border border-gray-100 max-w-3xl mx-auto shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        
        {/* Name Fields (EN + SI) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Category Name (English) *
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Iron Fabrication Services"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Category Name (Sinhala) *
            </label>
            <input
              type="text"
              value={nameSi}
              onChange={(e) => setNameSi(e.target.value)}
              placeholder="e.g. යකඩ නිෂ්පාදන සේවා"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala"
            />
          </div>
        </div>

        {/* Slug & Icon Selection */}
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
              placeholder="e.g. iron-fabrication"
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Display Icon
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
            >
              {iconsList.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descriptions (EN + SI) */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Description (English)
            </label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              placeholder="Describe this category in English..."
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Description (Sinhala)
            </label>
            <textarea
              value={descriptionSi}
              onChange={(e) => setDescriptionSi(e.target.value)}
              rows={3}
              placeholder="Describe this category in Sinhala..."
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala"
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
          <span className="text-[10px] text-gray-400 block">
            Provide a direct image URL (Unsplash or Cloudinary preset url) to represent this service category.
          </span>
        </div>

        {/* Settings: Display Order and Toggle active */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Display Sort Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 1)}
              min={1}
              className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-mono"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer py-3 text-xs font-bold text-gray-700 uppercase select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-[#E8500A]"
              />
              <span>Category is Active (Visible on Website)</span>
            </label>
          </div>
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
            <span>Save Category</span>
          </Button>
        </div>

      </form>
    </Card>
  );
}
