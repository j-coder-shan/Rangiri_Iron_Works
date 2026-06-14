# Rangiri Iron Works — Complete Implementation Prompt
## Deploy-Ready Build with All Credentials Configured

---

## CONTEXT

You are building a **production Next.js 15 website** for Rangiri Iron Works (රංගිරි යකඩ වැඩ), a real Sri Lankan iron fabrication and vehicle painting workshop in Dambulla. The repo is at: https://github.com/j-coder-shan/Rangiri_Iron_Works

The master implementation spec is in `Rangiri_Iron_Works_Master_Prompt.md` in the repo root. **Read that file first** — it is the source of truth for every page, section, component, and data model.

This prompt provides the **real credentials, integration details, and deployment checklist** to make the master spec production-ready.

---

## REAL CREDENTIALS — USE THESE EXACTLY

### `.env.local` — Create this file at the project root

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyADqtGRd9WHCODOJ18Y09ROEyEJHwonjRo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rangiri-iron-works.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rangiri-iron-works
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rangiri-iron-works.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=6272195081
NEXT_PUBLIC_FIREBASE_APP_ID=1:6272195081:web:0953db0f5e6b7d0e5bf6d8

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbhsqju79
CLOUDINARY_API_KEY=338656346387282
CLOUDINARY_API_SECRET=iBxi4c8WYplTK5ZL7n5RV2GY8Jg
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=rangiri-iron-works

# CallMeBot — NOT AVAILABLE, skip WhatsApp notifications
CALLMEBOT_API_KEY=
ADMIN_WHATSAPP=94723169847

# EmailJS — PRIMARY notification method
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_088at6i
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_hx3mti6
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=SnlH2O6uifKt1G-1P
ADMIN_EMAIL=prabod.jay02@gmail.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=rangiri-dev-secret-change-before-vercel-deploy
```

Confirm `.env.local` is listed in `.gitignore`. Never commit this file.

---

## CRITICAL INTEGRATION CHANGES vs THE MASTER SPEC

### 1. EmailJS replaces CallMeBot as the primary notification system

CallMeBot is not available. Use EmailJS for all new enquiry notifications.

**EmailJS credentials:**
- Service ID: `service_088at6i`
- Template ID: `template_hx3mti6`
- Public Key: `SnlH2O6uifKt1G-1P`

**Install EmailJS:**
```bash
npm install @emailjs/browser
```

**Update `src/lib/notifications.ts`** — replace the `sendWhatsAppNotification` function body with EmailJS, and keep `sendEmailNotification` as the primary notification. Send EmailJS from the **client side** in the quotation page's `onSuccess` callback (after the API route saves to Firestore):

```typescript
// src/lib/notifications.ts
import emailjs from '@emailjs/browser';

export async function sendEmailNotification(enquiry: {
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredContact: string;
  categoryNameEn: string;
  itemCode: string;
  message: string;
  language: string;
}): Promise<void> {
  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      reference_number: enquiry.referenceNumber,
      customer_name:    enquiry.customerName,
      customer_phone:   enquiry.customerPhone,
      customer_email:   enquiry.customerEmail || 'Not provided',
      preferred_contact: enquiry.preferredContact,
      service_name:     enquiry.categoryNameEn,
      item_code:        enquiry.itemCode || 'Not specified',
      message:          enquiry.message,
      submitted_at:     new Date().toLocaleString('en-LK'),
      language:         enquiry.language === 'si' ? 'Sinhala' : 'English',
      to_email:         'prabod.jay02@gmail.com',
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}

// WhatsApp fallback — only sends if CALLMEBOT_API_KEY is set
export async function sendWhatsAppNotification(enquiry: any): Promise<void> {
  if (!process.env.CALLMEBOT_API_KEY) return; // skip silently if not configured
  const message = encodeURIComponent(
    `New Enquiry: ${enquiry.referenceNumber}\n` +
    `${enquiry.customerName} | ${enquiry.customerPhone}\n` +
    `${enquiry.categoryNameEn} | ${enquiry.itemCode || 'N/A'}\n` +
    `${enquiry.message}`
  );
  const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.ADMIN_WHATSAPP}&text=${message}&apikey=${process.env.CALLMEBOT_API_KEY}`;
  await fetch(url).catch(() => {}); // non-blocking, silent fail
}
```

**In the Quotation page** (`src/app/quotation/page.tsx`), after receiving a successful API response, call `sendEmailNotification` client-side:

```typescript
const result = await response.json();
if (result.success) {
  // Save succeeded — now send email notification from client
  await sendEmailNotification({
    referenceNumber: result.referenceNumber,
    customerName: formData.customerName,
    customerPhone: formData.customerPhone,
    customerEmail: formData.customerEmail,
    preferredContact: formData.preferredContact,
    categoryNameEn: selectedCategory?.nameEn || formData.categoryId,
    itemCode: formData.itemCode,
    message: formData.message,
    language: lang,
  }).catch(console.error); // non-blocking — don't fail UX if email fails

  setSuccessData({ referenceNumber: result.referenceNumber, customerName: formData.customerName });
  setStep('success');
}
```

