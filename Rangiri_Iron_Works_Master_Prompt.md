# Rangiri Iron Works — Master Implementation Prompt
## රංගිරි යකඩ වැඩ — Complete Bilingual Business Website

> **Business:** Rangiri Iron Works | රංගිරි යකඩ වැඩ
> **Type:** Automobile, Iron Fabrication & Metal Painting Workshop — Dambulla, Sri Lanka
> **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Firebase (free tier) · Cloudinary (free tier)
> **Admin WhatsApp:** 0723169847 | **Admin Email:** prabod.jay02@gmail.com
> **Hosting:** Vercel (free) + Firebase Firestore (free) + Cloudinary (free) — 100% free stack

---

## 0. BRAND IDENTITY

### Name
- English: **Rangiri Iron Works**
- Sinhala: **රංගිරි යකඩ වැඩ**
- Tagline English: *"Crafted in Steel. Built to Last."*
- Tagline Sinhala: *"වානේවලින් නිර්මිත. කල් පවතින නිෂ්පාදන."*

### Logo (SVG — build this inline, no external assets needed)
Design a bold SVG logo combining:
- A stylised **anvil or hammer-and-iron** silhouette as the icon mark
- The text **"RANGIRI"** in a strong, industrial condensed font (use Barlow Condensed or Oswald from Google Fonts)
- **"යකඩ වැඩ"** in Noto Sans Sinhala underneath in smaller weight
- Accent: a horizontal spark/weld line under the icon in deep orange (#E8500A)
- Colors: Dark charcoal (#1A1A1A) for text, Deep orange (#E8500A) for accents, Steel grey (#6B7280) for sub-text
- The logo mark should work at 40px height (navbar) and 120px (footer/hero)
- Export as an inline SVG component `src/components/Logo.tsx`

### Color Palette (CSS Variables)
```css
:root {
  /* Primary */
  --iron:          #1A1A1A;      /* near-black — primary backgrounds */
  --iron-mid:      #2D2D2D;      /* dark card surfaces */
  --iron-light:    #3D3D3D;      /* hover states on dark surfaces */
  --steel:         #6B7280;      /* secondary text, borders */
  --steel-light:   #9CA3AF;      /* muted text */

  /* Accent */
  --spark:         #E8500A;      /* deep orange — primary CTA, highlights */
  --spark-light:   #FF6B2B;      /* hover state of spark */
  --spark-glow:    rgba(232,80,10,0.15); /* glow effect background */

  /* Warm neutrals */
  --ash:           #F5F4F2;      /* off-white page backgrounds */
  --ash-dark:      #E8E6E1;      /* section alternating bg */
  --smoke:         #FAFAF9;      /* card backgrounds (light sections) */

  /* Status */
  --success:       #16A34A;
  --warning:       #D97706;
  --danger:        #DC2626;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1008 100%);
  --gradient-spark: linear-gradient(135deg, #E8500A, #FF6B2B);
  --gradient-steel: linear-gradient(135deg, #3D3D3D, #6B7280);

  /* Typography */
  --font-display:  'Oswald', sans-serif;       /* headings, nav, item codes */
  --font-body:     'Source Sans 3', sans-serif; /* body text */
  --font-sinhala:  'Noto Sans Sinhala', sans-serif;
  --font-mono:     'JetBrains Mono', monospace; /* item codes */

  /* Spacing */
  --radius-sm:     6px;
  --radius-md:     12px;
  --radius-lg:     20px;
  --radius-xl:     32px;

  /* Shadows */
  --shadow-card:   0 4px 24px rgba(0,0,0,0.08);
  --shadow-spark:  0 8px 32px rgba(232,80,10,0.25);
  --shadow-dark:   0 20px 60px rgba(0,0,0,0.35);
  --transition:    0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Typography — Google Fonts to load
```html
<link href="https://fonts.googleapis.com/css2?
  family=Oswald:wght@400;500;600;700&
  family=Source+Sans+3:ital,wght@0,300;0,400;0,600;1,400&
  family=Noto+Sans+Sinhala:wght@400;500;600;700&
  family=JetBrains+Mono:wght@400;600&
  display=swap" rel="stylesheet"/>
```

---

## 1. TECH STACK — 100% FREE HOSTING

| Layer | Technology | Free Tier Details |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Open source |
| **Language** | TypeScript | Open source |
| **Styling** | Tailwind CSS 4 | Open source |
| **Database** | Firebase Firestore | 1GB storage, 50k reads/day, 20k writes/day — free |
| **Auth** | Firebase Authentication | Free — email/password for admin |
| **Image Storage** | Cloudinary | 25 credits/month free — plenty for workshop photos |
| **Hosting** | Vercel | Free hobby plan — custom domain supported |
| **WhatsApp Notifications** | CallMeBot API | Free WhatsApp API for individuals |
| **Email Notifications** | EmailJS | 200 emails/month free |
| **Analytics** | Vercel Analytics | Free basic analytics |

### Environment Variables (`.env.local`)
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CallMeBot (WhatsApp)
CALLMEBOT_API_KEY=          # Get free key from callmebot.com
ADMIN_WHATSAPP=0723169847

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
ADMIN_EMAIL=prabod.jay02@gmail.com

# App
NEXT_PUBLIC_SITE_URL=https://rangiri.lk
NEXTAUTH_SECRET=            # generate: openssl rand -base64 32

# Admin credentials (stored hashed in Firebase, not here)
ADMIN_SETUP_KEY=            # one-time setup key to create admin account
```

---

## 2. FIRESTORE DATABASE STRUCTURE

```
firestore/
│
├── categories/                     # Service categories (Iron Works, Vehicle Painting, etc.)
│   └── {categoryId}/
│       ├── id: string
│       ├── nameEn: string          # "Iron Fabrication Services"
│       ├── nameSi: string          # "යකඩ නිෂ්පාදන හා සැකසුම් සේවා"
│       ├── slug: string            # "iron-fabrication"
│       ├── descriptionEn: string
│       ├── descriptionSi: string
│       ├── icon: string            # Lucide icon name e.g. "wrench"
│       ├── coverImage: string      # Cloudinary URL
│       ├── order: number           # display sort order
│       ├── isActive: boolean
│       └── createdAt: Timestamp
│
├── items/                          # Individual service items within categories
│   └── {itemId}/
│       ├── id: string
│       ├── code: string            # AUTO-GENERATED e.g. "RIW-GT-0042"
│       ├── categoryId: string      # reference to categories/{id}
│       ├── categorySlug: string    # denormalized for queries
│       ├── nameEn: string          # "Sliding Gate"
│       ├── nameSi: string          # "ස්ලයිඩින් ගේට්ටු"
│       ├── descriptionEn: string   # detailed description
│       ├── descriptionSi: string
│       ├── features: string[]      # ["Heavy duty steel", "Smooth sliding mechanism"]
│       ├── featuresSi: string[]    # Sinhala features array
│       ├── images: string[]        # Array of Cloudinary URLs (max 8)
│       ├── isFeatured: boolean     # shows on homepage
│       ├── isActive: boolean
│       ├── order: number
│       └── createdAt: Timestamp
│
├── enquiries/                      # Customer quote requests
│   └── {enquiryId}/
│       ├── id: string
│       ├── referenceNumber: string # "RIW-ENQ-2025-0001"
│       ├── customerName: string
│       ├── customerPhone: string
│       ├── customerEmail: string
│       ├── preferredContact: string # "whatsapp" | "call" | "email"
│       ├── categoryId: string
│       ├── categoryNameEn: string
│       ├── itemCode: string        # optional — if asking about specific item
│       ├── message: string
│       ├── attachmentUrls: string[] # optional uploaded photos
│       ├── status: string          # "new" | "seen" | "replied" | "closed"
│       ├── language: string        # "en" | "si" — language visitor was using
│       ├── createdAt: Timestamp
│       └── ipAddress: string       # for spam prevention
│
├── testimonials/
│   └── {testimonialId}/
│       ├── id: string
│       ├── nameEn: string
│       ├── nameSi: string
│       ├── locationEn: string      # "Dambulla"
│       ├── locationSi: string      
│       ├── serviceEn: string       # "Iron Gate Fabrication"
│       ├── serviceSi: string
│       ├── reviewEn: string
│       ├── reviewSi: string
│       ├── rating: number          # 1–5
│       ├── avatarInitials: string  # "KP"
│       ├── isActive: boolean
│       └── createdAt: Timestamp
│
├── blogPosts/
│   └── {postId}/
│       ├── id: string
│       ├── slug: string
│       ├── titleEn: string
│       ├── titleSi: string
│       ├── excerptEn: string
│       ├── excerptSi: string
│       ├── contentEn: string       # Markdown or HTML
│       ├── contentSi: string
│       ├── coverImage: string      # Cloudinary URL
│       ├── tags: string[]
│       ├── isPublished: boolean
│       ├── publishedAt: Timestamp
│       └── createdAt: Timestamp
│
├── gallery/
│   └── {photoId}/
│       ├── id: string
│       ├── categoryId: string
│       ├── captionEn: string
│       ├── captionSi: string
│       ├── imageUrl: string        # Cloudinary URL
│       ├── isFeatured: boolean
│       ├── order: number
│       └── createdAt: Timestamp
│
├── siteSettings/
│   └── main/
│       ├── phone: string           # "0723169847"
│       ├── whatsapp: string        # "0723169847"
│       ├── email: string           # "prabod.jay02@gmail.com"
│       ├── addressEn: string
│       ├── addressSi: string
│       ├── workingHoursEn: string  # "Mon–Sat: 7:30am – 6:00pm"
│       ├── workingHoursSi: string
│       ├── facebookUrl: string
│       ├── youtubeUrl: string
│       ├── heroTitleEn: string
│       ├── heroTitleSi: string
│       ├── heroSubtitleEn: string
│       └── heroSubtitleSi: string
│
└── adminUsers/
    └── {uid}/
        ├── uid: string             # Firebase Auth UID
        ├── email: string
        ├── role: string            # "super_admin"
        └── createdAt: Timestamp
```

### Auto-Generated Item Code Format
```
RIW-{CATEGORY_PREFIX}-{4_DIGIT_NUMBER}

Category prefixes:
  Iron Fabrication  → IF
  Iron Painting     → IP
  Vehicle Painting  → VP
  Vehicle Canopies  → VC
  Three Wheeler     → TW
  Repair & Maint.   → RM
  Custom Category   → CC (first two letters of category name)

Examples:
  RIW-IF-0001   (first iron fabrication item)
  RIW-VP-0023   (23rd vehicle painting item)
  RIW-VC-0007   (7th vehicle canopy item)
```

Code generation logic:
```typescript
// src/lib/codeGenerator.ts
export async function generateItemCode(categorySlug: string): Promise<string> {
  const prefixMap: Record<string, string> = {
    'iron-fabrication': 'IF',
    'iron-painting': 'IP',
    'vehicle-painting': 'VP',
    'vehicle-canopies': 'VC',
    'three-wheeler-repairs': 'TW',
    'repair-maintenance': 'RM',
  };
  const prefix = prefixMap[categorySlug] ||
    categorySlug.split('-').map(w => w[0].toUpperCase()).join('').slice(0, 2);

  // Count existing items in this category and increment
  const snapshot = await getDocs(
    query(collection(db, 'items'), where('categorySlug', '==', categorySlug))
  );
  const num = String(snapshot.size + 1).padStart(4, '0');
  return `RIW-${prefix}-${num}`;
}
```

---

## 3. FILE STRUCTURE

```
rangiri-iron-works/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout — fonts, metadata, providers
│   │   ├── globals.css                   # Design system CSS variables + base styles
│   │   ├── page.tsx                      # Homepage
│   │   │
│   │   ├── services/
│   │   │   ├── page.tsx                  # All services overview
│   │   │   └── [categorySlug]/
│   │   │       ├── page.tsx              # Category page (e.g. /services/iron-fabrication)
│   │   │       └── [itemCode]/
│   │   │           └── page.tsx          # Item detail page (e.g. /services/iron-fabrication/RIW-IF-0001)
│   │   │
│   │   ├── gallery/
│   │   │   └── page.tsx                  # Project gallery with category filter
│   │   │
│   │   ├── quotation/
│   │   │   └── page.tsx                  # Get a quotation form
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx                  # About us page
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx                  # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # Individual blog post
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx                  # Contact page
│   │   │
│   │   ├── item/
│   │   │   └── [code]/
│   │   │       └── page.tsx              # Direct item lookup by code: /item/RIW-IF-0001
│   │   │
│   │   └── admin/
│   │       ├── layout.tsx                # Admin shell layout
│   │       ├── login/
│   │       │   └── page.tsx             # Admin login
│   │       ├── page.tsx                 # Admin dashboard overview
│   │       ├── categories/
│   │       │   ├── page.tsx             # List + manage categories
│   │       │   ├── new/page.tsx         # Add new category
│   │       │   └── [id]/page.tsx        # Edit category
│   │       ├── items/
│   │       │   ├── page.tsx             # List all items (filterable by category)
│   │       │   ├── new/page.tsx         # Add new item
│   │       │   └── [id]/page.tsx        # Edit item
│   │       ├── enquiries/
│   │       │   ├── page.tsx             # All enquiries inbox
│   │       │   └── [id]/page.tsx        # View single enquiry
│   │       ├── gallery/
│   │       │   └── page.tsx             # Manage gallery photos
│   │       ├── testimonials/
│   │       │   └── page.tsx             # Manage testimonials
│   │       ├── blog/
│   │       │   ├── page.tsx             # Blog post list
│   │       │   ├── new/page.tsx         # Write new post
│   │       │   └── [id]/page.tsx        # Edit post
│   │       └── settings/
│   │           └── page.tsx             # Site settings (phone, address, hours, etc.)
│   │
│   ├── components/
│   │   ├── Logo.tsx                     # SVG logo component
│   │   ├── LanguageToggle.tsx           # EN / සිං switcher
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Public navbar
│   │   │   ├── Footer.tsx               # Public footer
│   │   │   ├── AdminSidebar.tsx         # Admin sidebar
│   │   │   └── AdminTopbar.tsx          # Admin top bar
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx               # Variants: spark | outline | ghost | danger
│   │   │   ├── Badge.tsx                # Item code badge, status badge
│   │   │   ├── Card.tsx                 # Service card, item card
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx             # Loading skeleton
│   │   │   ├── ImageUpload.tsx          # Cloudinary upload widget
│   │   │   └── MarkdownEditor.tsx       # Blog post editor (use react-md-editor)
│   │   │
│   │   ├── sections/                    # Homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsBar.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── FeaturedItems.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── GalleryPreview.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── BlogPreview.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   └── ItemCodeSearch.tsx       # Search bar to find item by code
│   │   │
│   │   └── admin/
│   │       ├── CategoryForm.tsx
│   │       ├── ItemForm.tsx
│   │       ├── EnquiryCard.tsx
│   │       ├── GalleryManager.tsx
│   │       └── StatsCard.tsx
│   │
│   ├── contexts/
│   │   ├── LanguageContext.tsx          # Global EN/SI language state
│   │   └── AuthContext.tsx             # Firebase auth state
│   │
│   ├── lib/
│   │   ├── firebase.ts                  # Firebase app init
│   │   ├── firestore.ts                 # Typed Firestore helpers
│   │   ├── cloudinary.ts                # Cloudinary upload helpers
│   │   ├── notifications.ts             # WhatsApp + email notification senders
│   │   ├── codeGenerator.ts             # Auto item code generation
│   │   └── utils.ts                     # Shared utilities
│   │
│   ├── hooks/
│   │   ├── useLanguage.ts
│   │   ├── useAuth.ts
│   │   ├── useCategories.ts
│   │   ├── useItems.ts
│   │   └── useEnquiries.ts
│   │
│   ├── types/
│   │   └── index.ts                     # All TypeScript types
│   │
│   └── middleware.ts                    # Protect /admin routes
│
├── public/
│   ├── og-image.jpg                     # Default Open Graph image
│   └── favicon.ico
│
├── .env.local
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 4. COMPLETE TYPESCRIPT TYPES

```typescript
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
  coverImage: string;       // Cloudinary URL
  order: number;
  isActive: boolean;
  createdAt: Date;
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
  images: string[];         // Cloudinary URLs, first is thumbnail
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
}

export type EnquiryStatus = 'new' | 'seen' | 'replied' | 'closed';
export type PreferredContact = 'whatsapp' | 'call' | 'email';

export interface Enquiry {
  id: string;
  referenceNumber: string;  // "RIW-ENQ-2025-0001"
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
  createdAt: Date;
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
  rating: number;
  avatarInitials: string;
  isActive: boolean;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleSi: string;
  excerptEn: string;
  excerptSi: string;
  contentEn: string;
  contentSi: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
}

export interface GalleryPhoto {
  id: string;
  categoryId: string;
  captionEn: string;
  captionSi: string;
  imageUrl: string;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
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
```

---

## 5. NOTIFICATION SYSTEM

### WhatsApp Notification (CallMeBot — free)

```typescript
// src/lib/notifications.ts

export async function sendWhatsAppNotification(enquiry: Enquiry): Promise<void> {
  const message = encodeURIComponent(
    `🔔 *New Rangiri Iron Works Enquiry*\n\n` +
    `📋 Ref: ${enquiry.referenceNumber}\n` +
    `👤 Name: ${enquiry.customerName}\n` +
    `📱 Phone: ${enquiry.customerPhone}\n` +
    `📧 Email: ${enquiry.customerEmail}\n` +
    `📞 Preferred Contact: ${enquiry.preferredContact}\n` +
    `🔧 Service: ${enquiry.categoryNameEn}\n` +
    `🏷️ Item Code: ${enquiry.itemCode || 'Not specified'}\n` +
    `💬 Message: ${enquiry.message}\n\n` +
    `⏰ Received: ${new Date(enquiry.createdAt).toLocaleString('en-LK')}\n` +
    `🌐 Language: ${enquiry.language === 'si' ? 'Sinhala' : 'English'}`
  );

  const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.ADMIN_WHATSAPP}&text=${message}&apikey=${process.env.CALLMEBOT_API_KEY}`;

  await fetch(url);
}

export async function sendEmailNotification(enquiry: Enquiry): Promise<void> {
  // Using EmailJS — call from client side after enquiry saved
  // Template variables: to_email, customer_name, customer_phone,
  // service_name, item_code, message, reference_number, preferred_contact
}
```

### API Route for Enquiry Submission

```typescript
// src/app/api/enquiry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendWhatsAppNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.customerName || !body.customerPhone || !body.message || !body.categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limiting: max 3 enquiries per phone per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await getDocs(
      query(
        collection(db, 'enquiries'),
        where('customerPhone', '==', body.customerPhone),
        where('createdAt', '>=', today),
        limit(4)
      )
    );
    if (existing.size >= 3) {
      return NextResponse.json({ error: 'Too many requests today' }, { status: 429 });
    }

    // Generate reference number
    const total = await getDocs(collection(db, 'enquiries'));
    const refNum = `RIW-ENQ-${new Date().getFullYear()}-${String(total.size + 1).padStart(4, '0')}`;

    const enquiry = {
      ...body,
      referenceNumber: refNum,
      status: 'new',
      createdAt: new Date(),
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
    };

    const docRef = await addDoc(collection(db, 'enquiries'), enquiry);

    // Send WhatsApp notification (non-blocking)
    sendWhatsAppNotification({ ...enquiry, id: docRef.id }).catch(console.error);

    return NextResponse.json({
      success: true,
      referenceNumber: refNum,
      message: 'Your enquiry has been received. We will contact you within 24 hours.'
    });
  } catch (error) {
    console.error('Enquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
```

---

## 6. AUTHENTICATION & SECURITY

### Firebase Auth for Admin
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

### Middleware — protect /admin
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') &&
                       !req.nextUrl.pathname.startsWith('/admin/login');

  if (isAdminRoute) {
    // Check for Firebase session cookie
    const sessionCookie = req.cookies.get('__session');
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    // Full token verification happens inside the admin layout via Firebase Admin SDK
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Admin users collection — only authenticated admins can read
    match /adminUsers/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false; // only writable via Admin SDK
    }

    // Public read-only collections
    match /categories/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /items/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /testimonials/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /blogPosts/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /gallery/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /siteSettings/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Enquiries — anyone can create, only admin can read
    match /enquiries/{id} {
      allow create: if true;  // public can submit
      allow read, update, delete: if isAdmin();
    }

    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
  }
}
```

---

## 7. PAGE-BY-PAGE IMPLEMENTATION

---

### 7.1 NAVBAR (`src/components/layout/Navbar.tsx`)

**Visual design:**
- Dark charcoal (`var(--iron)`) background on scroll, transparent on hero
- Logo left-aligned
- Navigation links centre: HOME | SERVICES | GALLERY | BLOG | ABOUT | CONTACT
- Right side: Language toggle (EN / සිං) + "Get Quote" button in spark orange
- On mobile (< 768px): hamburger → full-screen dark overlay menu
- Sticky at top, `z-index: 100`
- Smooth `backdrop-filter: blur(12px)` when scrolled
- Active page link gets an underline in spark orange

**Navigation structure:**
```
HOME
SERVICES (dropdown on hover)
  ├─ Iron Fabrication | යකඩ නිෂ්පාදන
  ├─ Iron Painting | යකඩ පින්තාරු
  ├─ Vehicle Painting | වාහන පින්තාරු
  ├─ Vehicle Canopies | වාහන කැනොපි
  ├─ Three Wheeler Repairs | ත්‍රිරෝද රථ අලුත්වැඩියා
  └─ Repair & Maintenance | අලුත්වැඩියා සහ නඩත්තු
