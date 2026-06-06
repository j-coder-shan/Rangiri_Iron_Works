// src/app/admin/categories/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCategories, saveCategory } from '@/lib/db';
import { Category } from '@/types';
import CategoryForm from '@/components/admin/CategoryForm';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const catId = params?.id as string;
  
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!catId) return;
    
    const loadCategory = async () => {
      try {
        const cats = await getCategories();
        const found = cats.find((c) => c.id === catId);
        if (found) {
          setCategory(found);
        } else {
          showErrorToast('Category not found');
          router.push('/admin/categories');
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Failed to load category details');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [catId, router, showErrorToast]);

  const handleFormSubmit = async (formData: Omit<Category, 'id' | 'createdAt'>) => {
    if (!category) return;

    const updatedCategory: Category = {
      ...category,
      ...formData,
    };

    await saveCategory(updatedCategory);
    showSuccessToast('Category updated successfully!');
    router.push('/admin/categories');
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
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8500A] hover:text-[#FF6B2B] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        <span>Back to Categories</span>
      </Link>

      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-gray-950 uppercase tracking-wide">
          Edit Category
        </h2>
        <p className="text-xs text-gray-500">
          Modify details for this service segment. Updated names, slugs, or status will be applied site-wide.
        </p>
      </div>

      {/* Render the unified Form */}
      {category && (
        <CategoryForm
          initialData={category}
          onSubmit={handleFormSubmit}
          onCancel={() => router.push('/admin/categories')}
        />
      )}

    </div>
  );
}
