// src/app/admin/testimonials/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '@/lib/db';
import { Testimonial } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, Edit, Trash2, Star, Search } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const { success: showSuccess, error: showError } = useToast();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);

  // Form States
  const [nameEn, setNameEn] = useState('');
  const [nameSi, setNameSi] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationSi, setLocationSi] = useState('');
  const [serviceEn, setServiceEn] = useState('');
  const [serviceSi, setServiceSi] = useState('');
  const [reviewEn, setReviewEn] = useState('');
  const [reviewSi, setReviewSi] = useState('');
  const [rating, setRating] = useState(5);
  const [avatarInitials, setAvatarInitials] = useState('');
  const [isActive, setIsActive] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch {
      showError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setCurrentTestimonial(null);
    setNameEn('');
    setNameSi('');
    setLocationEn('');
    setLocationSi('');
    setServiceEn('');
    setServiceSi('');
    setReviewEn('');
    setReviewSi('');
    setRating(5);
    setAvatarInitials('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setCurrentTestimonial(t);
    setNameEn(t.nameEn);
    setNameSi(t.nameSi);
    setLocationEn(t.locationEn);
    setLocationSi(t.locationSi);
    setServiceEn(t.serviceEn);
    setServiceSi(t.serviceSi);
    setReviewEn(t.reviewEn);
    setReviewSi(t.reviewSi);
    setRating(t.rating);
    setAvatarInitials(t.avatarInitials);
    setIsActive(t.isActive);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (t: Testimonial) => {
    try {
      const updated = { ...t, isActive: !t.isActive };
      await saveTestimonial(updated);
      showSuccess('Testimonial status updated');
      loadData();
    } catch {
      showError('Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${name}"?`)) {
      return;
    }
    try {
      await deleteTestimonial(id);
      showSuccess('Testimonial deleted successfully');
      loadData();
    } catch {
      showError('Failed to delete review');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameSi.trim() || !reviewEn.trim() || !reviewSi.trim()) {
      showError('Names and Review texts are required for both languages');
      return;
    }

    // Auto generate initials if blank
    let initials = avatarInitials.trim().toUpperCase();
    if (!initials) {
      initials = nameEn
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'RI';
    }

    const newTestimonial: Testimonial = {
      id: currentTestimonial?.id || `testi-${Math.random().toString(36).substring(2, 9)}`,
      nameEn: nameEn.trim(),
      nameSi: nameSi.trim(),
      locationEn: locationEn.trim() || 'Client',
      locationSi: locationSi.trim() || 'සේවාලාභියා',
      serviceEn: serviceEn.trim() || 'Iron Works',
      serviceSi: serviceSi.trim() || 'යකඩ වැඩ',
      reviewEn: reviewEn.trim(),
      reviewSi: reviewSi.trim(),
      rating: Number(rating) || 5,
      avatarInitials: initials,
      isActive,
      createdAt: currentTestimonial?.createdAt || new Date().toISOString(),
    };

    try {
      await saveTestimonial(newTestimonial);
      showSuccess(currentTestimonial ? 'Review updated successfully' : 'New review added successfully');
      setIsModalOpen(false);
      loadData();
    } catch {
      showError('Failed to save review');
    }
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameSi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reviewEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn text-xs sm:text-sm">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Client Testimonials & Feedback
          </span>
          <p className="text-xs text-gray-500">
            Publish reviews on the homepage. Edit clients, ratings, locations, and translated testimonial quotes.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          variant="spark"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5"
        >
          <PlusCircle size={16} />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {/* Filter and Search */}
      <Card variant="light" className="p-4 border border-gray-100 flex items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or review content..."
            className="w-full bg-gray-50 text-gray-800 pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:border-[#E8500A] text-xs"
          />
        </div>
      </Card>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTestimonials.map((t) => (
          <Card 
            key={t.id} 
            variant="light" 
            className={`border border-gray-100 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-gray-200 transition-all ${
              !t.isActive ? 'opacity-70 bg-gray-50/50' : 'bg-white'
            }`}
          >
            <div className="space-y-3">
              {/* Header profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8500A] to-amber-500 text-white font-display font-bold flex items-center justify-center text-sm">
                  {t.avatarInitials}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {t.nameEn} <span className="font-sinhala text-[11px] font-normal text-gray-500">({t.nameSi})</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    {t.serviceEn} • {t.locationEn}
                  </span>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star 
                    key={idx} 
                    size={12} 
                    className={idx < t.rating ? 'fill-current' : 'text-gray-200'} 
                  />
                ))}
              </div>

              {/* Reviews preview */}
              <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
                <p className="italic">"{t.reviewEn}"</p>
                <p className="italic font-sinhala text-gray-500 border-t border-gray-100 pt-2">"{t.reviewSi}"</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <button
                onClick={() => handleToggleActive(t)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  t.isActive 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}
              >
                {t.isActive ? 'Active' : 'Hidden'}
              </button>
              
              <div className="space-x-1">
                <button
                  onClick={() => openEditModal(t)}
                  className="text-gray-500 hover:text-blue-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                  title="Edit Feedback"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.nameEn)}
                  className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-gray-100 rounded-md transition-all inline-block"
                  title="Delete Review"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

          </Card>
        ))}
      </div>

      {/* Modal dialog for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTestimonial ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
        className="!bg-white !border-gray-200 !text-gray-900"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-xs sm:text-sm text-gray-900">
          
          {/* Client Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Customer Name (English) *</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Ruwan Silva"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Customer Name (Sinhala) *</label>
              <input
                type="text"
                value={nameSi}
                onChange={(e) => setNameSi(e.target.value)}
                placeholder="e.g. රුවන් සිල්වා"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
              />
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Location (English)</label>
              <input
                type="text"
                value={locationEn}
                onChange={(e) => setLocationEn(e.target.value)}
                placeholder="e.g. Dambulla"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Location (Sinhala)</label>
              <input
                type="text"
                value={locationSi}
                onChange={(e) => setLocationSi(e.target.value)}
                placeholder="e.g. දඹුල්ල"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
              />
            </div>
          </div>

          {/* Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Service Provided (English)</label>
              <input
                type="text"
                value={serviceEn}
                onChange={(e) => setServiceEn(e.target.value)}
                placeholder="e.g. Canopy Installation"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Service Provided (Sinhala)</label>
              <input
                type="text"
                value={serviceSi}
                onChange={(e) => setServiceSi(e.target.value)}
                placeholder="e.g. කැනොපි සවි කිරීම්"
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala"
              />
            </div>
          </div>

          {/* Rating & Avatar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Star Rating *</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A]"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Very Good)</option>
                <option value="3">3 Stars (Good)</option>
                <option value="2">2 Stars (Average)</option>
                <option value="1">1 Star (Poor)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-600 uppercase">Avatar Initials (Optional)</label>
              <input
                type="text"
                value={avatarInitials}
                onChange={(e) => setAvatarInitials(e.target.value)}
                placeholder="e.g. RS"
                maxLength={2}
                className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-mono uppercase"
              />
            </div>
          </div>

          {/* Review English */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-600 uppercase">Review Quote (English) *</label>
            <textarea
              value={reviewEn}
              onChange={(e) => setReviewEn(e.target.value)}
              rows={3}
              placeholder="Excellent welding service. Highly recommended..."
              className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] leading-relaxed"
            />
          </div>

          {/* Review Sinhala */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-600 uppercase">Review Quote (Sinhala) *</label>
            <textarea
              value={reviewSi}
              onChange={(e) => setReviewSi(e.target.value)}
              rows={3}
              placeholder="විශිෂ්ට වෙල්ඩින් සේවාවක්. බෙහෙවින් නිර්දේශ කරමි..."
              className="w-full bg-gray-50 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:border-[#E8500A] font-sinhala leading-relaxed"
            />
          </div>

          {/* Settings */}
          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 uppercase">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-[#E8500A]"
              />
              <span>Review is Published (Visible on homepage)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-100 py-2 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="spark"
              className="py-2 px-4"
            >
              Save Feedback
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
}