GALLERY | ගැලරිය
BLOG | බ්ලොග්
ABOUT | අප ගැන
CONTACT | අමතන්න
[ GET QUOTE | කෝටේෂන් ] ← orange button
[ EN / සිං ] ← language toggle
```

**Item Code Search bar** — a small `🔍 Enter item code...` field in the navbar on desktop, in mobile menu on smaller screens. Typing a code like `RIW-IF-0001` and pressing Enter navigates to `/item/RIW-IF-0001`.

---

### 7.2 FOOTER (`src/components/layout/Footer.tsx`)

**Visual design:**
- Dark `var(--iron)` background
- 4-column grid on desktop, stacked on mobile
- Top border line in spark orange (2px)

**Columns:**
1. **Brand** — Large logo, tagline in both languages, social media icons (Facebook, YouTube, WhatsApp)
2. **Services** — Links to all 6 category pages
3. **Quick Links** — Gallery, Blog, About, Contact, Get Quote, Item Code Search
4. **Contact Info** — Phone, WhatsApp (with link), Email, Working hours, Address — all in both languages

**Bottom bar:** Copyright © 2025 Rangiri Iron Works. All rights reserved. | රංගිරි යකඩ වැඩ | Designed for Sri Lanka 🇱🇰

---

### 7.3 HOMEPAGE (`src/app/page.tsx`)

#### Section 1: Hero
- Full-viewport dark hero (`var(--gradient-hero)`)
- Background: subtle geometric steel mesh pattern (CSS — angled grid lines in very low opacity)
- **Animated sparks** — small CSS keyframe particles (orange dots) floating up from bottom like welding sparks
- Large headline in Oswald font — switches between EN and SI based on language toggle
  - EN: **"Sri Lanka's Trusted Iron & Vehicle Workshop"**
  - SI: **"ශ්‍රී ලංකාවේ විශ්වාසදායකම යකඩ සහ වාහන වැඩපල"**
- Sub-headline — tagline in both languages
- Two CTA buttons: **"View Our Services"** (spark orange, solid) + **"Get Free Quote"** (outline)
- Bottom: Logo mark animated with a subtle "forge glow" pulse effect

#### Section 2: Stats Bar
Full-width dark section with 4 animated counters:
- **15+** Years of Experience | අවුරුදු 15+ ක් අත්දැකීම
- **250+** Projects Completed | ව්‍යාපෘති 250+
- **200+** Happy Customers | පාරිභෝගිකයන් 200+
- **6** Service Categories | සේවා කාණ්ඩ 6

Animate numbers with count-up effect on scroll into view (Intersection Observer).

#### Section 3: Our Services
- Section heading: **"What We Do"** / **"අප කරන දේ"**
- 6 large service category cards in a responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
- Each card: Cover image (Cloudinary or gradient placeholder), Icon (Lucide), Category name (EN + SI), Short description (EN + SI), item count, "Explore" arrow button
- Cards have: spark-orange left border accent, hover lift effect + orange glow shadow
- Clicking a card navigates to `/services/[categorySlug]`

#### Section 4: Featured Items
- Section heading: **"Our Featured Work"** / **"අපගේ විශේෂ නිෂ්පාදන"**
- Horizontal scrollable row of item cards (from items where `isFeatured: true`)
- Each card: Image, Item name (EN + SI), Item code badge (`RIW-IF-0001`), Category, "View Details" button

#### Section 5: Why Choose Rangiri
Dark background section with industrial aesthetic. 4 reason cards:
1. **🔧 Expert Craftsmanship** — 15+ years fabricating iron structures for Sri Lankan homes
2. **🛡️ Quality Materials** — Only high-grade steel, galvanised iron, and rustproof coatings
3. **🏠 Custom Designs** — Every item built to your exact specifications and measurements
4. **⚡ Fast Turnaround** — Most orders completed within 7–14 working days

Each card in Sinhala too. Cards have spark-orange icon background.

#### Section 6: Gallery Preview
- Masonry or grid of 8 latest gallery photos
- Category filter chips above (All | Iron Works | Vehicle Painting | Canopies)
- "View Full Gallery →" link below

#### Section 7: Testimonials
- 3 testimonial cards — customer name, location, service used, review (in whichever language), 5-star rating
- Soft off-white background (`var(--ash)`)
- Customer avatar as initials in a steel-coloured circle

#### Section 8: Latest Blog Posts
- 3 most recent published posts
- Card: Cover image, title (current language), excerpt, date, "Read More →"
- If no posts yet, this section is hidden

#### Section 9: CTA Banner
Full-width dark section:
- **"Ready to Start Your Project?"** / **"ඔබේ ව්‍යාපෘතිය ආරම්භ කිරීමට සූදානම්ද?"**
- WhatsApp button (opens `https://wa.me/94723169847`)
- "Get Quote" button (links to `/quotation`)
- Phone number displayed prominently

