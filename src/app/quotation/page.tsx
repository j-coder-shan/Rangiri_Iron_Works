// src/app/quotation/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategories, getItemByCode, saveEnquiry, getEnquiries } from '@/lib/db';
import { sendEmailNotification } from '@/lib/notifications';
import { Category, Item, Enquiry, PreferredContact, Language } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2, MessageSquare, Upload, X } from 'lucide-react';
import confetti from 'canvas-confetti';

// Main client form wrapper (wrapped in Suspense to support useSearchParams in Next.js)
function QuotationFormContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const codeParam = searchParams.get('code') || '';
  const categoryParam = searchParams.get('category') || '';

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('whatsapp');
  const [categoryId, setCategoryId] = useState('');
  const [itemCode, setItemCode] = useState(codeParam);
  const [message, setMessage] = useState('');
  const [languagePreference, setLanguagePreference] = useState<Language>('si');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [website, setWebsite] = useState(''); // Honeypot field

  
  // Lookup states
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchedItem, setSearchedItem] = useState<Item | null>(null);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories and initial item code lookup
  useEffect(() => {
    async function loadData() {
      try {
        const catData = await getCategories();
        setCategories(catData.filter(c => c.isActive));
        
        // If category parameter exists in URL, pre-select it
        if (categoryParam) {
          const matchedCat = catData.find(c => c.slug === categoryParam);
          if (matchedCat) setCategoryId(matchedCat.id);
        }

        // If item code exists, pre-fill it and lookup item details
        if (codeParam) {
          const itemData = await getItemByCode(codeParam);
          if (itemData) {
            setSearchedItem(itemData);
            setCategoryId(itemData.categoryId); // Auto-select parent category
          }
        }
      } catch (err) {
        console.error('Error loading quotation page data:', err);
      }
    }
    loadData();
  }, [codeParam, categoryParam]);

  // Lookup item code dynamically when user changes it in input
  useEffect(() => {
    if (!itemCode.trim()) {
      setSearchedItem(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const itemData = await getItemByCode(itemCode.trim());
        if (itemData) {
          setSearchedItem(itemData);
          setCategoryId(itemData.categoryId); // auto-fill category
        } else {
          setSearchedItem(null);
        }
      } catch {
        setSearchedItem(null);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(delayDebounce);
  }, [itemCode]);

  // Validate form details
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerName.trim()) {
      newErrors.customerName = t('Full Name is required', 'නම ඇතුළත් කිරීම අනිවාර්ය වේ');
    }
    
    // Sri Lankan Phone number validation
    // Accepts formats like: 0771234567, 771234567, +94771234567
    const phoneTrimmed = customerPhone.trim();
    const slPhoneRegex = /^(?:\+94|0)?(7[01245678][0-9]{7})$/;
    if (!phoneTrimmed) {
      newErrors.customerPhone = t('Phone Number is required', 'දුරකථන අංකය ඇතුළත් කිරීම අනිවාර්ය වේ');
    } else if (!slPhoneRegex.test(phoneTrimmed)) {
      newErrors.customerPhone = t('Enter a valid Sri Lankan phone number (e.g. 0771234567)', 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න (උදා. 0771234567)');
    }

    if (!categoryId) {
      newErrors.categoryId = t('Select a service category', 'සේවා කාණ්ඩයක් තෝරන්න');
    }

    if (!message.trim()) {
      newErrors.message = t('Describe what you need', 'ඔබට අවශ්‍ය දේ විස්තර කරන්න');
    } else if (message.length > 500) {
      newErrors.message = t('Maximum 500 characters', 'උපරිම අක්ෂර 500 කි');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mock File Upload (returns Unsplash/local simulation URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).slice(0, 3 - attachments.length);
    
    filesArray.forEach((file) => {
      // Simulate file upload by creating local Object URL
      const localUrl = URL.createObjectURL(file);
      setAttachments((prev) => [...prev, localUrl]);
    });

    showSuccessToast(t('Photo attached!', 'පින්තූරය ඇමුණුමට එක් කරන ලදී!'));
  };

  // Remove attached photo
  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showErrorToast(t('Please fix the errors in the form', 'කරුණාකර පෝරමයේ වැරදි නිවැරදි කරන්න'));
      return;
    }

    setLoading(true);

    try {
      // Get count of existing enquiries to generate reference number
      const allEnqs = await getEnquiries();
      const currentYear = new Date().getFullYear();
      const newRefNum = `RIW-ENQ-${currentYear}-${String(allEnqs.length + 1).padStart(4, '0')}`;
      
      const categoryName = categories.find(c => c.id === categoryId)?.nameEn || 'General';

      const newEnquiry: Enquiry = {
        id: Math.random().toString(36).substring(2, 9),
        referenceNumber: newRefNum,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        preferredContact,
        categoryId,
        categoryNameEn: categoryName,
        itemCode: itemCode.trim().toUpperCase(),
        message: message.trim(),
        attachmentUrls: attachments,
        status: 'new',
        language: languagePreference,
        createdAt: new Date().toISOString(),
      };

      // Save enquiry via server-side API (which runs honeypot checks)
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEnquiry,
          website,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit enquiry');
      }

      // Save succeeded — send EmailJS notification client-side
      const selectedCategory = categories.find(c => c.id === categoryId);
      await sendEmailNotification({
        referenceNumber: newRefNum,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        preferredContact,
        categoryNameEn: selectedCategory?.nameEn || categoryId,
        itemCode: itemCode.trim().toUpperCase(),
        message: message.trim(),
        language: languagePreference,
      }).catch((err) => console.error('EmailJS notification failed:', err));

      // If Firestore is NOT configured (mock mode), save locally on client
      const { isFirebaseConfigured } = await import('@/lib/firebase');
      if (!isFirebaseConfigured) {
        await saveEnquiry(newEnquiry);
      }
      
      // Save ref number for success display
      setRefNumber(newRefNum);
      setSubmitted(true);

      // Play success confetti explosion!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

    } catch (err) {
      console.error('Submission error:', err);
      showErrorToast(t('Failed to submit enquiry. Try again.', 'විමසීම ඉදිරිපත් කිරීමට අපොහොසත් විය. නැවත උත්සාහ කරන්න.'));
    } finally {
      setLoading(false);
    }
  };

  // If successfully submitted, render the success page
  if (submitted) {
    const whatsappLink = `https://wa.me/94723169847?text=${encodeURIComponent(
      `Hi, I have just submitted a quotation request. Reference Number: ${refNumber}. Customer: ${customerName}.`
    )}`;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8 animate-fadeIn">
        <div className="flex justify-center">
          <CheckCircle2 size={72} className="text-green-500 animate-bounce" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Thank You, ' + customerName + '!', 'ස්තූතියි, ' + customerName + '!')}
          </h1>
          <p className="text-sm text-steel-light">
            {t(
              'Your request has been logged successfully. We will contact you within 24 hours.',
              'ඔබේ කෝටේෂන් ඉල්ලීම සාර්ථකව ලැබුණි. පැය 24ක් ඇතුළත අප ඔබව සම්බන්ධ කර ගන්නෙමු.'
            )}
          </p>
        </div>

        {/* Reference Code Card */}
        <div className="bg-iron-mid/80 border border-green-500/20 p-6 rounded-lg max-w-sm mx-auto shadow-2xl">
          <span className="block text-[10px] font-bold text-steel-light uppercase tracking-wider mb-2">
            {t('YOUR REFERENCE NUMBER', 'ඔබේ යොමු අංකය')}
          </span>
          <span className="text-xl font-mono font-bold text-spark tracking-wider">
            {refNumber}
          </span>
        </div>

        {/* Pre-filled WhatsApp button per requirement 3b */}
        <div className="max-w-sm mx-auto">
          <a
            href={`https://wa.me/94723169847?text=Hi%2C%20my%20enquiry%20reference%20is%20${refNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="success"
              className="bg-[#25D366] hover:bg-[#128C7E] flex items-center justify-center gap-2 w-full font-bold uppercase tracking-wider text-xs py-3"
            >
              <MessageSquare size={16} />
              <span>{t('Confirm on WhatsApp', 'වට්ස්ඇප් හරහා තහවුරු කරන්න')}</span>
            </Button>
          </a>
        </div>

        {/* WhatsApp redirect button for sending photos & back home */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MessageSquare size={16} />
              <span>{t('Send Photos via WhatsApp', 'වට්ස්ඇප් හරහා පින්තූර එවන්න')}</span>
            </Button>
          </a>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <span>{t('Back to Home', 'මුල් පිටුවට')}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative">
      
      {/* Page header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-spark tracking-widest uppercase font-display">
          {t('GET AN ESTIMATE', 'මිල ගණන් ඇස්තමේන්තුව')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
          {t('Request a Quotation', 'කෝටේෂන් එකක් ලබාගන්න')}
        </h1>
        <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
        <p className="text-sm text-steel-light leading-relaxed">
          {t(
            'Provide details about your custom gate, canopy, painting job, or tuk-tuk repairs below. Our workshop team will formulate an estimate.',
            'ඔබට අවශ්‍ය යකඩ වැඩ, වාහන පින්තාරු කිරීම් හෝ ත්‍රිරෝද රථ අලුත්වැඩියාවන් පිළිබඳ තොරතුරු පහතින් ඇතුළත් කරන්න.'
          )}
        </p>
      </div>

      {/* Main Form container Card */}
      <Card variant="glass" className="p-6 sm:p-10 border-iron-light/40 relative shadow-2xl">
        <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                {t('Full Name *', 'නම (සම්පූර්ණ නම) *')}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('Enter your full name', 'ඔබේ නම ඇතුළත් කරන්න')}
                className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
              />
              {errors.customerName && <p className="text-[11px] text-red-400 font-semibold">{errors.customerName}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                {t('Phone Number *', 'දුරකථන අංකය *')}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 0771234567"
                className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
              />
              {errors.customerPhone && <p className="text-[11px] text-red-400 font-semibold">{errors.customerPhone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                {t('Email Address (Optional)', 'විද්‍යුත් තැපෑල (අත්‍යවශ්‍ය නොවේ)')}
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. prabod@example.com"
                className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase mb-3">
                {t('Preferred Contact Channel', 'සම්බන්ධ කර ගැනීමට කැමති ක්‍රමය')}
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-smoke cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="whatsapp"
                    checked={preferredContact === 'whatsapp'}
                    onChange={() => setPreferredContact('whatsapp')}
                    className="accent-spark"
                  />
                  <span>WhatsApp</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-smoke cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="call"
                    checked={preferredContact === 'call'}
                    onChange={() => setPreferredContact('call')}
                    className="accent-spark"
                  />
                  <span>{t('Phone Call', 'ඇමතුම්')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-smoke cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={preferredContact === 'email'}
                    onChange={() => setPreferredContact('email')}
                    className="accent-spark"
                  />
                  <span>Email</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                {t('Service Category *', 'සේවා කාණ්ඩය *')}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
              >
                <option value="">-- {t('Select Service Category', 'සේවාව තෝරන්න')} --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {t(cat.nameEn, cat.nameSi)}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-[11px] text-red-400 font-semibold">{errors.categoryId}</p>}
            </div>

            {/* Item Code (Optional) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                {t('Item Code (Optional)', 'නිෂ්පාදන කේතය (අත්‍යවශ්‍ය නොවේ)')}
              </label>
              <input
                type="text"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="e.g. RIW-IF-0001"
                className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20 font-mono uppercase"
              />
              {/* Show item code verification */}
              {searchedItem && (
                <p className="text-[10px] text-green-400 font-semibold flex items-center gap-1.5 font-mono">
                  <CheckCircle2 size={12} />
                  <span>{t(`Matched: ${searchedItem.nameEn}`, `තහවුරු විය: ${searchedItem.nameSi}`)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Message textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
                {t('Details & Message *', 'විස්තර සහ පණිවිඩය *')}
              </label>
              <span className="text-[10px] text-steel-light font-mono">{message.length}/500</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder={t(
                "Describe size, colors, delivery location or custom requirements...",
                "ගේට්ටුවේ හෝ ව්‍යුහයේ ප්‍රමාණයන්, නිමවුම් මෝස්තර, බෙදාහැරීමේ ලිපිනය හෝ විශේෂ අවශ්‍යතා ඇතුළත් කරන්න..."
              )}
              className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
            />
            {errors.message && <p className="text-[11px] text-red-400 font-semibold">{errors.message}</p>}
          </div>

          {/* Photo uploads (Cloudinary Simulation) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold tracking-wider text-smoke uppercase">
              {t('Attach Photos (Optional, Max 3)', 'ඡායාරූප අමුණන්න (උපරිම 3)')}
            </label>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Upload Trigger */}
              {attachments.length < 3 && (
                <label className="w-20 h-20 border-2 border-dashed border-iron-light hover:border-spark rounded-md flex flex-col items-center justify-center cursor-pointer text-steel-light hover:text-spark transition-all">
                  <Upload size={20} />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">
                    {t('ADD', 'එක් කරන්න')}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}

              {/* Thumbnails of attached images */}
              {attachments.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-md overflow-hidden bg-iron border border-iron-light"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`attachment-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(idx)}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-red-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-steel-light leading-relaxed">
              {t('Attach photos of your gate location, jeep frame, or structural diagram. Helpful for pricing.', 'ඔබේ වැඩපල අවශ්‍යතාවයේ, ගේට්ටුව සවිකරන ස්ථානයේ හෝ සෆාරි ජීප් රථයේ පින්තූර අමුණන්න. එය නිවැරදි මිල ඇස්තමේන්තුවක් ලබාදීමට උපකාරී වේ.')}
            </p>
          </div>

          {/* Language preference selection */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold tracking-wider text-smoke uppercase mb-2">
              {t('Preferred Communication Language', 'සම්බන්ධතා භාෂාව')}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-smoke cursor-pointer">
                <input
                  type="radio"
                  name="languagePreference"
                  value="si"
                  checked={languagePreference === 'si'}
                  onChange={() => setLanguagePreference('si')}
                  className="accent-spark"
                />
                <span>සිංහල (Sinhala)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-smoke cursor-pointer">
                <input
                  type="radio"
                  name="languagePreference"
                  value="en"
                  checked={languagePreference === 'en'}
                  onChange={() => setLanguagePreference('en')}
                  className="accent-spark"
                />
                <span>English</span>
              </label>
            </div>
          </div>

          {/* Honeypot field (hidden with CSS, not type="hidden") */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="spark"
              size="lg"
              loading={loading}
              className="w-full font-bold uppercase tracking-widest text-xs"
            >
              {t('Submit Quotation Request', 'කෝටේෂන් ඉල්ලීම ඉදිරිපත් කරන්න')}
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}

// Re-wrap form content inside Suspense boundary (NextJS requirement for useSearchParams)
export default function QuotationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-iron flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-spark"></div>
      </div>
    }>
      <QuotationFormContent />
    </Suspense>
  );
}
