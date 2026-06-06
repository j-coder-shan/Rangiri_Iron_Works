// src/app/admin/items/new/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { saveItem } from '@/lib/db';
import { Item } from '@/types';
import ItemForm from '@/components/admin/ItemForm';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminNewItemPage() {
  const router = useRouter();
  const { success: showSuccessToast } = useToast();

  const handleFormSubmit = async (formData: Omit<Item, 'id' | 'createdAt'>) => {
    // Generate new item ID
    const newId = `item-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: Item = {
      id: newId,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    await saveItem(newItem);
    showSuccessToast('Service item created successfully!');
    router.push('/admin/items');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Back link */}
      <Link
        href="/admin/items"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8500A] hover:text-[#FF6B2B] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        <span>Back to Service Items</span>
      </Link>

      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-gray-950 uppercase tracking-wide">
          Add New Service Item
        </h2>
        <p className="text-xs text-gray-500">
          Create a new workshop product or service. This item will appear under its selected category section.
        </p>
      </div>

      {/* Render unified ItemForm */}
      <ItemForm
        onSubmit={handleFormSubmit}
        onCancel={() => router.push('/admin/items')}
      />

    </div>
  );
}