---

### 7.4 SERVICES OVERVIEW PAGE (`/services`)

- Hero banner: dark with page title in both languages
- All 6 category cards (same design as homepage section but larger)
- Item Code Search bar prominent at top: "Looking for a specific item? Enter its code below"

---

### 7.5 CATEGORY PAGE (`/services/[categorySlug]`)

- Breadcrumb: Home > Services > Iron Fabrication
- Category hero with cover image, name (EN + SI), description
- **Item Code Search** bar
- Item grid: responsive cards for all active items in this category
- Each item card:
  - Thumbnail (first image from item.images array, or gradient placeholder)
  - **Item Code badge** prominently shown: `RIW-IF-0001` (monospace font, orange)
  - Name in both languages
  - Short description (first 100 chars)
  - "View Details" button → `/services/[categorySlug]/[itemCode]`
  - "Enquire About This" button → `/quotation?code=RIW-IF-0001`

---

### 7.6 ITEM DETAIL PAGE (`/services/[categorySlug]/[itemCode]` and `/item/[code]`)

Both URLs should resolve to the same page. The `/item/[code]` shorthand lets anyone who has the code go directly.

- **Image gallery**: Large main image + thumbnail row. Click thumbnail to swap. Lightbox on click.
- **Item code** shown prominently in monospace badge at top: `RIW-IF-0001`
- **"Share this item"** button — copies URL to clipboard (customers can share codes with each other)
- Name in large Oswald heading (EN + SI)
- Full description in both languages (show based on current language)
- Features list (bulleted, with spark-orange check icons)
- **NO PRICE SHOWN ANYWHERE** — instead show: *"Contact us for pricing | මිල සඳහා අමතන්න"*
- CTA section at bottom:
  - "Enquire About This Item" (orange button → quotation form pre-filled with item code)
  - "WhatsApp Us" (green button → `https://wa.me/94723169847?text=Hi, I'm interested in item RIW-IF-0001`)
  - "Call Us" (outline button → tel:0723169847)
