// src/app/admin/enquiries/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getEnquiryById, updateEnquiryStatus } from '@/lib/db';
import { Enquiry, EnquiryStatus } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, MessageSquare, Phone, Mail, Save, ExternalLink, Paperclip, Clipboard, Check } from 'lucide-react';
import Link from 'next/link';

export default function AdminEnquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enquiryId = params?.id as string;

  const { success: showSuccess, error: showError } = useToast();

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<EnquiryStatus>('new');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!enquiryId) return;

    const loadEnquiry = async () => {
      try {
        const found = await getEnquiryById(enquiryId);
        if (found) {
          setEnquiry(found);
          setNotes(found.adminNotes || '');
          setStatus(found.status);

          // If the enquiry is new, auto-mark it as "seen" (opened)
          if (found.status === 'new') {
            await updateEnquiryStatus(enquiryId, 'seen');
            setStatus('seen');
            setEnquiry({ ...found, status: 'seen' });
          }
        } else {
          showError('Enquiry not found');
          router.push('/admin/enquiries');
        }
      } catch (err) {
        console.error(err);
        showError('Failed to load enquiry detail');
      } finally {
        setLoading(false);
      }
    };

    loadEnquiry();
  }, [enquiryId, router, showError]);

  const handleUpdateStatusAndNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry) return;

    setSaving(true);
    try {
      await updateEnquiryStatus(enquiry.id, status, notes.trim());
      showSuccess('Enquiry details updated successfully');
      setEnquiry({ ...enquiry, status, adminNotes: notes.trim() });
    } catch (err) {
      console.error(err);
      showError('Failed to update enquiry');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate reply templates
  const getWhatsAppLink = () => {
    if (!enquiry) return '';
    // Format phone to international structure if needed, Sri Lanka is +94
    let cleanPhone = enquiry.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.slice(1);
    }
    const text = `Hello ${enquiry.customerName}, thank you for contacting Rangiri Iron Works regarding your inquiry ${enquiry.referenceNumber} (${enquiry.categoryNameEn}). We would like to follow up with details...`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const getEmailLink = () => {
    if (!enquiry) return '';
    const subject = `Rangiri Iron Works — Follow-up on Inquiry ${enquiry.referenceNumber}`;
    const body = `Dear ${enquiry.customerName},\n\nThank you for reaching out to Rangiri Iron Works.\n\nWe received your request for a quotation regarding "${enquiry.categoryNameEn}" (Reference: ${enquiry.referenceNumber}).\n\n[Our team will write here details...]\n\nBest regards,\nRangiri Iron Works Team\nDambulla, Sri Lanka`;
    return `mailto:${enquiry.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!enquiry) return null;

  return (
    <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
      
      {/* Back button */}
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8500A] hover:text-[#FF6B2B] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        <span>Back to Inbox</span>
      </Link>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs text-gray-500 font-bold font-mono tracking-wider uppercase block">
            ENQUIRY REFERENCE: {enquiry.referenceNumber}
          </span>
          <h2 className="text-xl font-display font-bold text-gray-950 uppercase tracking-wide mt-1">
            {enquiry.customerName}
          </h2>
        </div>
        
        <button
          onClick={() => copyToClipboard(enquiry.referenceNumber)}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 border border-gray-200 hover:border-gray-300 rounded-md bg-white font-semibold text-gray-700 transition-all self-start"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Clipboard size={14} />}
          <span>{copied ? 'Copied Code' : 'Copy Reference'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Inquiry details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main card */}
          <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
            
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <h3 className="font-display font-bold text-gray-900 uppercase tracking-wider text-xs">
                Inquiry Message
              </h3>
              <span className="text-[10px] text-gray-400">
                Submitted on {new Date(enquiry.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Interest Area */}
            <div className="bg-gray-50 p-4 border border-gray-100 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Service Category</span>
                <span className="font-semibold text-gray-900 block mt-0.5">{enquiry.categoryNameEn}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Specific Item Code</span>
                {enquiry.itemCode ? (
                  <Link
                    href={`/item/${enquiry.itemCode}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[#E8500A] hover:underline font-mono font-bold mt-0.5"
                  >
                    <span>{enquiry.itemCode}</span>
                    <ExternalLink size={12} />
                  </Link>
                ) : (
                  <span className="text-gray-400 block mt-0.5 font-medium">None Specified (General Inquiry)</span>
                )}
              </div>
            </div>

            {/* Customer Message */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Message Body</span>
              <div className="bg-white border border-gray-100 rounded-md p-4 min-h-[120px] text-gray-800 whitespace-pre-wrap leading-relaxed">
                {enquiry.message || <span className="text-gray-400 italic">No message text provided.</span>}
              </div>
            </div>

            {/* Attachments */}
            {enquiry.attachmentUrls && enquiry.attachmentUrls.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <Paperclip size={12} />
                  <span>Attachments ({enquiry.attachmentUrls.length})</span>
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {enquiry.attachmentUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block relative border border-gray-200 rounded-md overflow-hidden bg-gray-50 aspect-video hover:border-[#E8500A] transition-all"
                      title="View full attachment"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={url} 
                        alt={`Attachment ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          View Image
                          <ExternalLink size={12} />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </Card>

          {/* Quick Communication Reply helpers */}
          <Card variant="light" className="p-6 border border-gray-100 shadow-md space-y-6">
            
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 uppercase tracking-wider text-xs">
                Quick Reply Shortcuts
              </h3>
            </div>

            <p className="text-xs text-gray-500">
              Open contact channels prefilled with references to this query. Ensure you update the inquiry status to **Replied** afterward.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* WhatsApp Reply */}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 border border-green-200 rounded-md bg-green-50/50 hover:bg-green-50 hover:border-green-400 text-green-800 transition-all text-center gap-2 group"
              >
                <MessageSquare size={24} className="fill-current text-green-500" />
                <span className="font-bold text-xs">WhatsApp Client</span>
                <span className="text-[10px] text-green-600 block leading-tight truncate max-w-full">
                  {enquiry.customerPhone}
                </span>
              </a>

              {/* Call Client */}
              <a
                href={`tel:${enquiry.customerPhone}`}
                className="flex flex-col items-center justify-center p-4 border border-amber-200 rounded-md bg-amber-50/50 hover:bg-amber-50 hover:border-amber-400 text-amber-800 transition-all text-center gap-2"
              >
                <Phone size={24} className="text-amber-500" />
                <span className="font-bold text-xs">Direct Call</span>
                <span className="text-[10px] text-amber-600 block leading-tight truncate max-w-full">
                  {enquiry.customerPhone}
                </span>
              </a>

              {/* Email Client */}
              {enquiry.customerEmail ? (
                <a
                  href={getEmailLink()}
                  className="flex flex-col items-center justify-center p-4 border border-blue-200 rounded-md bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 text-blue-800 transition-all text-center gap-2"
                >
                  <Mail size={24} className="text-blue-500" />
                  <span className="font-bold text-xs">Send Email</span>
                  <span className="text-[10px] text-blue-600 block leading-tight truncate max-w-full">
                    {enquiry.customerEmail}
                  </span>
                </a>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-md bg-gray-50/50 text-gray-400 text-center gap-2 select-none">
                  <Mail size={24} className="text-gray-300" />
                  <span className="font-bold text-xs">Email Reply</span>
                  <span className="text-[10px] block leading-tight">No email provided</span>
                </div>
              )}

            </div>

          </Card>
        </div>

        {/* Right Column: Administration */}
        <div className="space-y-6">
          
          {/* Customer Profile info Card */}
          <Card variant="light" className="p-6 border border-gray-100 shadow-md space-y-4">
            
            <div className="border-b border-gray-100 pb-2">
              <h4 className="font-display font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Client Profile
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Preferred contact</span>
                <span className="font-bold text-gray-800 capitalize">{enquiry.preferredContact}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Client Language</span>
                <span className="font-bold text-gray-800 uppercase">{enquiry.language === 'si' ? 'Sinhala' : 'English'}</span>
              </div>
              {enquiry.ipAddress && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">IP Address</span>
                  <span className="font-mono text-gray-700">{enquiry.ipAddress}</span>
                </div>
              )}
            </div>

          </Card>

          {/* Settings & Admin Logs form */}
          <Card variant="light" className="p-6 border border-gray-100 shadow-md">
            
            <form onSubmit={handleUpdateStatusAndNotes} className="space-y-6">
              
              <div className="border-b border-gray-100 pb-2">
                <h4 className="font-display font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Administrative Updates
                </h4>
              </div>

              {/* Status drop down */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Inquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
                  className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
                >
                  <option value="new">New / Unread</option>
                  <option value="seen">Seen / Opened</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed / Solved</option>
                </select>
              </div>

              {/* Internal logs text */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Internal Admin Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Record call summaries, measurements, custom pricing discussed, or progress notes here..."
                  className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] leading-relaxed"
                />
                <span className="text-[10px] text-gray-400 block leading-tight">
                  These notes are only visible to administrators.
                </span>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="spark"
                loading={saving}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2.5"
              >
                <Save size={14} />
                <span>Save Administrative Logs</span>
              </Button>

            </form>

          </Card>
        </div>

      </div>

    </div>
  );
}
