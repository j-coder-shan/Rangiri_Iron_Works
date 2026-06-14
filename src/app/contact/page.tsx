// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { saveEnquiry, getEnquiries } from '@/lib/db';
import { Enquiry } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const { t } = useLanguage();
  const { error: showErrorToast } = useToast();

  // Contact Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3533816656717!2d80.64165561081541!3d7.858022792131976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae345db59c11bd3%3A0xe6ab1e48ebdf7522!2sRangiri%20Iron%20Works%20(රංගිරි%20යකඩ%20වැඩ)!5e0!3m2!1sen!2slk!4v1717657000000!5m2!1sen!2slk";
  const whatsappUrl = `https://wa.me/94723169847?text=Hello%20Rangiri%20Iron%20Works%2C%20I%20have%20a%20question`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = t('Name is required', 'නම ඇතුළත් කිරීම අනිවාර්ය වේ');
    }
    
    const slPhoneRegex = /^(?:\+94|0)?(7[01245678][0-9]{7})$/;
    if (!phone.trim()) {
      newErrors.phone = t('Phone number is required', 'දුරකථන අංකය ඇතුළත් කිරීම අනිවාර්ය වේ');
    } else if (!slPhoneRegex.test(phone.trim())) {
      newErrors.phone = t('Enter a valid Sri Lankan phone number', 'වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න');
    }

    if (!message.trim()) {
      newErrors.message = t('Message is required', 'පණිවිඩය ඇතුළත් කිරීම අනිවාර්ය වේ');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const allEnqs = await getEnquiries();
      const currentYear = new Date().getFullYear();
      const newRefNum = `RIW-ENQ-${currentYear}-${String(allEnqs.length + 1).padStart(4, '0')}`;

      const newContactEnquiry: Enquiry = {
        id: Math.random().toString(36).substring(2, 9),
        referenceNumber: newRefNum,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: '', // blank
        preferredContact: 'whatsapp',
        categoryId: 'general-contact',
        categoryNameEn: 'General Contact',
        itemCode: '',
        message: message.trim(),
        attachmentUrls: [],
        status: 'new',
        language: 'si',
        createdAt: new Date().toISOString(),
      };

      await saveEnquiry(newContactEnquiry);
      
      setRefNumber(newRefNum);
      setSubmitted(true);
      
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      setName('');
      setPhone('');
      setMessage('');

    } catch (err) {
      console.error(err);
      showErrorToast(t('Failed to send message', 'පණිවිඩය යැවීමට අපොහොසත් විය'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-iron min-h-screen py-12 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-spark/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-spark tracking-widest uppercase font-display">
            {t('GET IN TOUCH', 'අප හා සම්බන්ධ වන්න')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-smoke uppercase tracking-tight">
            {t('Contact Us', 'අමතන්න')}
          </h1>
          <div className="w-16 h-1 bg-spark mx-auto rounded-full" />
          <p className="text-sm text-steel-light">
            {t('Have questions about custom gates, safari jeep canopies, or vehicle paint services? Message us below.', 'අභිරුචි යකඩ ගේට්ටු, වාහන පින්තාරු කිරීම් හෝ සෆාරි ජීප් රථ කැනොපි පිළිබඳව ප්‍රශ්න තිබේද? අප වෙත පණිවිඩයක් එවන්න.')}
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <Card variant="glass" className="p-8 border-green-500/20 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
                <CheckCircle2 size={56} className="text-green-500" />
                <h3 className="text-2xl font-display font-bold text-smoke uppercase">
                  {t('Message Sent!', 'පණිවිඩය ලැබුණි!')}
                </h3>
                <p className="text-xs text-steel-light max-w-md">
                  {t('Thank you. We have received your message. Reference code: ', 'ස්තූතියි. අපට ඔබේ පණිවිඩය ලැබුණි. යොමු අංකය: ')}
                  <span className="font-mono text-spark font-bold">{refNumber}</span>
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
                    {t('Send Another Message', 'තව පණිවිඩයක් එවන්න')}
                  </Button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="success" size="sm" className="bg-[#25D366] hover:bg-[#128C7E] flex items-center gap-1.5 border-none">
                      <MessageSquare size={14} />
                      <span>WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </Card>
            ) : (
              <Card variant="glass" className="p-6 sm:p-8 border-iron-light/35 relative">
                <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
                
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <h3 className="text-lg font-display font-bold text-smoke uppercase tracking-wider">
                    {t('Send a Message', 'පණිවිඩයක් එවන්න')}
                  </h3>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-smoke uppercase tracking-wider">{t('Your Name *', 'ඔබේ නම *')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('Enter your name', 'නම ඇතුළත් කරන්න')}
                      className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
                    />
                    {errors.name && <p className="text-[10px] text-red-400 font-semibold">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-smoke uppercase tracking-wider">{t('Phone Number *', 'දුරකථන අංකය *')}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0771234567"
                      className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
                    />
                    {errors.phone && <p className="text-[10px] text-red-400 font-semibold">{errors.phone}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-smoke uppercase tracking-wider">{t('Message *', 'පණිවිඩය *')}</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder={t('Write your question or details...', 'ඔබට විමසීමට ඇති ප්‍රශ්නය හෝ විස්තර මෙහි ලියන්න...')}
                      className="w-full bg-iron text-smoke text-sm px-4 py-3 rounded-md border border-iron-light focus:border-spark focus:ring-1 focus:ring-spark/20"
                    />
                    {errors.message && <p className="text-[10px] text-red-400 font-semibold">{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="spark"
                    loading={loading}
                    className="w-full font-bold uppercase tracking-widest text-xs py-3 flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>{t('Send Message', 'පණිවිඩය යවන්න')}</span>
                  </Button>
                </form>
              </Card>
            )}
          </div>

          {/* Column 2: Info Cards & Maps (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card */}
            <Card variant="glass" className="p-6 border-iron-light/35 space-y-5">
              <h3 className="text-lg font-display font-bold text-smoke uppercase tracking-wider">
                {t('Workshop Contacts', 'සබඳතා තොරතුරු')}
              </h3>

              <div className="space-y-4">
                {/* Phone call details */}
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-spark/10 border border-spark/20 rounded-md text-spark mt-0.5 flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="block text-steel-light mb-0.5">{t('Call Hotline', 'දුරකථන අංකය')}</span>
                    <a href="tel:0723169847" className="text-sm font-bold text-smoke hover:text-spark transition-colors block">
                      0723169847
                    </a>
                  </div>
                </div>

                {/* WhatsApp Chat details */}
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-md text-[#25D366] mt-0.5 flex-shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="block text-steel-light mb-0.5">{t('Chat on WhatsApp', 'වට්ස්ඇප් සේවාව')}</span>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-smoke hover:text-green-400 transition-colors block">
                      0723169847
                    </a>
                  </div>
                </div>

                {/* Email address */}
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-spark/10 border border-spark/20 rounded-md text-spark mt-0.5 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="block text-steel-light mb-0.5">{t('Email Address', 'විද්‍යුත් තැපෑල')}</span>
                    <a href="mailto:prabod.jay02@gmail.com" className="text-sm font-bold text-smoke hover:text-spark transition-colors block">
                      prabod.jay02@gmail.com
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-spark/10 border border-spark/20 rounded-md text-spark mt-0.5 flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="block text-steel-light mb-0.5">{t('Working Hours', 'වැඩ කරන වේලාවන්')}</span>
                    <span className="text-sm font-bold text-smoke block">
                      {t('Mon–Sat: 7:30 AM – 6:00 PM', 'සඳුදා–සෙනසුරාදා: පෙ.ව. 7:30 – ප.ව. 6:00')}
                    </span>
                  </div>
                </div>

                {/* Workshop address */}
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-spark/10 border border-spark/20 rounded-md text-spark mt-0.5 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="text-xs">
                    <span className="block text-steel-light mb-0.5">{t('Workshop Location', 'වැඩපල ලිපිනය')}</span>
                    <span className="text-xs font-semibold text-smoke leading-relaxed block">
                      {t('Kandy Road, Dambulla, Sri Lanka', 'මහනුවර පාර, දඹුල්ල, ශ්‍රී ලංකාව')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Google Map iframe */}
            <div className="rounded-lg overflow-hidden border border-iron-light/40 h-64 shadow-xl">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Workshop Map Location"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