- Related items from same category (3 cards at bottom)
- SEO: `<title>RIW-IF-0001 – Sliding Gate | Rangiri Iron Works</title>`

---

### 7.7 GALLERY PAGE (`/gallery`)

- Hero with page title
- Filter bar: All | Iron Works | Iron Painting | Vehicle Painting | Canopies | Three Wheeler | Custom
- Masonry grid layout (CSS columns or `react-masonry-css`)
- Each photo: image, caption in current language, category chip
- Click → fullscreen lightbox (keyboard navigable: arrow keys, ESC to close)
- Lazy loading with blur-up placeholder
- "No photos in this category yet" empty state

---

### 7.8 QUOTATION PAGE (`/quotation`)

**The most important conversion page.** Make it feel professional and trustworthy.

- URL params: `?code=RIW-IF-0001` pre-fills item code, `?category=iron-fabrication` pre-selects category

**Form fields:**
1. Full Name (required) — name / නම
2. Phone Number (required) — `+94` prefix, validates Sri Lankan format
3. Email Address (optional)
4. Preferred Contact Method — radio: WhatsApp | Phone Call | Email
5. Service Category (required) — dropdown from Firestore categories
6. Item Code (optional) — text input, auto-populates if URL param present. Show item name if valid code entered.
7. Your Message / Description (required) — textarea, 500 char max. Placeholder: "Describe what you need — size, location, special requirements..."
8. Attach Photos (optional) — upload up to 3 images (Cloudinary), helpful for repairs and custom work
9. Language preference radio: English | Sinhala