**EmailJS template variables** — make sure your EmailJS template at `template_hx3mti6` uses these exact variable names:
`{{reference_number}}`, `{{customer_name}}`, `{{customer_phone}}`, `{{customer_email}}`, `{{preferred_contact}}`, `{{service_name}}`, `{{item_code}}`, `{{message}}`, `{{submitted_at}}`, `{{language}}`, `{{to_email}}`

If the template uses different variable names, update the `sendEmailNotification` call above to match.

---

### 2. Firebase lib — safe server/client init

Replace the default Firebase init (which has `getAnalytics` that crashes on server) with this:

```typescript
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

Do NOT call `getAnalytics` anywhere — it is browser-only and breaks SSR.

---

### 3. Cloudinary upload preset

The upload preset name is **`rangiri-iron-works`** (already created, unsigned mode).
Use this in all `ImageUpload.tsx` and `GalleryManager.tsx` components:

```typescript
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!; // 'rangiri-iron-works'
const CLOUDINARY_CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;    // 'dbhsqju79'

// Upload URL:
const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// FormData:
formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
formData.append('folder', 'rangiri-iron-works'); // organise uploads into a folder
```

In `next.config.ts`, add Cloudinary as a trusted image domain:

```typescript
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};
export default nextConfig;
```

---

### 4. package.json fixes

```json
{
  "name": "rangiri-iron-works",
  "scripts": {
    "dev":   "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint":  "next lint"
  }
}
```

---

## FULL BUILD TASK

Now implement the **complete website** as described in `Rangiri_Iron_Works_Master_Prompt.md`. Build every file listed below completely — no placeholders, no TODOs, no "// implement later" comments.

### Files to create — in this order:

#### 1. Foundation
- `src/lib/firebase.ts` — safe init as above
- `src/lib/notifications.ts` — EmailJS primary + CallMeBot optional fallback
- `src/lib/cloudinary.ts` — upload helper using preset `rangiri-iron-works`
- `src/lib/codeGenerator.ts` — auto item code generation (RIW-IF-0001 format)
- `src/lib/firestore.ts` — typed helpers for all collections
- `src/lib/utils.ts` — shared utilities (cn, formatDate, slugify, etc.)
- `src/types/index.ts` — all TypeScript types (NO price field on Item)
- `src/middleware.ts` — protect /admin routes
- `src/app/globals.css` — complete CSS variable design system from master spec
- `src/contexts/LanguageContext.tsx` — default language: Sinhala ('si')
- `src/contexts/AuthContext.tsx` — Firebase auth state

#### 2. Shared UI Components
- `src/components/Logo.tsx` — SVG logo (anvil/hammer mark + RANGIRI + යකඩ වැඩ)
- `src/components/LanguageToggle.tsx` — EN / සිං pill toggle
- `src/components/layout/Navbar.tsx` — with item code search, language toggle, dropdown
- `src/components/layout/Footer.tsx` — 4-column, dark, bilingual
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Modal.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/ImageUpload.tsx` — Cloudinary upload, preset: rangiri-iron-works
- `src/components/services/CategoryCard.tsx`
- `src/components/services/ItemCard.tsx`
- `src/components/services/ItemCodeSearch.tsx`

#### 3. Homepage Sections
- `src/components/sections/HeroSection.tsx` — animated sparks, bilingual headline, two CTAs
- `src/components/sections/StatsBar.tsx` — count-up animation on scroll
- `src/components/sections/ServicesSection.tsx` — 6 category cards from Firestore
- `src/components/sections/FeaturedItems.tsx` — horizontal scroll, featured items from Firestore
- `src/components/sections/WhyChooseUs.tsx` — 4 cards, dark bg, bilingual
- `src/components/sections/GalleryPreview.tsx` — 8 photos, category filter chips
- `src/components/sections/TestimonialsSection.tsx` — 3 cards, off-white bg
- `src/components/sections/BlogPreview.tsx` — 3 latest posts (hidden if no posts)
- `src/components/sections/CTASection.tsx` — WhatsApp + Get Quote buttons

#### 4. Public Pages
- `src/app/layout.tsx` — root layout, fonts (next/font/google), providers, WhatsApp FAB
- `src/app/page.tsx` — homepage with all 9 sections + LocalBusiness JSON-LD
- `src/app/services/page.tsx` — all categories overview
- `src/app/services/[categorySlug]/page.tsx` — category items grid
- `src/app/services/[categorySlug]/[itemCode]/page.tsx` — item detail
- `src/app/item/[code]/page.tsx` — shorthand item lookup (redirects to full URL)
- `src/app/gallery/page.tsx` — masonry gallery with filter
- `src/app/quotation/page.tsx` — quotation form + EmailJS notification on success
- `src/app/about/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/sitemap.ts` — Next.js sitemap
- `src/app/robots.ts` — block /admin from crawlers

