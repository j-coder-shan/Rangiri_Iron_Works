// src/app/admin/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '@/lib/db';
import { SiteSettings } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Save, Phone, MessageSquare, Mail, MapPin, Clock, Facebook, Youtube, Sparkles, Layout } from 'lucide-react';

export default function AdminSettingsPage() {
  const { success: showSuccess, error: showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressSi, setAddressSi] = useState('');
  const [workingHoursEn, setWorkingHoursEn] = useState('');
  const [workingHoursSi, setWorkingHoursSi] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [heroTitleEn, setHeroTitleEn] = useState('');
  const [heroTitleSi, setHeroTitleSi] = useState('');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState('');
  const [heroSubtitleSi, setHeroSubtitleSi] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const s = await getSettings();
        setPhone(s.phone || '');
        setWhatsapp(s.whatsapp || '');
        setEmail(s.email || '');
        setAddressEn(s.addressEn || '');
        setAddressSi(s.addressSi || '');
        setWorkingHoursEn(s.workingHoursEn || '');
        setWorkingHoursSi(s.workingHoursSi || '');
        setFacebookUrl(s.facebookUrl || '');
        setYoutubeUrl(s.youtubeUrl || '');
        setHeroTitleEn(s.heroTitleEn || '');
        setHeroTitleSi(s.heroTitleSi || '');
        setHeroSubtitleEn(s.heroSubtitleEn || '');
        setHeroSubtitleSi(s.heroSubtitleSi || '');
      } catch {
        showError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updatedSettings: SiteSettings = {
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      addressEn: addressEn.trim(),
      addressSi: addressSi.trim(),
      workingHoursEn: workingHoursEn.trim(),
      workingHoursSi: workingHoursSi.trim(),
      facebookUrl: facebookUrl.trim(),
      youtubeUrl: youtubeUrl.trim(),
      heroTitleEn: heroTitleEn.trim(),
      heroTitleSi: heroTitleSi.trim(),
      heroSubtitleEn: heroSubtitleEn.trim(),
      heroSubtitleSi: heroSubtitleSi.trim(),
    };

    try {
      await saveSettings(updatedSettings);
      showSuccess('Site settings saved successfully!');
    } catch {
      showError('Failed to save settings parameters');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
      
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
          Global Configurations & Settings
        </span>
        <p className="text-xs text-gray-500">
          Control contact information, working schedules, social links, and public hero copy that updates in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Col 1 - Contact details & address */}
          <div className="space-y-8">
            
            {/* Card 1: Core Contact */}
            <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-5">
              
              <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
                <Phone size={16} className="text-[#E8500A]" />
                <h3 className="font-display font-bold uppercase tracking-wider text-xs">
                  Primary Contact Channels
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Telephone Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0771234567"
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">WhatsApp Number (Sri Lanka code)</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 0771234567"
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-mono"
                  />
                  <span className="text-[10px] text-gray-400 block leading-tight">
                    Required to direct pre-filled chat messages to your mobile.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. info@rangiriworks.lk"
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-mono"
                  />
                </div>
              </div>

            </Card>

            {/* Card 2: Address & Schedule */}
            <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-5">
              
              <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
                <MapPin size={16} className="text-[#E8500A]" />
                <h3 className="font-display font-bold uppercase tracking-wider text-xs">
                  Physical Address & Operating Hours
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase">Address (English)</label>
                    <input
                      type="text"
                      value={addressEn}
                      onChange={(e) => setAddressEn(e.target.value)}
                      placeholder="Dambulla, Sri Lanka"
                      className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase font-sinhala">Address (Sinhala)</label>
                    <input
                      type="text"
                      value={addressSi}
                      onChange={(e) => setAddressSi(e.target.value)}
                      placeholder="දඹුල්ල, ශ්‍රී ලංකාව"
                      className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase">Working Hours (English)</label>
                    <input
                      type="text"
                      value={workingHoursEn}
                      onChange={(e) => setWorkingHoursEn(e.target.value)}
                      placeholder="Mon-Sat: 7:30am - 6:00pm"
                      className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase font-sinhala">Working Hours (Sinhala)</label>
                    <input
                      type="text"
                      value={workingHoursSi}
                      onChange={(e) => setWorkingHoursSi(e.target.value)}
                      placeholder="සඳුදා-සෙනසුරාදා: පෙ.ව. 7:30 - ප.ව. 6:00"
                      className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
                    />
                  </div>
                </div>
              </div>

            </Card>

            {/* Card 3: Social Networks */}
            <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-5">
              
              <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
                <Facebook size={16} className="text-[#E8500A]" />
                <h3 className="font-display font-bold uppercase tracking-wider text-xs">
                  Social Network Profiles
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">Facebook Page Link</label>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">YouTube Channel Link</label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-mono"
                  />
                </div>
              </div>

            </Card>

          </div>

          {/* Col 2 - Public Page customizations */}
          <div className="space-y-8">
            
            {/* Card 4: Hero Customizations */}
            <Card variant="light" className="p-6 sm:p-8 border border-gray-100 shadow-md space-y-5 h-full">
              
              <div className="border-b border-gray-100 pb-3 flex items-center gap-2 text-gray-900">
                <Layout size={16} className="text-[#E8500A]" />
                <h3 className="font-display font-bold uppercase tracking-wider text-xs">
                  Home Screen Hero Banner
                </h3>
              </div>

              <div className="space-y-5">
                
                {/* Hero title EN */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Main Hero Title (English)
                  </label>
                  <input
                    type="text"
                    value={heroTitleEn}
                    onChange={(e) => setHeroTitleEn(e.target.value)}
                    placeholder="Sri Lanka's Trusted Iron & Vehicle Workshop"
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-semibold text-xs"
                  />
                </div>

                {/* Hero title SI */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase font-sinhala">
                    Main Hero Title (Sinhala)
                  </label>
                  <input
                    type="text"
                    value={heroTitleSi}
                    onChange={(e) => setHeroTitleSi(e.target.value)}
                    placeholder="ශ්‍රී ලංකාවේ විශ්වාසදායකම යකඩ සහ වාහන වැඩපල"
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2.5 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala text-xs font-semibold"
                  />
                </div>

                {/* Hero Subtitle EN */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase">
                    Hero Subtitle (English)
                  </label>
                  <textarea
                    value={heroSubtitleEn}
                    onChange={(e) => setHeroSubtitleEn(e.target.value)}
                    rows={3}
                    placeholder="Crafted in Steel. Built to Last."
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] leading-relaxed text-xs"
                  />
                </div>

                {/* Hero Subtitle SI */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase font-sinhala">
                    Hero Subtitle (Sinhala)
                  </label>
                  <textarea
                    value={heroSubtitleSi}
                    onChange={(e) => setHeroSubtitleSi(e.target.value)}
                    rows={3}
                    placeholder="වානේවලින් නිර්මිත. කල් පවතින නිෂ්පාදන."
                    className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala leading-relaxed text-xs"
                  />
                </div>

              </div>

            </Card>

          </div>

        </div>

        {/* Global Save Button */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            variant="spark"
            loading={saving}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-3 px-8"
          >
            <Save size={14} />
            <span>Save All Configurations</span>
          </Button>
        </div>

      </form>

    </div>
  );
}
