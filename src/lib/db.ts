// src/lib/db.ts
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, addDoc, 
  updateDoc, deleteDoc, query, where, orderBy, limit 
} from 'firebase/firestore';
import { Category, Item, Enquiry, Testimonial, BlogPost, SiteSettings, GalleryPhoto } from '@/types';
import { seedCategories, generateSeedItems, seedTestimonials, seedBlogPosts } from './seedData';


// Helper to check if window is defined (client-side)
const isClient = typeof window !== 'undefined';

// LocalStorage Keys
const KEYS = {
  CATEGORIES: 'riw_categories',
  ITEMS: 'riw_items',
  ENQUIRIES: 'riw_enquiries',
  TESTIMONIALS: 'riw_testimonials',
  BLOG_POSTS: 'riw_blog_posts',
  SETTINGS: 'riw_settings',
  GALLERY: 'riw_gallery',
};

// DEFAULT STATIC DATA (used for initial seed or SSR fallback)
const defaultSettings: SiteSettings = {
  phone: '0723169847',
  whatsapp: '0723169847',
  email: 'prabod.jay02@gmail.com',
  addressEn: 'Dambulla, Sri Lanka',
  addressSi: 'දඹුල්ල, ශ්‍රී ලංකාව',
  workingHoursEn: 'Mon–Sat: 7:30am – 6:00pm',
  workingHoursSi: 'සඳුදා–සෙනසුරාදා: පෙ.ව. 7:30 – ප.ව. 6:00',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  heroTitleEn: "Sri Lanka's Trusted Iron & Vehicle Workshop",
  heroTitleSi: 'ශ්‍රී ලංකාවේ විශ්වාසදායකම යකඩ සහ වාහන වැඩපල',
  heroSubtitleEn: 'Crafted in Steel. Built to Last.',
  heroSubtitleSi: 'වානේවලින් නිර්මිත. කල් පවතින නිෂ්පාදන.',
};

// Core Storage Helpers (Local Mode)
function getLocal<T>(key: string, fallback: T[] = []): T[] {
  if (!isClient) return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setLocal<T>(key: string, data: T[]): void {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ==========================================
// 1. CATEGORIES METHODS
// ==========================================
export async function getCategories(): Promise<Category[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  }
  if (!isClient) return seedCategories;
  
  let localCategories = localStorage.getItem(KEYS.CATEGORIES);
  if (!localCategories) {
    // Seed on first load!
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(seedCategories));
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(generateSeedItems()));
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(seedTestimonials));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(seedBlogPosts));
    localCategories = JSON.stringify(seedCategories);
  }
  return JSON.parse(localCategories).sort((a: any, b: any) => a.order - b.order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'categories'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Category;
  }
  const all = getLocal<Category>(KEYS.CATEGORIES);
  return all.find(c => c.slug === slug) || null;
}

export async function saveCategory(category: Category): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'categories', category.id), category);
    return;
  }
  const all = getLocal<Category>(KEYS.CATEGORIES);
  const idx = all.findIndex(c => c.id === category.id);
  if (idx > -1) all[idx] = category;
  else all.push(category);
  setLocal(KEYS.CATEGORIES, all);
}

export async function deleteCategory(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'categories', id));
    return;
  }
  const all = getLocal<Category>(KEYS.CATEGORIES);
  setLocal(KEYS.CATEGORIES, all.filter(c => c.id !== id));
}

// ==========================================
// 2. ITEMS METHODS
// ==========================================
export async function getItems(): Promise<Item[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'items'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
  }
  if (!isClient) return generateSeedItems();
  await getCategories(); // Ensure database is seeded
  return getLocal<Item>(KEYS.ITEMS).sort((a, b) => a.order - b.order);
}

export async function getItemsByCategory(categorySlug: string): Promise<Item[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'items'), where('categorySlug', '==', categorySlug), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
  }
  const all = getLocal<Item>(KEYS.ITEMS);
  return all.filter(item => item.categorySlug === categorySlug && item.isActive).sort((a, b) => a.order - b.order);
}

export async function getItemByCode(code: string): Promise<Item | null> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'items'), where('code', '==', code), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Item;
  }
  const all = getLocal<Item>(KEYS.ITEMS);
  return all.find(item => item.code.toUpperCase() === code.toUpperCase()) || null;
}

export async function getItemById(id: string): Promise<Item | null> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'items', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Item;
  }
  const all = getLocal<Item>(KEYS.ITEMS);
  return all.find(item => item.id === id) || null;
}

export async function saveItem(item: Item): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'items', item.id), item);
    return;
  }
  const all = getLocal<Item>(KEYS.ITEMS);
  const idx = all.findIndex(i => i.id === item.id);
  if (idx > -1) all[idx] = item;
  else all.push(item);
  setLocal(KEYS.ITEMS, all);
}

export async function deleteItem(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'items', id));
    return;
  }
  const all = getLocal<Item>(KEYS.ITEMS);
  setLocal(KEYS.ITEMS, all.filter(i => i.id !== id));
}

// ==========================================
// 3. ENQUIRIES METHODS
// ==========================================
export async function getEnquiries(): Promise<Enquiry[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      } as Enquiry;
    });
  }
  return getLocal<Enquiry>(KEYS.ENQUIRIES).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'enquiries', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
    } as Enquiry;
  }
  const all = getLocal<Enquiry>(KEYS.ENQUIRIES);
  return all.find(e => e.id === id) || null;
}

