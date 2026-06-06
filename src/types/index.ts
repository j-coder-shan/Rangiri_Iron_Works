// src/types/index.ts

export type Language = 'en' | 'si';

export interface LocalizedString {
  en: string;
  si: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameSi: string;
  slug: string;
  descriptionEn: string;
  descriptionSi: string;
  icon: string;             // Lucide icon name
  coverImage: string;       // Cloudinary URL or Unsplash URL
  order: number;
  isActive: boolean;
  createdAt: string;        // Stored as ISO string in Mock db
}

export interface Item {
  id: string;
  code: string;             // "RIW-IF-0001"
  categoryId: string;
  categorySlug: string;
  nameEn: string;
  nameSi: string;
  descriptionEn: string;
  descriptionSi: string;
  features: string[];
  featuresSi: string[];
  images: string[];         // URLs, first is thumbnail
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;        // ISO string
}

export type EnquiryStatus = 'new' | 'seen' | 'replied' | 'closed';
export type PreferredContact = 'whatsapp' | 'call' | 'email';

export interface Enquiry {
  id: string;
  referenceNumber: string;  // "RIW-ENQ-2026-0001"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredContact: PreferredContact;
  categoryId: string;
  categoryNameEn: string;
  itemCode: string;         // optional — blank if not about specific item
  message: string;
  attachmentUrls: string[];
  status: EnquiryStatus;
  language: Language;
  createdAt: string;        // ISO string
  ipAddress?: string;
  adminNotes?: string;      // Internal notes added by admin
}

export interface Testimonial {
  id: string;
  nameEn: string;
  nameSi: string;
  locationEn: string;
  locationSi: string;
  serviceEn: string;
  serviceSi: string;
  reviewEn: string;
  reviewSi: string;
  rating: number;           // 1-5
  avatarInitials: string;
  isActive: boolean;
  createdAt: string;        // ISO string
}

export interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleSi: string;
  excerptEn: string;
  excerptSi: string;
  contentEn: string;        // Markdown content
  contentSi: string;        // Markdown content
  coverImage: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;      // ISO string
  createdAt: string;        // ISO string
}

export interface GalleryPhoto {
  id: string;
  categoryId: string;
  captionEn: string;
  captionSi: string;
  imageUrl: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;        // ISO string
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  addressEn: string;
  addressSi: string;
  workingHoursEn: string;
  workingHoursSi: string;
  facebookUrl: string;
  youtubeUrl: string;
  heroTitleEn: string;
  heroTitleSi: string;
  heroSubtitleEn: string;
  heroSubtitleSi: string;
}