**Submission behaviour:**
- Client-side validation with inline errors
- Show loading spinner on submit
- `POST /api/enquiry` → saves to Firestore + triggers WhatsApp notification to admin
- **Success screen**: 
  - Tick animation
  - "Thank you, [Name]! / ස්තූතියි, [Name]!"
  - "Your reference number is: **RIW-ENQ-2025-0001**"
  - "We will contact you within 24 hours on your preferred channel"
  - WhatsApp button: "Send us your photos on WhatsApp"

---

### 7.9 ABOUT PAGE (`/about`)

- Workshop story / history
- Mission statement in both languages
- Team section (optional — add if owner wants to feature himself/team)
- Workshop photos (Cloudinary gallery)
- Certifications / experience highlights
- Map embed (Google Maps — workshop location, Kandy area)
- Values: Quality, Reliability, Customer Service, Sri Lankan Craftsmanship

---

### 7.10 BLOG PAGE (`/blog` and `/blog/[slug]`)

- Blog listing: card grid with cover image, title (current language), excerpt, date, tags, "Read More"
- Individual post: full-width cover image, content in Markdown rendered with `react-markdown`, reading time estimate
- Tags filter on listing page
- "Share this post" button (WhatsApp share link)
- Related posts at bottom

**Suggested first blog post topics:**
- "How to choose the right iron gate for your home" / "ගෙදරට සුදුසු යකඩ ගේට්ටුව තෝරා ගන්නේ කෙසේද?"
- "Safari jeep canopy maintenance tips" / "සෆාරි ජීප් කැනොපි නඩත්තු ක්‍රම"
- "5 signs your vehicle needs a full repaint" / "ඔබේ වාහනය නැවත පින්තාරු කළ යුතු ලක්ෂණ 5"

