// src/app/admin/items/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getItems, deleteItem, saveItem, getCategories } from '@/lib/db';
import { Item, Category } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, Edit, Trash2, Search, Filter, Sparkles, FolderOpen, SlidersHorizontal } from 'lucide-react';

export default function AdminItemsPage() {
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [featuredFilter, setFeaturedFilter] = useState('all'); // 'all', 'featured', 'standard'

  const loadData = async () => {
    try {
      const allItems = await getItems();
      const allCats = await getCategories();
      setItems(allItems);
      setCategories(allCats);
    } catch (err) {
      console.error(err);
      showError('Failed to load items database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (item: Item) => {
    try {
      const updated = { ...item, isActive: !item.isActive };
      await saveItem(updated);
      showSuccess(`Status updated for ${item.code}`);
      loadData();
    } catch {
      showError('Failed to update status');
    }
  };

  const handleToggleFeatured = async (item: Item) => {
    try {
      const updated = { ...item, isFeatured: !item.isFeatured };
      await saveItem(updated);
      showSuccess(`${item.code} featured setting toggled`);
      loadData();
    } catch {
      showError('Failed to toggle featured status');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete service item ${code}?`)) {
      return;
    }

    try {
      await deleteItem(id);
      showSuccess(`Item ${code} deleted successfully`);
      loadData();
    } catch {
      showError('Failed to delete item');
    }
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameSi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
    
    const matchesStatus = 
      statusFilter === 'all' 
        ? true 
        : statusFilter === 'active' 
          ? item.isActive 
          : !item.isActive;

    const matchesFeatured = 
      featuredFilter === 'all' 
        ? true 
        : featuredFilter === 'featured' 
          ? item.isFeatured 
          : !item.isFeatured;

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.nameEn : 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Service Items Database
          </span>
          <p className="text-xs text-gray-500">
            Currently displaying {filteredItems.length} of {items.length} items. Manage photos, specifications, and layout positions.
          </p>
        </div>

        <Button
          onClick={() => router.push('/admin/items/new')}
          variant="spark"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 self-start"
        >
          <PlusCircle size={16} />
          <span>Add New Item</span>
        </Button>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="light" className="p-4 border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Total Items</span>
          <span className="text-xl font-display font-bold mt-1 text-gray-900">{items.length}</span>
        </Card>
        <Card variant="light" className="p-4 border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-bold uppercase text-green-600">Active Items</span>
          <span className="text-xl font-display font-bold mt-1 text-green-600">
            {items.filter(i => i.isActive).length}
          </span>
        </Card>
        <Card variant="light" className="p-4 border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-bold uppercase text-amber-500">Featured Home</span>
          <span className="text-xl font-display font-bold mt-1 text-amber-500">
            {items.filter(i => i.isFeatured).length}
          </span>
        </Card>
        <Card variant="light" className="p-4 border border-gray-100 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-bold uppercase text-blue-600">Categories</span>
          <span className="text-xl font-display font-bold mt-1 text-blue-600">{categories.length}</span>
        </Card>
      </div>

      {/* Search and Filters Controls */}
      <Card variant="light" className="p-4 border border-gray-100 flex flex-col lg:flex-row gap-4 items-center">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Code or Name..."
            className="w-full bg-gray-50 text-gray-800 pl-9 pr-4 py-2.5 rounded-md border border-gray-200 focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A]/20"
          />
        </div>

        {/* Filters Group */}
        <div className="w-full flex flex-wrap lg:flex-nowrap gap-4 items-center">
          
          <div className="flex items-center gap-1.5 flex-1 min-w-[150px]">
            <FolderOpen size={16} className="text-gray-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
            <SlidersHorizontal size={14} className="text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
            <Sparkles size={14} className="text-gray-400 flex-shrink-0" />
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
            >
              <option value="all">All Items</option>
              <option value="featured">Featured Only</option>
              <option value="standard">Standard Only</option>
            </select>
          </div>

        </div>

      </Card>

      {/* Items Table */}
      <Card variant="light" className="border border-gray-100 overflow-hidden shadow-sm">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xs flex flex-col items-center gap-2 bg-white">
            <FolderOpen size={36} className="text-gray-300" />
            <span>No service items found matching your filters.</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="px-6 py-4 w-24">Code</th>
                  <th className="px-6 py-4 w-16 text-center">Thumb</th>
                  <th className="px-6 py-4">Item Name (English)</th>
                  <th className="px-6 py-4">Item Name (Sinhala)</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 w-16 text-center font-mono">Order</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Item Code */}
                    <td className="px-6 py-4 font-mono font-bold text-gray-950 uppercase">
                      {item.code}
                    </td>

                    {/* Thumbnail preview */}
                    <td className="px-6 py-4 text-center">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'}
                          alt={item.nameEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* English Name */}
                    <td className="px-6 py-4 font-semibold text-gray-900 max-w-[180px] truncate">
                      {item.nameEn}
                    </td>

                    {/* Sinhala Name */}
                    <td className="px-6 py-4 font-sinhala text-sm text-gray-700 max-w-[180px] truncate">
                      {item.nameSi}
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-4 text-gray-600">
                      {getCategoryName(item.categoryId)}
                    </td>

                    {/* Sort Order */}
                    <td className="px-6 py-4 text-center font-semibold text-gray-700 font-mono">
                      {item.order}
                    </td>

                    {/* Featured Star Button */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-full transition-all ${
                          item.isFeatured 
                            ? 'text-amber-500 bg-amber-50 border border-amber-200' 
                            : 'text-gray-300 hover:text-amber-400 hover:bg-gray-100'
                        }`}
                        title={item.isFeatured ? 'Featured on homepage' : 'Mark as featured'}
                      >
                        <Sparkles size={14} className="fill-current" />
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          item.isActive 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Action controls */}
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/admin/items/${item.id}`)}
                        className="text-gray-500 hover:text-blue-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                        title="Edit Item"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.code)}
                        className="text-gray-500 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                        title="Delete Item"
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
