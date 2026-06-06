// src/app/admin/categories/new/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { saveCategory } from '@/lib/db';
import { Category } from '@/types';
import CategoryForm from '@/components/admin/CategoryForm';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNewCategoryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { success: showSuccessToast } = useToast();

  const handleFormSubmit = async (formData: Omit<Category, 'id' | 'createdAt'>) => {
    // Generate new random category ID
    const newId = `cat-${Math.random().toString(36).substring(2, 9)}`;
    const newCategory: Category = {
      id: newId,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    await saveCategory(newCategory);
    showSuccessToast('Category created successfully!');
    router.push('/admin/categories');
  };

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
          Add New Category
        </h2>
        <p className="text-xs text-gray-500">
          Create a new service segment. This will appear on the services overview and homepage list.
        </p>
      </div>

      {/* Render the unified Form */}
      <CategoryForm
        onSubmit={handleFormSubmit}
        onCancel={() => router.push('/admin/categories')}
      />

    </div>
  );
}