---

### 7.11 CONTACT PAGE (`/contact`)

- Two columns: Contact form (left) + Info cards (right)
- Contact form fields: Name, Phone, Message — submits same as quotation but simplified
- Info cards: Phone, WhatsApp, Email, Address, Working Hours
- Embedded Google Map
- WhatsApp floating button (fixed bottom-right on all pages) — visible always

---

## 8. ADMIN INTERFACE

The admin interface lives at `/admin/*`. It is completely separate from the public website. Only accessible after Firebase login.

### Design
- Clean, light-themed admin (opposite of the dark public site)
- Sidebar: dark iron (`var(--iron)`) with spark orange accents
- Content area: white/ash grey
- Uses the same font system but smaller sizes for data density
- Fully responsive (tablet + desktop focus — admin rarely used on phone)

---

### 8.1 ADMIN LOGIN (`/admin/login`)

- Centered card on dark background (matches brand)
- Logo at top
- Email + Password fields
- Login button
- Error: "Invalid credentials. Please try again." (never reveal which field was wrong)
- No "forgot password" link visible — admin resets via Firebase console
- After login → redirect to `/admin`

---

### 8.2 ADMIN DASHBOARD (`/admin`)

**Stats cards (top row):**
- Total Categories | Total Items | Total Enquiries (today) | New Enquiries (unread)

**Quick actions:**
- + Add New Item (most common action — prominently placed)
- + Add New Category
- View New Enquiries

**Recent Enquiries table** (last 10):
- Ref No. | Customer | Phone | Service | Status | Time | Actions

**Quick item search by code**

---

### 8.3 CATEGORY MANAGEMENT (`/admin/categories`)

**List view:**
- Table: Order | Icon | Name (EN + SI) | Slug | Items Count | Status | Actions
- Drag to reorder (react-beautiful-dnd or @dnd-kit/core)
- Toggle active/inactive with switch
- Edit | Delete buttons

**Add/Edit Category Form:**
```
Category Name (English)*
Category Name (Sinhala | සිංහල)*
URL Slug* (auto-generated from English name, editable)
Icon* (searchable icon picker from Lucide icons)
Description (English)
Description (Sinhala)
Cover Image (Cloudinary upload)
Display Order (number)
Active (toggle)
```

**Validation:**
- Slug must be unique
- Sinhala name required (this is for Sri Lankan customers)
- Cannot delete a category that has items — must first move or delete all items

---

### 8.4 ITEM MANAGEMENT (`/admin/items`)

**List view:**
- Filter by category dropdown
- Search by code, name
- Table: Code | Thumbnail | Name (EN + SI) | Category | Featured | Status | Actions
- Sort by: Date | Code | Name
- Pagination: 20 per page

**Add/Edit Item Form — this is the most important admin form:**

```
SECTION: Basic Info
─────────────────────────────────────────
Category*                          [dropdown of all categories]
Item Code                          [AUTO-GENERATED — shown read-only after save]
                                   Display: RIW-IF-0001 (copy button)
Item Name (English)*               [text input]
Item Name (Sinhala)*               [text input — Noto Sans Sinhala keyboard hint]

SECTION: Description
─────────────────────────────────────────
Description (English)*             [textarea — 500 char]
Description (Sinhala)*             [textarea — 500 char]

SECTION: Features / Key Points
─────────────────────────────────────────
Features (English)                 [dynamic list — add/remove rows]
  + Add Feature
Features (Sinhala)                 [dynamic list — add/remove rows]
  + Add Feature

SECTION: Images
─────────────────────────────────────────
Upload Images                      [drag-drop Cloudinary upload, max 8]
                                   First image = thumbnail
                                   Reorder by drag

SECTION: Settings
─────────────────────────────────────────
Featured on Homepage               [toggle]
Active (visible on website)        [toggle]
Display Order                      [number]
```

**After saving a new item:**
- System auto-generates code: `RIW-IF-0042`
- Show modal: "Item saved! Item Code: **RIW-IF-0042**. Share this code with customers who enquire."
- Copy code button

---

### 8.5 ENQUIRIES INBOX (`/admin/enquiries`)

**The most important admin section — this is how leads come in.**

**Filter bar:** All | New (unread badge) | Seen | Replied | Closed | Today | This Week

**Enquiry list:**
- Each enquiry as a card showing: Reference | Customer name | Phone | Service | Message preview | Time | Status badge | Actions