export async function saveEnquiry(enquiry: Enquiry): Promise<void> {
  if (isFirebaseConfigured && db) {
    // If saving via firestore, convert date to Firestore Timestamp object or store as string
    const docRef = doc(db, 'enquiries', enquiry.id);
    await setDoc(docRef, {
      ...enquiry,
      createdAt: new Date(enquiry.createdAt) // Firestore handles native Date objects
    });
    return;
  }
  const all = getLocal<Enquiry>(KEYS.ENQUIRIES);
  const idx = all.findIndex(e => e.id === enquiry.id);
  if (idx > -1) all[idx] = enquiry;
  else all.push(enquiry);
  setLocal(KEYS.ENQUIRIES, all);
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status'], notes?: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'enquiries', id);
    await updateDoc(docRef, { status, ...(notes !== undefined ? { adminNotes: notes } : {}) });
    return;
  }
  const all = getLocal<Enquiry>(KEYS.ENQUIRIES);
  const idx = all.findIndex(e => e.id === id);
  if (idx > -1) {
    all[idx].status = status;
    if (notes !== undefined) all[idx].adminNotes = notes;
    setLocal(KEYS.ENQUIRIES, all);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'enquiries', id));
    return;
  }
  const all = getLocal<Enquiry>(KEYS.ENQUIRIES);
  setLocal(KEYS.ENQUIRIES, all.filter(e => e.id !== id));
}

// ==========================================
// 4. TESTIMONIALS METHODS
// ==========================================
export async function getTestimonials(): Promise<Testimonial[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
  }
  if (!isClient) return seedTestimonials;
  await getCategories(); // Ensure database is seeded
  return getLocal<Testimonial>(KEYS.TESTIMONIALS).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
    return;
  }
  const all = getLocal<Testimonial>(KEYS.TESTIMONIALS);
  const idx = all.findIndex(t => t.id === testimonial.id);
  if (idx > -1) all[idx] = testimonial;
  else all.push(testimonial);
  setLocal(KEYS.TESTIMONIALS, all);
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'testimonials', id));
    return;
  }
  const all = getLocal<Testimonial>(KEYS.TESTIMONIALS);
  setLocal(KEYS.TESTIMONIALS, all.filter(t => t.id !== id));
}

// ==========================================
// 5. BLOG POSTS METHODS
// ==========================================
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  }
  return getLocal<BlogPost>(KEYS.BLOG_POSTS).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
  }
  const all = getLocal<BlogPost>(KEYS.BLOG_POSTS);
  return all.find(p => p.slug === slug) || null;
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'blogPosts', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as BlogPost;
  }
  const all = getLocal<BlogPost>(KEYS.BLOG_POSTS);
  return all.find(p => p.id === id) || null;
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'blogPosts', post.id), post);
    return;
  }
  const all = getLocal<BlogPost>(KEYS.BLOG_POSTS);
  const idx = all.findIndex(p => p.id === post.id);
  if (idx > -1) all[idx] = post;
  else all.push(post);
  setLocal(KEYS.BLOG_POSTS, all);
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'blogPosts', id));
    return;
  }
  const all = getLocal<BlogPost>(KEYS.BLOG_POSTS);
  setLocal(KEYS.BLOG_POSTS, all.filter(p => p.id !== id));
}

// ==========================================
// 5.5. GALLERY METHODS
// ==========================================
export async function getGallery(): Promise<GalleryPhoto[]> {
  if (isFirebaseConfigured && db) {
    const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryPhoto));
  }
  if (!isClient) {
    const items = generateSeedItems();
    return items.slice(0, 15).map((item, index) => ({
      id: `gal-${index}`,
      categoryId: item.categoryId,
      captionEn: item.nameEn,
      captionSi: item.nameSi,
      imageUrl: item.images[0],
      isFeatured: index < 8,
      order: index + 1,
      createdAt: item.createdAt,
    }));
  }
  await getCategories(); // Ensure database is seeded
  
  let localGallery = localStorage.getItem(KEYS.GALLERY);
  if (!localGallery) {
    const items = getLocal<Item>(KEYS.ITEMS);
    const defaultGallery: GalleryPhoto[] = items.slice(0, 18).map((item, index) => ({
      id: `gal-${index}`,
      categoryId: item.categoryId,
      captionEn: item.nameEn,
      captionSi: item.nameSi,
      imageUrl: item.images[0],
      isFeatured: index < 8,
      order: index + 1,
      createdAt: item.createdAt,
    }));
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(defaultGallery));
    localGallery = JSON.stringify(defaultGallery);
  }
  return JSON.parse(localGallery).sort((a: any, b: any) => a.order - b.order);
}

export async function saveGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'gallery', photo.id), photo);
    return;
  }
  const all = await getGallery();
  const idx = all.findIndex(p => p.id === photo.id);
  if (idx > -1) all[idx] = photo;
  else all.push(photo);
  setLocal(KEYS.GALLERY, all);
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'gallery', id));
    return;
  }
  const all = await getGallery();
  setLocal(KEYS.GALLERY, all.filter(p => p.id !== id));
}


// ==========================================
// 6. SITE SETTINGS METHODS
// ==========================================
export async function getSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'siteSettings', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return defaultSettings;
  }
  if (!isClient) return defaultSettings;
  await getCategories(); // Ensure database is seeded
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : defaultSettings;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  if (isFirebaseConfigured && db) {
    await setDoc(doc(db, 'siteSettings', 'main'), settings);
    return;
  }
  if (!isClient) return;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}
