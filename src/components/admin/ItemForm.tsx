// src/components/admin/ItemForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Item, Category } from '@/types';
import { getCategories } from '@/lib/db';
import { generateItemCode } from '@/lib/codeGenerator';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Save, X, Plus, Trash2, Image as ImageIcon, Eye, AlertCircle } from 'lucide-react';

interface ItemFormProps {
  initialData?: Item | null;
  onSubmit: (data: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

interface FeatureItem {
  id: string;
  en: string;
  si: string;
}

export default function ItemForm({ initialData, onSubmit, onCancel }: ItemFormProps) {
  const { error: showErrorToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Form states
  const [nameEn, setNameEn] = useState(initialData?.nameEn || '');
  const [nameSi, setNameSi] = useState(initialData?.nameSi || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn || '');
  const [descriptionSi, setDescriptionSi] = useState(initialData?.descriptionSi || '');
  const [order, setOrder] = useState(initialData?.order || 1);
  const [isActive, setIsActive] = useState(initialData?.isActive !== false);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);

  // Features list state (aligned EN/SI pairs)
  const [featureItems, setFeatureItems] = useState<FeatureItem[]>([]);
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFeatureSi, setNewFeatureSi] = useState('');

  // Images list state
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [codeModified, setCodeModified] = useState(!!initialData);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await getCategories();
        const activeList = list.filter((c) => c.isActive);
        setCategories(activeList);
        
        // If not editing and we have categories, default to first one
        if (!initialData && activeList.length > 0) {
          setCategoryId(activeList[0].id);
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Failed to load categories');
      } finally {
        setLoadingCats(false);
      }
    };
    loadCategories();
  }, [initialData, showErrorToast]);

  // Load features from initial data
  useEffect(() => {
    if (initialData) {
      const initialFeatures: FeatureItem[] = [];
      const len = Math.max(initialData.features?.length || 0, initialData.featuresSi?.length || 0);
      for (let i = 0; i < len; i++) {
        initialFeatures.push({
          id: `feat-${i}-${Math.random().toString(36).substring(2, 6)}`,
          en: initialData.features?.[i] || '',
          si: initialData.featuresSi?.[i] || '',
        });
      }
      setFeatureItems(initialFeatures);
    }
  }, [initialData]);

  // Handle auto code generation
  useEffect(() => {
    if (codeModified || !categoryId || loadingCats) return;
    
    const selectedCat = categories.find((c) => c.id === categoryId);
    if (!selectedCat) return;

    const autoGenCode = async () => {
      try {
        const newCode = await generateItemCode(selectedCat.slug);
        setCode(newCode);
      } catch (err) {
        console.error(err);
      }
    };

    autoGenCode();
  }, [categoryId, categories, codeModified, loadingCats]);

  // Add a feature pair
  const handleAddFeature = () => {
    if (!newFeatureEn.trim() && !newFeatureSi.trim()) {
      showErrorToast('Feature details cannot be completely blank');
      return;
    }
    const newItem: FeatureItem = {
      id: `feat-${Date.now()}`,
      en: newFeatureEn.trim(),
      si: newFeatureSi.trim(),
    };
    setFeatureItems([...featureItems, newItem]);
    setNewFeatureEn('');
    setNewFeatureSi('');
  };

  // Remove a feature
  const handleRemoveFeature = (id: string) => {
    setFeatureItems(featureItems.filter((f) => f.id !== id));
  };

  // Add an image url
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (!newImageUrl.startsWith('http://') && !newImageUrl.startsWith('https://')) {
      showErrorToast('Please enter a valid image URL (starting with http or https)');
      return;
    }
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove an image url
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameSi.trim() || !categoryId || !code.trim()) {
      showErrorToast('Name (both languages), Category, and Code are required');
      return;
    }

    if (images.length === 0) {
      showErrorToast('Please add at least one image URL for this item');
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);
    if (!selectedCat) {
      showErrorToast('Selected category is invalid or inactive');
      return;
    }

    setSubmitting(true);

    try {
      // Split featureItems back to en/si lists
      const features = featureItems.map((f) => f.en).filter(Boolean);
      const featuresSi = featureItems.map((f) => f.si).filter(Boolean);

      await onSubmit({
        nameEn: nameEn.trim(),
        nameSi: nameSi.trim(),
        code: code.trim().toUpperCase(),
        categoryId,
        categorySlug: selectedCat.slug,
        descriptionEn: descriptionEn.trim(),
        descriptionSi: descriptionSi.trim(),
        features,
        featuresSi,
        images,
        isFeatured,
        isActive,
        order: Number(order) || 1,
      });
    } catch (err: any) {
      console.error(err);
      showErrorToast(err.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCats) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E8500A]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left columns - General details */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
            
            {/* Section heading */}
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 uppercase tracking-wider text-xs">
                General Product details
              </h3>
            </div>

            {/* Names (EN + SI) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Item Name (English) *
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Standard Iron Gate"
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Item Name (Sinhala) *
                </label>
                <input
                  type="text"
                  value={nameSi}
                  onChange={(e) => setNameSi(e.target.value)}
                  placeholder="e.g. ප්‍රමිතිගත යකඩ ගේට්ටුව"
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala"
                />
              </div>
            </div>

            {/* Category selection & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameEn} ({cat.nameSi})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Item Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeModified(true);
                    }}
                    placeholder="RIW-IF-0001"
                    className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-mono uppercase"
                  />
                  {codeModified && (
                    <button
                      type="button"
                      onClick={() => setCodeModified(false)}
                      className="absolute right-3 top-3 text-[10px] text-[#E8500A] font-bold uppercase hover:underline"
                    >
                      Reset Auto
                    </button>
                  )}
                </div>
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
                  rows={4}
                  placeholder="Enter detailed English description..."
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
                  rows={4}
                  placeholder="Enter detailed Sinhala description..."
                  className="w-full bg-gray-50 text-gray-800 px-4 py-3 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20 font-sinhala"
                />
              </div>
            </div>

            {/* Sort order & settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Sort Order
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
                  <span>Product is Active</span>
                </label>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer py-3 text-xs font-bold text-gray-700 uppercase select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#E8500A]"
                  />
                  <span>Featured on Home</span>
                </label>
              </div>
            </div>

          </Card>

          {/* Specifications/Features Component */}
          <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
            
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 uppercase tracking-wider text-xs">
                Specifications & Features
              </h3>
            </div>

            {/* Existing specifications */}
            <div className="space-y-3">
              {featureItems.length === 0 ? (
                <div className="text-gray-400 text-xs py-4 text-center border border-dashed border-gray-200 rounded-md">
                  No features added. Add technical specifications or highlights below.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-md bg-white overflow-hidden">
                  {featureItems.map((feat, idx) => (
                    <div key={feat.id} className="flex items-center justify-between p-3 gap-4 hover:bg-gray-50/50">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400 font-mono mr-2">{idx + 1}.</span>
                          <span className="font-semibold text-gray-800">{feat.en}</span>
                        </div>
                        <div className="font-sinhala text-gray-600 pl-4 sm:pl-0">
                          {feat.si}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feat.id)}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-100 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to add features */}
            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-md space-y-4">
              <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Add Feature Bullet Point
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-500 font-bold uppercase">English Text</label>
                  <input
                    type="text"
                    value={newFeatureEn}
                    onChange={(e) => setNewFeatureEn(e.target.value)}
                    placeholder="e.g. Heavy-duty mild steel (12-gauge)"
                    className="w-full bg-white text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-gray-500 font-bold uppercase font-sinhala">Sinhala Text</label>
                  <input
                    type="text"
                    value={newFeatureSi}
                    onChange={(e) => setNewFeatureSi(e.target.value)}
                    placeholder="e.g. ශක්තිමත් මෘදු වානේ (ගේජ් 12)"
                    className="w-full bg-white text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center gap-1 text-xs py-2 px-3 font-semibold"
                >
                  <Plus size={14} />
                  <span>Add Feature</span>
                </Button>
              </div>
            </div>

          </Card>
        </div>

        {/* Right column - Images manager */}
        <div className="space-y-6">
          <Card variant="light" className="p-6 border border-gray-100 shadow-md space-y-6">
            
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 uppercase tracking-wider text-xs">
                Product Images
              </h3>
            </div>

            {/* Info alert */}
            <div className="bg-amber-50 border border-amber-100 rounded-md p-3 flex gap-2 text-[11px] text-amber-800 leading-relaxed">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                First image in the list will be treated as the main <strong>Thumbnail</strong>. You must add at least one image.
              </span>
            </div>

            {/* List of images */}
            <div className="space-y-4">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative group border border-gray-100 rounded-md overflow-hidden bg-gray-50 flex gap-3 p-2">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imgUrl} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    {index === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#E8500A] text-white text-[8px] font-bold text-center uppercase tracking-wide py-0.5">
                        THUMB
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <span className="text-[10px] text-gray-400 block truncate font-mono">
                      {imgUrl}
                    </span>
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-100 rounded transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Image Form */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] text-xs font-mono"
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-100 px-3 flex items-center justify-center"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

          </Card>
        </div>

      </div>

      {/* Global Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
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
          loading={submitting}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-3"
        >
          <Save size={14} />
          <span>Save Service Item</span>
        </Button>
      </div>

    </form>
  );
}