**Individual Enquiry View (`/admin/enquiries/[id]`):**
- Full customer details
- Service requested + item code (with link to that item)
- Full message
- Attached photos (lightbox)
- Status update dropdown: New → Seen → Replied → Closed
- One-click actions:
  - **📱 WhatsApp Reply** — opens `https://wa.me/94{phone}?text=Hi {name}, regarding your enquiry RIW-ENQ-2025-0001...`
  - **📞 Call Customer** — opens `tel:{phone}`
  - **📧 Email Customer** — opens `mailto:{email}`
- Admin notes field (internal only)

---

### 8.6 GALLERY MANAGEMENT (`/admin/gallery`)

- Upload new photos (Cloudinary, multi-upload)
- Assign each photo to a category
- Add captions in EN + SI
- Toggle featured/hidden
- Delete photos (removes from Cloudinary too)
- Drag-to-reorder grid

---

### 8.7 TESTIMONIALS MANAGEMENT (`/admin/testimonials`)

- Add/edit/delete testimonials
- Toggle visible/hidden
- Fields: Customer name (EN + SI), Location (EN + SI), Service (EN + SI), Review text (EN + SI), Rating (1-5 stars), Avatar initials

---

### 8.8 BLOG MANAGEMENT (`/admin/blog`)

- Post list with publish/draft toggle
- Rich text editor for content (use `@uiw/react-md-editor` or `TipTap`)
- Separate English and Sinhala content tabs
- Cover image upload (Cloudinary)
- Tags input
- SEO fields: meta description, OG image
- Publish / Save Draft buttons

---

### 8.9 SITE SETTINGS (`/admin/settings`)

- Phone number
- WhatsApp number
- Email address
- Workshop address (EN + SI)
- Working hours (EN + SI)
- Social media URLs (Facebook, YouTube)
- Hero section text (EN + SI)
- About page content
- Save button

---

## 9. BILINGUAL SYSTEM IMPLEMENTATION

This is a Sri Lankan business. Sinhala is the primary language for the majority of customers.

### Language Context
```typescript
// src/contexts/LanguageContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'si';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, si: string) => string;  // helper function
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('si'); // DEFAULT TO SINHALA

  useEffect(() => {
    const saved = localStorage.getItem('rangiri-lang') as Language;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('rangiri-lang', newLang);
  };

  const t = (en: string, si: string) => lang === 'si' ? si : en;

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
```

**Default language = Sinhala (සිංහල)** — because most customers are Sri Lankan locals. English is the secondary option.

### Language Toggle Component
```typescript
// src/components/LanguageToggle.tsx
// Two pill buttons: [EN] [සිං]
// Active pill: filled spark orange
// Inactive: outlined steel grey
// Smooth transition between languages (no page reload)
```

### Usage in components
```typescript
const { lang, t } = useLanguage();

// In JSX:
<h1>{t("Iron Gates", "යකඩ ගේට්ටු")}</h1>
<p>{t(item.descriptionEn, item.descriptionSi)}</p>
```

---

## 10. INITIAL SEED DATA

Populate Firestore with all 6 categories and the complete service items from the document. A seed script at `scripts/seed.ts` should:

1. Create all 6 categories with names, slugs, descriptions in EN + SI, icons
2. Create all ~60 service items across categories — names in EN + SI, descriptions, auto-generated codes
3. Create 3 sample testimonials in EN + SI
4. Create the initial site settings record

### Categories to seed:
```typescript
const categories = [
  {
    nameEn: 'Iron Fabrication Services',
    nameSi: 'යකඩ නිෂ්පාදන හා සැකසුම් සේවා',
    slug: 'iron-fabrication',
    icon: 'wrench',
    descriptionEn: 'Custom iron fabrication — gates, grills, railings, roofing structures, and more.',
    descriptionSi: 'අභිරුචි යකඩ නිෂ්පාදන — ගේට්ටු, ග්‍රිල්, රේලිං, වහල ව්‍යුහ සහ තවත්.',
    order: 1,
  },
  {
    nameEn: 'Iron Painting Services',
    nameSi: 'යකඩ පින්තාරු සේවා',
    slug: 'iron-painting',
    icon: 'paintbrush',
    descriptionEn: 'Professional metal painting — rust protection, anti-corrosion coating, spray painting.',
    descriptionSi: 'වෘත්තීය ලෝහ පින්තාරු — මලකඩ ආරක්ෂාව, විරෝධී ආලේපන, ස්ප්‍රේ පින්තාරු.',
    order: 2,
  },
  {
    nameEn: 'Vehicle Painting Services',
    nameSi: 'වාහන පින්තාරු සේවා',
    slug: 'vehicle-painting',
    icon: 'car',
    descriptionEn: 'Full vehicle repaints, dent repair, touch-up painting for cars, vans, jeeps, and three-wheelers.',
    descriptionSi: 'සම්පූර්ණ වාහන නැවත පින්තාරු, ඩෙන්ට් අලුත්වැඩියා, කාර්, වෑන්, ජීප්, ත්‍රිරෝද රථ.',
    order: 3,
  },
  {
    nameEn: 'Vehicle Canopy Services',
    nameSi: 'වාහන කැනොපි සේවා',
    slug: 'vehicle-canopies',
    icon: 'truck',
    descriptionEn: 'Custom canopies for safari jeeps, boleros, pickups — aluminium and steel options.',
    descriptionSi: 'සෆාරි ජීප්, බොලේරෝ, පිකප් සඳහා කැනොපි — ඇලුමිනියම් සහ වානේ.',
    order: 4,
  },
  {
    nameEn: 'Three Wheeler Repairs',
    nameSi: 'ත්‍රිරෝද රථ අලුත්වැඩියා',
    slug: 'three-wheeler-repairs',
    icon: 'zap',
    descriptionEn: 'Body repair, chassis welding, painting, and full restoration for three-wheelers (tuk-tuks).',
    descriptionSi: 'ත්‍රිරෝද රථ  සඳහා බොඩි අලුත්වැඩියා, චැසි වෙල්ඩිං, පින්තාරු, සම්පූර්ණ ප්‍රතිසංස්කරණය.',
    order: 5,
  },
  {
    nameEn: 'Repair & Maintenance',
    nameSi: 'අලුත්වැඩියා සහ නඩත්තු',
    slug: 'repair-maintenance',
    icon: 'settings',
    descriptionEn: 'Gate repairs, rust removal, structural reinforcement, welding repairs, and maintenance contracts.',
    descriptionSi: 'ගේට්ටු අලුත්වැඩියා, මලකඩ ඉවත් කිරීම, ව්‍යුහ ශක්තිමත් කිරීම, නඩත්තු ගිවිසුම්.',
    order: 6,
  },
];
```

