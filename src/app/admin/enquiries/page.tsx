// src/app/admin/enquiries/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getEnquiries, deleteEnquiry } from '@/lib/db';
import { Enquiry, EnquiryStatus } from '@/types';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Search, Inbox, Eye, Trash2, Calendar, Phone, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<EnquiryStatus | 'all'>('all');

  const loadData = useCallback(async () => {
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      showError('Failed to load enquiries inbox');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string, ref: string) => {
    if (!window.confirm(`Are you sure you want to delete enquiry ${ref}?`)) {
      return;
    }

    try {
      await deleteEnquiry(id);
      showSuccess(`Enquiry ${ref} deleted`);
      loadData();
    } catch {
      showError('Failed to delete enquiry');
    }
  };

  const getStatusBadgeColor = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'seen':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'replied':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-600 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getContactIcon = (contact: Enquiry['preferredContact']) => {
    switch (contact) {
      case 'whatsapp':
        return <MessageSquare size={12} className="text-green-500 fill-current" />;
      case 'call':
        return <Phone size={12} className="text-amber-500" />;
      case 'email':
        return <Mail size={12} className="text-blue-500" />;
    }
  };

  // Filter inquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch = 
      enq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.customerPhone.includes(searchQuery) ||
      enq.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusTab === 'all' ? true : enq.status === statusTab;

    return matchesSearch && matchesStatus;
  });

  const getTabCount = (status: EnquiryStatus | 'all') => {
    if (status === 'all') return enquiries.length;
    return enquiries.filter((e) => e.status === status).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const tabs: { value: EnquiryStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Enquiries' },
    { value: 'new', label: 'New' },
    { value: 'seen', label: 'Opened' },
    { value: 'replied', label: 'Replied' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
      
      {/* Header bar */}
      <div className="space-y-1">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
          Customer Quotations & Enquiries
        </span>
        <p className="text-xs text-gray-500">
          Inbox for public quote requests. Check project files, contact details, and update administrative notes.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="light" className="p-4 border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Inquiries</span>
            <span className="text-xl font-display font-bold block text-gray-900">{enquiries.length}</span>
          </div>
          <Inbox className="w-8 h-8 text-gray-300" />
        </Card>
        <Card variant="light" className="p-4 border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase text-red-600">Unread (New)</span>
            <span className="text-xl font-display font-bold block text-red-600">
              {enquiries.filter(e => e.status === 'new').length}
            </span>
          </div>
          <AlertCircle className="w-8 h-8 text-red-200" />
        </Card>
        <Card variant="light" className="p-4 border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase text-blue-500">Replied</span>
            <span className="text-xl font-display font-bold block text-blue-500">
              {enquiries.filter(e => e.status === 'replied').length}
            </span>
          </div>
          <MessageSquare className="w-8 h-8 text-blue-200" />
        </Card>
        <Card variant="light" className="p-4 border border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase text-green-600">Closed</span>
            <span className="text-xl font-display font-bold block text-green-600">
              {enquiries.filter(e => e.status === 'closed').length}
            </span>
          </div>
          <Inbox className="w-8 h-8 text-green-200" />
        </Card>
      </div>

      {/* Tab Filters & Search */}
      <Card variant="light" className="p-4 border border-gray-100 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none">
            {tabs.map((tab) => {
              const active = statusTab === tab.value;
              const count = getTabCount(tab.value);
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusTab(tab.value)}
                  className={`px-4 py-2.5 font-bold uppercase tracking-wider text-[10px] border-b-2 transition-all flex items-center gap-1.5 ${
                    active 
                      ? 'border-[#E8500A] text-[#E8500A]' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                    active ? 'bg-orange-50 text-[#E8500A]' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Ref, or Phone..."
              className="w-full bg-gray-50 text-gray-800 pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
            />
          </div>

        </div>

      </Card>

      {/* Enquiries Grid/Table */}
      <Card variant="light" className="border border-gray-100 overflow-hidden shadow-sm">
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xs flex flex-col items-center gap-2 bg-white">
            <Inbox size={36} className="text-gray-300" />
            <span>No enquiries found matching this filter.</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="px-6 py-4 w-32">Reference</th>
                  <th className="px-6 py-4 w-28">Received</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Interested Category</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((enq) => {
                  let relativeTime = '';
                  try {
                    relativeTime = formatDistanceToNow(new Date(enq.createdAt), { addSuffix: true });
                  } catch {
                    relativeTime = enq.createdAt;
                  }

                  return (
                    <tr 
                      key={enq.id} 
                      className={`hover:bg-gray-50/50 transition-colors ${
                        enq.status === 'new' ? 'bg-orange-50/20 font-semibold' : ''
                      }`}
                    >
                      {/* Ref */}
                      <td className="px-6 py-4 font-mono font-bold text-gray-950">
                        {enq.referenceNumber}
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap" title={enq.createdAt}>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          <span>{relativeTime}</span>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{enq.customerName}</div>
                        <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">
                          Lang: {enq.language === 'si' ? 'Sinhala' : 'English'}
                        </span>
                      </td>

                      {/* Contact Preferred */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {getContactIcon(enq.preferredContact)}
                            <span className="font-semibold text-gray-800">{enq.customerPhone}</span>
                          </div>
                          {enq.customerEmail && (
                            <span className="text-[10px] text-gray-400 block font-mono pl-5">{enq.customerEmail}</span>
                          )}
                        </div>
                      </td>

                      {/* Category Subject */}
                      <td className="px-6 py-4 text-gray-600">
                        <div className="font-medium">{enq.categoryNameEn}</div>
                        {enq.itemCode && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[9px] font-mono text-gray-600 uppercase mt-0.5">
                            Code: {enq.itemCode}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${getStatusBadgeColor(enq.status)}`}>
                          {enq.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/admin/enquiries/${enq.id}`)}
                          className="text-gray-600 hover:text-[#E8500A] p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id, enq.referenceNumber)}
                          className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                          title="Delete Enquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
}
