// src/app/admin/categories/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, deleteCategory, saveCategory, getItems } from '@/lib/db';
import { Category } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, Edit, Trash2, FolderOpen } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [itemsCountMap, setItemsCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const cats = await getCategories();
      const items = await getItems();
      
      // Calculate item count per category
      const counts: Record<string, number> = {};
      items.forEach((item) => {
        counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
      });
      setItemsCountMap(counts);
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle category active status directly from table
  const handleToggleActive = async (cat: Category) => {
    try {
      const updatedCat = { ...cat, isActive: !cat.isActive };
      await saveCategory(updatedCat);
      showSuccess(`Category status updated!`);
      loadData(); // reload table
    } catch {
      showError('Failed to update category status');
    }
  };

  // Delete category with item validation
  const handleDelete = async (id: string, name: string) => {
    const itemCount = itemsCountMap[id] || 0;
    if (itemCount > 0) {
      showError(`Cannot delete category "${name}" because it contains ${itemCount} items. Move or delete items first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }

    try {
      await deleteCategory(id);
      showSuccess('Category deleted successfully!');
      loadData(); // reload
    } catch {
      showError('Failed to delete category');
    }
  };

  const renderIcon = (iconName: string) => {
    const LucideIcon = (Icons as any)[iconName];
    if (LucideIcon) {
      return <LucideIcon className="w-5 h-5 text-[#E8500A]" />;
    }
    return <Icons.FolderOpen className="w-5 h-5 text-[#E8500A]" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Category Management
          </span>
          <p className="text-xs text-gray-500">
            Define website categories, slugs, order indexes, and cover images.
          </p>
        </div>

        <Button
          onClick={() => router.push('/admin/categories/new')}
          variant="spark"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5"
        >
          <PlusCircle size={16} />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Categories table card */}
      <Card variant="light" className="border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xs flex flex-col items-center gap-2">
            <FolderOpen size={36} className="text-gray-300" />
            <span>No categories defined in database. Add one to start.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="px-6 py-4 w-16 text-center">Order</th>
                  <th className="px-6 py-4 w-16 text-center">Icon</th>
                  <th className="px-6 py-4">Name (English)</th>
                  <th className="px-6 py-4">Name (Sinhala)</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 text-center">Items Count</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Order index */}
                    <td className="px-6 py-4 text-center font-bold text-gray-700">
                      {cat.order}
                    </td>

                    {/* Icon */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center p-2 bg-orange-50 rounded-md max-w-[40px] mx-auto">
                        {renderIcon(cat.icon)}
                      </div>
                    </td>

                    {/* English Name */}
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {cat.nameEn}
                    </td>

                    {/* Sinhala Name */}
                    <td className="px-6 py-4 font-sinhala text-sm text-gray-700">
                      {cat.nameSi}
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 text-gray-500 font-mono">
                      {cat.slug}
                    </td>

                    {/* Items count */}
                    <td className="px-6 py-4 text-center font-semibold text-gray-800">
                      {itemsCountMap[cat.id] || 0}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          cat.isActive 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => router.push(`/admin/categories/${cat.id}`)}
                        className="text-gray-500 hover:text-blue-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                        title="Edit Category"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.nameEn)}
                        className="text-gray-500 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                        title="Delete Category"
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