---

## 11. SEO & METADATA

### Root Layout Metadata
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Rangiri Iron Works | රංගිරි යකඩ වැඩ — Dambulla, Sri Lanka',
    template: '%s | Rangiri Iron Works',
  },
  description: 'Sri Lanka\'s trusted iron fabrication, vehicle painting & canopy workshop. Custom gates, grills, railings, vehicle repaints. රංගිරි යකඩ වැඩ — Dambulla.',
  keywords: ['iron works', 'යකඩ නිෂ්පාදන', 'vehicle painting', 'safari jeep canopy', 'iron gates Kandy', 'ගේට්ටු', 'welding Sri Lanka'],
  openGraph: {
    title: 'Rangiri Iron Works | රංගිරි යකඩ වැඩ',
    description: 'Custom iron fabrication, vehicle painting & canopies — Dambulla, Sri Lanka',
    type: 'website',
    url: 'https://rangiri.lk',
    locale: 'si_LK',
  },
  alternates: {
    canonical: 'https://rangiri.lk',
  },
};
```

### Item Page Metadata
```typescript
export async function generateMetadata({ params }) {
  const item = await getItemByCode(params.itemCode);
  return {
    title: `${item.code} – ${item.nameEn} | ${item.nameSi}`,
    description: item.descriptionEn.slice(0, 155),
  };
}
```

---

## 12. PACKAGES TO INSTALL

```bash
npm install firebase
npm install cloudinary
npm install react-dropzone
npm install react-masonry-css
npm install @dnd-kit/core @dnd-kit/sortable
npm install react-markdown
npm install @uiw/react-md-editor
npm install lucide-react
npm install clsx
npm install date-fns
npm install qrcode
npm install @types/qrcode
```

---

## 13. WHATSAPP FLOATING BUTTON

Fixed on all public pages, bottom-right corner:
```typescript
// Visible on all pages via root layout
<a
  href="https://wa.me/94723169847?text=Hello%20Rangiri%20Iron%20Works%2C%20I%20need%20a%20quotation"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
  aria-label="Chat on WhatsApp"
>
  {/* WhatsApp SVG icon */}
</a>
```

---

## 14. DEFINITION OF DONE

The implementation is complete when:

**Public Website:**
- [ ] Homepage loads with all 9 sections, hero animation (sparks), stat counters
- [ ] Language toggle switches ALL text between English and Sinhala instantly (default: Sinhala)
- [ ] Navbar dropdown works on desktop; hamburger menu on mobile
- [ ] Item code search in navbar navigates to correct item page
- [ ] `/services` shows all 6 categories from Firestore
- [ ] `/services/[categorySlug]` shows all items in that category with codes visible
- [ ] `/services/[categorySlug]/[itemCode]` and `/item/[code]` both show item detail — NO PRICE shown anywhere
- [ ] Quotation form submits → saves to Firestore → triggers WhatsApp notification to 0723169847
- [ ] Success screen shows reference number after quotation submission
- [ ] Gallery page loads with category filter working
- [ ] Blog page shows published posts; individual post pages load
- [ ] WhatsApp floating button visible on all pages
- [ ] All pages mobile responsive
- [ ] No prices visible anywhere on the public site

**Admin Panel:**
- [ ] `/admin/login` authenticates with Firebase
- [ ] `/admin` shows dashboard with stats and recent enquiries
- [ ] Admin can add a new category with EN + SI name, icon, description
- [ ] Admin can add a new item within any category → auto-generates code (e.g. RIW-IF-0042)
- [ ] Admin can upload images to Cloudinary from the item form
- [ ] Admin can toggle item as Featured / Active
- [ ] Admin can view all enquiries, update status (New → Replied → Closed)
- [ ] Admin can one-click WhatsApp reply to a customer from enquiry detail
- [ ] Admin can manage gallery, testimonials, blog posts, and site settings
- [ ] Navigating to `/admin/*` without login redirects to `/admin/login`
- [ ] Non-admin Firebase accounts cannot access admin panel

**Notifications:**
- [ ] Submitting quotation form sends WhatsApp message to 0723169847 within 30 seconds
- [ ] WhatsApp message includes: customer name, phone, service, item code, message, reference number

**Firestore:**
- [ ] All 6 categories seeded
- [ ] All ~60 service items seeded with EN + SI names and auto-generated codes
- [ ] Security rules: public can read categories/items/gallery; only admin can write; enquiries: anyone can create, only admin reads

**Build:**
- [ ] `npm run build` succeeds with zero TypeScript errors
- [ ] `npm run lint` passes
- [ ] Deployed to Vercel with environment variables set
- [ ] Custom domain pointed (optional)

---

## 15. DEPLOYMENT STEPS

1. **Firebase project:** Create at console.firebase.google.com → enable Firestore, Authentication (email/password), Storage
2. **Cloudinary account:** Sign up free at cloudinary.com → create upload preset (unsigned, for client-side uploads)
3. **CallMeBot:** Follow https://www.callmebot.com/blog/free-api-whatsapp-messages/ to get your free API key for 0723169847
4. **EmailJS:** Sign up at emailjs.com → create service + template → get public key
5. **Vercel:** `npx vercel` or connect GitHub repo → add all environment variables in Vercel dashboard
6. **Run seed script:** `npx ts-node scripts/seed.ts` after setting up Firebase
7. **Create admin account:** Use Firebase Console Authentication → add admin email → run admin setup endpoint once to write to `adminUsers` collection

---

*Build this completely. Every section, every admin panel feature, every notification. This is a production website for a real Sri Lankan workshop owner. Quality, robustness, and bilingual accuracy (especially Sinhala) are non-negotiable. No placeholder content except where photos are not yet uploaded — use gradient placeholders for images only.*
