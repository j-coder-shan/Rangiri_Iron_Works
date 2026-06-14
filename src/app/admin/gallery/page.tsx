// src/app/admin/gallery/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getGallery, saveGalleryPhoto, deleteGalleryPhoto, getCategories } from '@/lib/db';
import { GalleryPhoto, Category } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, Edit, Trash2, Search, Sparkles } from 'lucide-react';

export default function AdminGalleryPage() {
  const { success: showSuccess, error: showError } = useToast();

  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<GalleryPhoto | null>(null);

  // Form States
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [captionEn, setCaptionEn] = useState('');
  const [captionSi, setCaptionSi] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState(1);

  const loadData = useCallback(async () => {
    try {
      const allPhotos = await getGallery();
      const allCats = await getCategories();
      setGallery(allPhotos);
      setCategories(allCats.filter(c => c.isActive));

      if (allCats.length > 0 && !categoryId) {
        setCategoryId(allCats[0].id);
      }
    } catch {
      showError('Failed to load gallery assets');
    } finally {
      setLoading(false);
    }
  }, [categoryId, showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setCurrentPhoto(null);
    setImageUrl('');
    setCaptionEn('');
    setCaptionSi('');
    setIsFeatured(false);
    setOrder(gallery.length + 1);
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (photo: GalleryPhoto) => {
    setCurrentPhoto(photo);
    setImageUrl(photo.imageUrl);
    setCategoryId(photo.categoryId);
    setCaptionEn(photo.captionEn);
    setCaptionSi(photo.captionSi);
    setIsFeatured(photo.isFeatured);
    setOrder(photo.order);
    setIsModalOpen(true);
  };

  const handleToggleFeatured = async (photo: GalleryPhoto) => {
    try {
      const updated = { ...photo, isFeatured: !photo.isFeatured };
      await saveGalleryPhoto(updated);
      showSuccess('Featured status updated');
      loadData();
    } catch {
      showError('Failed to toggle featured status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery photo?')) {
      return;
    }
    try {
      await deleteGalleryPhoto(id);
      showSuccess('Photo deleted successfully');
      loadData();
    } catch {
      showError('Failed to delete photo');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl.trim() || !categoryId) {
      showError('Image URL and Category selection are required');
      return;
    }

    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      showError('Invalid Image URL (must start with http/https)');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: currentPhoto?.id || `gal-${Math.random().toString(36).substring(2, 9)}`,
      categoryId,
      imageUrl: imageUrl.trim(),
      captionEn: captionEn.trim() || 'Workshop Showcase',
      captionSi: captionSi.trim() || 'වැඩපල ප්‍රදර්ශනය',
      isFeatured,
      order: Number(order) || 1,
      createdAt: currentPhoto?.createdAt || new Date().toISOString(),
    };

    try {
      await saveGalleryPhoto(newPhoto);
      showSuccess(currentPhoto ? 'Gallery photo updated' : 'New gallery photo added');
      setIsModalOpen(false);
      loadData();
    } catch {
      showError('Failed to save gallery photo');
    }
  };

  const filteredPhotos = gallery.filter((photo) => {
    const matchesSearch = 
      photo.captionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.captionSi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? photo.categoryId === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.nameEn : 'Service Showcase';
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
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Gallery Portfolio Manager
          </span>
          <p className="text-xs text-gray-500">
            Publish workshop portfolio photographs, categorize them, and manage the website's grid display.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          variant="spark"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5"
        >
          <PlusCircle size={16} />
          <span>Add Photo</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <Card variant="light" className="p-4 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption..."
            className="w-full bg-gray-50 text-gray-800 pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
          />
        </div>

        {/* Category selector filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameEn}
              </option>
            ))}
          </select>
        </div>

      </Card>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} variant="light" className="border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Image display */}
            <div className="relative aspect-video w-full bg-gray-100 border-b border-gray-100 overflow-hidden flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.captionEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[8px] font-bold uppercase tracking-wider">
                {getCategoryName(photo.categoryId)}
              </span>
            </div>

            {/* Captions & Info */}
            <div className="p-4 space-y-2 flex-grow">
              <span className="text-[10px] text-gray-400 font-bold font-mono">Order Index: {photo.order}</span>
              <p className="font-semibold text-gray-900 leading-snug line-clamp-1">{photo.captionEn}</p>
              <p className="font-sinhala text-[11px] text-gray-600 line-clamp-1">{photo.captionSi}</p>
            </div>

            {/* Footer controls */}
            <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 bg-gray-50/20">
              {/* Featured toggle badge */}
              <button
                onClick={() => handleToggleFeatured(photo)}
                className={`p-1.5 rounded-full transition-all ${
                  photo.isFeatured 
                    ? 'text-amber-500 bg-amber-50 border border-amber-200' 
                    : 'text-gray-300 hover:text-amber-400 hover:bg-gray-100'
                }`}
                title={photo.isFeatured ? 'Featured on home' : 'Mark as featured'}
              >
                <Sparkles size={13} className="fill-current" />
              </button>

              <div className="space-x-1">
                <button
                  onClick={() => openEditModal(photo)}
                  className="text-gray-500 hover:text-blue-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                  title="Edit Photo Info"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                  title="Delete Photo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

          </Card>
        ))}
      </div>

      {/* Modal Dialog for Add/Edit photo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPhoto ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
        className="!bg-white !border-gray-200 !text-gray-900"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-xs sm:text-sm text-gray-900">
          
          {/* Image URL & live preview */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-600 uppercase">Image URL *</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-mono text-xs"
            />
          </div>

          {imageUrl && (
            <div className="w-full h-36 bg-gray-50 border border-gray-200 rounded overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>
          )}

          {/* Category selection */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-600 uppercase">Gallery Section Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Captions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Caption (English)</label>
              <input
                type="text"
                value={captionEn}
                onChange={(e) => setCaptionEn(e.target.value)}
                placeholder="e.g. Arc Welding Gate Project"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase font-sinhala">Caption (Sinhala)</label>
              <input
                type="text"
                value={captionSi}
                onChange={(e) => setCaptionSi(e.target.value)}
                placeholder="e.g. ආක් වෙල්ඩින් ගේට්ටු ව්‍යාපෘතිය"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Display Sorting Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value) || 1)}
                min={1}
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-mono"
              />
            </div>

            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 uppercase">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#E8500A]"
                />
                <span>Featured on homepage</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-100 py-2 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="spark"
              className="py-2 px-4"
            >
              Save Photo Info
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
