// src/app/admin/items/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getItemById, saveItem } from '@/lib/db';
import { Item } from '@/types';
import ItemForm from '@/components/admin/ItemForm';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';

export default function AdminEditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;

  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;

    const loadItem = async () => {
      try {
        const found = await getItemById(itemId);
        if (found) {
          setItem(found);
        } else {
          showErrorToast('Service item not found');
          router.push('/admin/items');
        }
      } catch (err) {
        console.error(err);
        showErrorToast('Failed to load service item details');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId, router, showErrorToast]);

  const handleFormSubmit = async (formData: Omit<Item, 'id' | 'createdAt'>) => {
    if (!item) return;

    const updatedItem: Item = {
      ...item,
      ...formData,
    };

    await saveItem(updatedItem);
    showSuccessToast('Service item updated successfully!');
    router.push('/admin/items');
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
        href="/admin/items"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8500A] hover:text-[#FF6B2B] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        <span>Back to Service Items</span>
      </Link>

      <div className="space-y-1">
        <h2 className="text-xl font-display font-bold text-gray-950 uppercase tracking-wide">
          Edit Service Item
        </h2>
        <p className="text-xs text-gray-500">
          Modify the specifications, description, or image library for this service.
        </p>
      </div>

      {/* Render unified ItemForm */}
      {item && (
        <ItemForm
          initialData={item}
          onSubmit={handleFormSubmit}
          onCancel={() => router.push('/admin/items')}
        />
      )}

    </div>
  );
}