#### 5. Admin Panel
- `src/app/admin/layout.tsx` — auth guard, sidebar layout
- `src/app/admin/login/page.tsx` — Firebase email/password login
- `src/app/admin/page.tsx` — dashboard with stats + recent enquiries
- `src/app/admin/categories/page.tsx`
- `src/app/admin/categories/new/page.tsx`
- `src/app/admin/categories/[id]/page.tsx`
- `src/app/admin/items/page.tsx`
- `src/app/admin/items/new/page.tsx`
- `src/app/admin/items/[id]/page.tsx`
- `src/app/admin/enquiries/page.tsx`
- `src/app/admin/enquiries/[id]/page.tsx`
- `src/app/admin/gallery/page.tsx`
- `src/app/admin/testimonials/page.tsx`
- `src/app/admin/blog/page.tsx`
- `src/app/admin/blog/new/page.tsx`
- `src/app/admin/blog/[id]/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/components/layout/AdminTopbar.tsx`
- `src/components/admin/CategoryForm.tsx`
- `src/components/admin/ItemForm.tsx` — NO price field
- `src/components/admin/EnquiryCard.tsx`
- `src/components/admin/GalleryManager.tsx`
- `src/components/admin/StatsCard.tsx`

#### 6. API Routes
- `src/app/api/enquiry/route.ts` — POST: validate, rate-limit (3/day per phone), save to Firestore, trigger server-side WhatsApp (if CALLMEBOT_API_KEY set)

#### 7. Hooks
- `src/hooks/useLanguage.ts`
- `src/hooks/useAuth.ts`
- `src/hooks/useCategories.ts`
- `src/hooks/useItems.ts`
- `src/hooks/useEnquiries.ts`

#### 8. Config & Seed
- `next.config.ts` — Cloudinary remotePatterns, no --turbopack in build
- `firestore.rules` — production security rules
- `.env.local.example` — all keys, no values
- `scripts/seed.ts` — seed all 6 categories + ~60 items + 3 testimonials + siteSettings
- `README.md` — proper setup guide (replace default Next.js README)

---

## DESIGN RULES — NON-NEGOTIABLE

1. **Default language is Sinhala** (`lang = 'si'`). All UI defaults to Sinhala on first visit.
2. **No prices anywhere** on the public site — not in item detail, not in cards, not in admin item form, not in types.
3. **Item codes are always visible** on item cards and detail pages — monospace font, orange badge.
4. **WhatsApp floating button** fixed bottom-right on ALL public pages.
5. Use **CSS variables** from `globals.css` — never hardcode `#E8500A` or other brand colours inline.
6. Every public-facing text must have both English and Sinhala versions, switching instantly via LanguageContext.

---

## DEFINITION OF DONE

Run these checks before declaring complete:

```bash
npm run lint    # must pass with zero errors
npm run build   # must succeed, zero TypeScript errors
```

Then verify manually:
- [ ] Homepage loads all 9 sections; hero sparks animate; stat counters count up on scroll
- [ ] Language toggle switches ALL text between EN and SI instantly
- [ ] Item code search in navbar navigates to `/item/RIW-XX-0001`
- [ ] Quotation form submits → Firestore saves → email arrives at prabod.jay02@gmail.com via EmailJS
- [ ] Success screen shows reference number (RIW-ENQ-YYYY-NNNN)
- [ ] `/admin/login` authenticates with Firebase
- [ ] Admin can add a new item → auto-generates item code
- [ ] Admin can upload images to Cloudinary using preset `rangiri-iron-works`
- [ ] Navigating to `/admin` without login redirects to `/admin/login`
- [ ] No price field visible anywhere on the public site or in admin item form
- [ ] `npm run build` passes before any deploy

---

## VERCEL DEPLOYMENT (after build passes)

When deploying to Vercel, add these environment variables in the Vercel dashboard
(Settings → Environment Variables) with production values:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME         = dbhsqju79
CLOUDINARY_API_KEY                        = 338656346387282
CLOUDINARY_API_SECRET                     = iBxi4c8WYplTK5ZL7n5RV2GY8Jg
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET      = rangiri-iron-works
NEXT_PUBLIC_EMAILJS_SERVICE_ID            = service_088at6i
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID           = template_hx3mti6
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY            = SnlH2O6uifKt1G-1P
ADMIN_EMAIL                               = prabod.jay02@gmail.com
ADMIN_WHATSAPP                            = 94723169847
NEXT_PUBLIC_SITE_URL                      = https://rangiri.lk
NEXTAUTH_SECRET                           = <generate: openssl rand -base64 32>
CALLMEBOT_API_KEY                         = <leave empty for now>
```

After Vercel deployment:
1. Run `npx ts-node scripts/seed.ts` with production Firebase credentials
2. Create admin account: Firebase Console → Authentication → Add user (prabod.jay02@gmail.com)
3. Note the UID → Firestore → `adminUsers` collection → new doc with that UID, fields: `uid`, `email`, `role: "super_admin"`
4. Deploy Firestore rules: `firebase deploy --only firestore:rules`

---

*Build this completely. This is a production website for a real Sri Lankan workshop owner. Quality and bilingual accuracy (especially Sinhala) are non-negotiable. No placeholder content — use gradient placeholders only for images not yet uploaded.*
