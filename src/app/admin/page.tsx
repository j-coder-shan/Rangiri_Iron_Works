// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getItems, getEnquiries } from '@/lib/db';
import { Enquiry } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { 
  FolderOpen, Tags, Inbox, AlertCircle, PlusCircle, 
  ChevronRight, Calendar, Phone, ArrowRight, Search 
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Metrics states
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [enquiriesTodayCount, setEnquiriesTodayCount] = useState(0);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);

  // Table states
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const cats = await getCategories();
        const itms = await getItems();
        const enqs = await getEnquiries();

        setCategoriesCount(cats.length);
        setItemsCount(itms.length);

        // Calculate today's enquiries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const enqsToday = enqs.filter((e) => new Date(e.createdAt) >= today);
        setEnquiriesTodayCount(enqsToday.length);

        // Count unread (new) enquiries
        const unreadEnqs = enqs.filter((e) => e.status === 'new');
        setNewEnquiriesCount(unreadEnqs.length);

        // Get last 10 enquiries
        setRecentEnquiries(enqs.slice(0, 10));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleSearchItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    let code = searchQuery.trim().toUpperCase();
    if (!code.startsWith('RIW-')) {
      const prefixes = ['IF', 'IP', 'VP', 'VC', 'TW', 'RM'];
      const hasPrefix = prefixes.some(p => code.startsWith(p + '-'));
      if (hasPrefix) {
        code = `RIW-${code}`;
      } else {
        code = `RIW-IF-${code.padStart(4, '0')}`;
      }
    }
    
    setSearchQuery('');
    router.push(`/admin/items?search=${code}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM, HH:mm');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  const metrics = [
    { label: 'Total Categories', value: categoriesCount, icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Items', value: itemsCount, icon: Tags, color: 'text-[#E8500A]', bg: 'bg-orange-50' },
    { label: 'Enquiries (Today)', value: enquiriesTodayCount, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Unread Enquiries', value: newEnquiriesCount, icon: Inbox, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Metrics Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} variant="light" className="p-6 flex items-center justify-between border border-gray-100">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  {m.label}
                </span>
                <span className="text-3xl font-display font-bold text-gray-900 block leading-none">
                  {m.value}
                </span>
              </div>
              <div className={`p-4 rounded-full ${m.bg} ${m.color}`}>
                <Icon size={24} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2. Quick Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions List */}
        <Card variant="light" className="p-6 border border-gray-100 lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Quick Actions & Shortcuts
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push('/admin/items/new')}
              variant="spark"
              className="flex items-center gap-2 py-3 justify-center text-xs font-bold uppercase tracking-wider"
            >
              <PlusCircle size={16} />
              <span>Add Service Item</span>
            </Button>
            <Button
              onClick={() => router.push('/admin/categories/new')}
              variant="outline"
              className="flex items-center gap-2 py-3 justify-center text-xs font-bold text-[#E8500A] border-[#E8500A] hover:bg-orange-50 uppercase tracking-wider"
            >
              <PlusCircle size={16} />
              <span>Add Category</span>
            </Button>
            <Button
              onClick={() => router.push('/admin/enquiries?status=new')}
              variant="outline"
              className="flex items-center gap-2 py-3 justify-center text-xs font-bold text-gray-700 border-gray-300 hover:bg-gray-50 uppercase tracking-wider"
            >
              <Inbox size={16} />
              <span>View Unread ({newEnquiriesCount})</span>
            </Button>
          </div>
        </Card>

        {/* Item search box shortcut */}
        <Card variant="light" className="p-6 border border-gray-100 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Quick Code Search
          </h3>
          <form onSubmit={handleSearchItem} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. IF-0001"
              className="w-full bg-gray-50 text-gray-800 text-xs px-3 py-2.5 rounded-l-md border border-gray-200 focus:border-[#E8500A] font-mono uppercase focus:ring-1 focus:ring-[#E8500A]/20"
            />
            <button
              type="submit"
              className="bg-[#E8500A] hover:bg-[#FF6B2B] text-white px-4 rounded-r-md transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </Card>
      </div>

      {/* 3. Recent Enquiries Table (last 10) */}
      <Card variant="light" className="border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Recent Enquiries Inbox
          </h3>
          <button
            onClick={() => router.push('/admin/enquiries')}
            className="text-xs font-semibold text-[#E8500A] hover:text-[#FF6B2B] flex items-center gap-1 transition-colors"
          >
            <span>View Inbox</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs flex flex-col items-center gap-2">
            <AlertCircle size={32} className="text-gray-300" />
            <span>No enquiries logged in database.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="px-6 py-4">Ref Number</th>
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Ref Number */}
                    <td className="px-6 py-4 font-mono font-bold text-gray-700">
                      {enq.referenceNumber}
                    </td>
                    
                    {/* Customer */}
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {enq.customerName}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600 font-mono flex items-center gap-1.5">
                      <Phone size={12} className="text-gray-400" />
                      <span>{enq.customerPhone}</span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-500">
                      {enq.categoryNameEn}
                      {enq.itemCode && (
                        <span className="block font-mono text-[9px] text-[#E8500A] font-bold mt-0.5">
                          Code: {enq.itemCode}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(enq.createdAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          enq.status === 'new'
                            ? 'warning'
                            : enq.status === 'seen'
                            ? 'steel'
                            : enq.status === 'replied'
                            ? 'success'
                            : 'steel'
                        }
                      >
                        {enq.status === 'new' ? 'New' : enq.status === 'seen' ? 'Seen' : enq.status === 'replied' ? 'Replied' : 'Closed'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push(`/admin/enquiries/${enq.id}`)}
                        className="text-[#E8500A] hover:text-[#FF6B2B] font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
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
