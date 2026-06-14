# Rangiri Iron Works (රංගිරි යකඩ වැඩ)

Bilingual (Sinhala/English) business website, customer quotation desk, and administrative management console for **Rangiri Iron Works**, a premier vehicle fabrication, ironworks, and automotive/metal painting workshop located in Dambulla, Sri Lanka.

This repository hosts a production-ready Next.js 15 application designed to run on a 100% free hosting stack (Vercel, Google Firebase, Cloudinary, and EmailJS) while providing a premium, high-performance, and responsive user experience.

<p align="center">
  <img src="public/qr-code.png" alt="Rangiri Iron Works Website QR Code" width="250" />
</p>

---

## 📖 Table of Contents
1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Bilingual Support & SEO Guidelines](#-bilingual-support--seo-guidelines)
3. [Technology Stack](#-technology-stack)
4. [Prerequisites](#-prerequisites)
5. [Environment Setup (`.env.local`)](#-environment-setup-envlocal)
6. [Local Development Steps](#-local-development-steps)
7. [Hybrid Database Layer (Mock vs. Production)](#-hybrid-database-layer-mock-vs-production)
8. [Database Seeding (One-Click Initialization)](#-database-seeding-one-click-initialization)
9. [Firebase Authentication & Admin Account Setup](#-firebase-authentication--admin-account-setup)
10. [Firestore Security Rules](#-firestore-security-rules)
11. [Cloudinary Upload Configurations](#-cloudinary-upload-configurations)
12. [Production Deployment (Vercel)](#-production-deployment-vercel)

---

## 🚀 Project Overview & Key Features

### 🌐 Public Client Portal
- **Hero & Landing Experience**: Vibrant, dark-themed industrial aesthetic featuring custom forge welding spark animations, key metrics counters that animate on scroll, and alternating light/dark showcase sections.
- **Bilingual Interface**: Seamless translation switcher between English and Sinhala (`si`), defaulting to Sinhala (`si`) for local relevance.
- **Quotation Desk (`/quotation`)**: Simple step-by-step form allowing users to request pricing estimates for custom structures, safari canopies, or paint jobs. 
  - Validates Sri Lankan mobile phone patterns (`^07[0-9]{8}$` or `^(?:\+94|0)?(7[01245678][0-9]{7})$`).
  - Pre-fills item identifiers automatically when navigating from product cards.
  - Bot-preventing honeypot validation.
  - Interactive canvas-confetti success overlay on submissions.
- **Shorthand Item Lookup (`/item/[code]`)**: Users can input or browse item codes (e.g., `RIW-IF-0001`) to directly route to the product page.
- **Responsive Masonry Gallery (`/gallery`)**: Filterable media grid displaying workshop projects with a full-screen, keyboard-navigable (`Esc`, `ArrowLeft`, `ArrowRight`) lightbox slider.
- **Bilingual Markdown Blog (`/blog`)**: Support for custom bullet icons and formatted layouts.
- **No Public Prices**: Following commercial requirements, **no prices are displayed on the public site**. Users request quotations instead.

### 🔐 Admin Dashboard Panel (`/admin`)
- **Metrics Overview**: Real-time summary cards (Total Service Items, Categories, Unread Enquiries).
- **Inbox Manager**: Filterable enquiry categories (*New*, *Opened*, *Replied*, *Closed*). Features quick action helpers to generate pre-filled templates for **WhatsApp messages**, direct phone calls, or emails.
- **Bilingual CRUD Forms**: Edit text, toggle status, and define specifications in both Sinhala and English side-by-side.
- **Settings Manager**: Live customization of phone contacts, social links, working hours, and homepage landing slogans.

---

## 🎨 Bilingual Support & SEO Guidelines

- **Default Language**: Sinhala (`si`). On first load, the browser context reads and stores the language preference in `localStorage`.
- **Search Engine Optimization**:
  - **Sitemaps**: Automatically generated sitemaps (`/sitemap.xml`) including routing metadata.
  - **Robots.txt**: Restricts search engine spiders from crawling `/admin/*` directories.
  - **JSON-LD LocalBusiness Structured Data**: Injected directly into the homepage head to boost local search rankings in Dambulla and surrounding Sri Lankan regions.

---

## 🛠 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | High-performance React 19 SSR and static generation. |
| **Styling** | Tailwind CSS v4 | Vanilla CSS variables & custom industrial keyframes. |
| **Database** | Google Cloud Firestore | NoSQL document storage (free tier). |
| **Auth** | Firebase Authentication | Admin login validation. |
| **Media Delivery** | Cloudinary | Unsigned upload preset for optimized images (`f_auto, q_auto`). |
| **Email API** | EmailJS | Client-side admin email triggers for quote requests. |

---

## 📋 Prerequisites

- **Node.js**: Version 20.0.0 or higher.
- **Firebase Project**: A Google Cloud Console project with Firestore and Email/Password Auth enabled.
- **Cloudinary Account**: Access credentials and a configured upload preset.
- **EmailJS Account**: An active EmailJS service, template, and public key.

---

## ⚙️ Environment Setup (`.env.local`)

Create a file named `.env.local` in the project root directory and add the following keys:

```env
# Firebase API configurations
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary media configurations
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

# CallMeBot WhatsApp (Leave empty if not using WhatsApp notifications)
CALLMEBOT_API_KEY=
ADMIN_WHATSAPP=your_admin_whatsapp_number

# EmailJS notifications
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
ADMIN_EMAIL=your_admin_email_address

# App config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_hash_here
```

Create a `.env.local.example` with blank values to guide production deployments.

---

## 💻 Local Development Steps

1. **Clone the repository and install dependencies**:
   ```bash
   git clone https://github.com/j-coder-shan/Rangiri_Iron_Works.git
   cd Rangiri_Iron_Works
   npm install
   ```

2. **Run the local development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the homepage.

---

## 🗄 Hybrid Database Layer (Mock vs. Production)

The application features a transparent, hybrid storage layer (`src/lib/db.ts`):
- **Mock Sandbox Mode**: If `NEXT_PUBLIC_FIREBASE_API_KEY` is not present in your env configurations, the site runs using `localStorage`. It seeds **6 categories and 60 service items** dynamically on first load, allowing you to run CRUD edits, create blog posts, add testimonials, and submit enquiries inside your local browser storage.
- **Production Mode**: Once the Firebase credentials are added, the storage layer automatically bypasses local storage and directs all database transactions directly to Firestore.

---

## 🗄️ Database Seeding (One-Click Initialization)

When deploying to production, your live Firestore database collections will initially be empty. You can seed them using **either of two methods**:

### Method A: One-Click Seeding (Recommended)
1. Deploy the app and navigate to the Admin Settings Panel: `/admin/settings` (log in using your admin credentials).
2. Scroll to the bottom of the page to locate the **Production Database Initializer** card.
3. Click **"Seed Live Database"**.
4. The system will write the default 6 categories, 60 service items, testimonials, and blog posts directly to Firestore without overwriting any existing data.

### Method B: Terminal Command Seeding
Alternatively, run the script command locally:
```bash
# Run local script to write default data to Firestore
npx ts-node src/scripts/seed.ts
```

---

## 🔑 Firebase Authentication & Admin Account Setup

To allow admin log-ins to `/admin/login` once Firebase is connected:

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Build** -> **Authentication** -> **Users** and click **Add User**.
3. Create a user (e.g., `admin@rangiri.lk` with a strong password).
4. Note the user's generated **UID**.
5. Navigate to **Firestore Database** -> **Create Document** inside the `adminUsers` collection.
6. Set the Document ID exactly to the user's **UID**, and add the fields:
   ```json
   {
     "email": "admin@rangiri.lk",
     "role": "super_admin"
   }
   ```

---

## 🛡 Firestore Security Rules

To protect your production database from unauthorized changes, go to the **Rules** tab in the Firebase console and deploy these rules (also located at [firestore.rules](file:///c:/Users/PRABO/OneDrive/Documents/GitHub/Rangiri_Iron_Works/firestore.rules)):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /adminUsers/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }
    match /categories/{id}   { allow read: if true; allow write: if isAdmin(); }
    match /items/{id}        { allow read: if true; allow write: if isAdmin(); }
    match /testimonials/{id} { allow read: if true; allow write: if isAdmin(); }
    match /blogPosts/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /gallery/{id}      { allow read: if true; allow write: if isAdmin(); }
    match /siteSettings/{id} { allow read: if true; allow write: if isAdmin(); }
    match /enquiries/{id} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
  }
}
```

*To deploy via Firebase CLI*:
```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

---

## ☁️ Cloudinary Upload Configurations

All media uploads inside the Admin Panel (Items, Gallery) are uploaded directly to Cloudinary.
- **Upload preset name**: `rangiri-iron-works` (unsigned upload mode).
- **Target folder**: `/rangiri-iron-works`.
- **Optimization**: Rendered utilizing dynamic Cloudinary filters (`f_auto, q_auto`) to ensure minimal loading times on mobile devices across Sri Lanka.

---

## 🚀 Production Deployment (Vercel)

1. Push your repository to your GitHub/GitLab profile.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **New Project** -> **Import**.
3. Set the **Build Command** to `npm run build` and **Install Command** to `npm install`.
4. Add the environment variables from `.env.local` inside **Project Settings** -> **Environment Variables**.
5. Click **Deploy**. Vercel will build and host your bilingual website with automated SSL configurations.
