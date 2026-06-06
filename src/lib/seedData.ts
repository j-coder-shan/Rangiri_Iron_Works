// src/lib/seedData.ts
import { Category, Item, Testimonial, SiteSettings, BlogPost } from '@/types';

export const seedCategories: Category[] = [
  {
    id: 'cat-1',
    nameEn: 'Iron Fabrication Services',
    nameSi: 'යකඩ නිෂ්පාදන හා සැකසුම් සේවා',
    slug: 'iron-fabrication',
    icon: 'Wrench',
    descriptionEn: 'Custom iron fabrication — gates, grills, railings, roofing structures, and more.',
    descriptionSi: 'අභිරුචි යකඩ නිෂ්පාදන — ගේට්ටු, ග්‍රිල්, රේලිං, වහල ව්‍යුහ සහ තවත්.',
    coverImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    nameEn: 'Iron Painting Services',
    nameSi: 'යකඩ පින්තාරු සේවා',
    slug: 'iron-painting',
    icon: 'Paintbrush',
    descriptionEn: 'Professional metal painting — rust protection, anti-corrosion coating, spray painting.',
    descriptionSi: 'වෘත්තීය ලෝහ පින්තාරු — මලකඩ ආරක්ෂාව, විරෝධී ආලේපන, ස්ප්‍රේ පින්තාරු.',
    coverImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    nameEn: 'Vehicle Painting Services',
    nameSi: 'වාහන පින්තාරු සේවා',
    slug: 'vehicle-painting',
    icon: 'Car',
    descriptionEn: 'Full vehicle repaints, dent repair, touch-up painting for cars, vans, jeeps, and three-wheelers.',
    descriptionSi: 'සම්පූර්ණ වාහන නැවත පින්තාරු, ඩෙන්ට් අලුත්වැඩියා, කාර්, වෑන්, ජීප්, ත්‍රිරෝද රථ.',
    coverImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    nameEn: 'Vehicle Canopy Services',
    nameSi: 'වාහන කැනොපි සේවා',
    slug: 'vehicle-canopies',
    icon: 'Truck',
    descriptionEn: 'Custom canopies for safari jeeps, boleros, pickups — aluminium and steel options.',
    descriptionSi: 'සෆාරි ජීප්, බොලේරෝ, පිකප් සඳහා කැනොපි — ඇලුමිනියම් සහ වානේ.',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    nameEn: 'Three Wheeler Repairs',
    nameSi: 'ත්‍රිරෝද රථ අලුත්වැඩියා',
    slug: 'three-wheeler-repairs',
    icon: 'Zap',
    descriptionEn: 'Body repair, chassis welding, painting, and full restoration for three-wheelers (tuk-tuks).',
    descriptionSi: 'ත්‍රිරෝද රථ සඳහා බොඩි අලුත්වැඩියා, චැසි වෙල්ඩිං, පින්තාරු, සම්පූර්ණ ප්‍රතිසංස්කරණය.',
    coverImage: 'https://images.unsplash.com/photo-1561131756-78e2448378a9?auto=format&fit=crop&w=800&q=80',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-6',
    nameEn: 'Repair & Maintenance',
    nameSi: 'අලුත්වැඩියා සහ නඩත්තු',
    slug: 'repair-maintenance',
    icon: 'Settings',
    descriptionEn: 'Gate repairs, rust removal, structural reinforcement, welding repairs, and maintenance contracts.',
    descriptionSi: 'ගේට්ටු අලුත්වැඩියා, මලකඩ ඉවත් කිරීම, ව්‍යුහ ශක්තිමත් කිරීම, නඩත්තු ගිවිසුම්.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: 't-1',
    nameEn: 'Kalinga Perera',
    nameSi: 'කාලිංග පෙරේරා',
    locationEn: 'Dambulla',
    locationSi: 'දඹුල්ල',
    serviceEn: 'Sliding Gate Fabrication',
    serviceSi: 'ස්ලයිඩින් ගේට්ටු නිෂ්පාදනය',
    reviewEn: 'Highly satisfied with the sliding gate they made for my house. Excellent strength and beautiful design. The work was completed on time.',
    reviewSi: 'මගේ නිවසට සාදා දුන් ස්ලයිඩින් ගේට්ටුව ගැන ඉතාමත් සතුටුයි. විශිෂ්ට ශක්තිමත් බවක් සහ ලස්සන මෝස්තරයක්. නියමිත වේලාවට වැඩ අවසන් කර දුන්නා.',
    rating: 5,
    avatarInitials: 'KP',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    nameEn: 'Samantha Jayasinghe',
    nameSi: 'සමන්තා ජයසිංහ',
    locationEn: 'Sigiriya',
    locationSi: 'සීගිරිය',
    serviceEn: 'Safari Jeep Canopy',
    serviceSi: 'සෆාරි ජීප් රථ කැනොපි සේවාව',
    reviewEn: 'Best place in Dambulla for safari jeep modifications. The aluminum canopy is lightweight and strong. Highly recommended!',
    reviewSi: 'සෆාරි ජීප් රථ වෙනස් කිරීම සඳහා දඹුල්ලේ හොඳම ස්ථානය. ඇලුමිනියම් කැනොපිය බරින් අඩු මෙන්ම ඉතා ශක්තිමත්. ඉතා ඉහළින්ම නිර්දේශ කරනවා!',
    rating: 5,
    avatarInitials: 'SJ',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    nameEn: 'Rohan Devapriya',
    nameSi: 'රොහාන් දේවප්‍රිය',
    locationEn: 'Kandy',
    locationSi: 'මහනුවර',
    serviceEn: 'Three Wheeler Full Restoration',
    serviceSi: 'ත්‍රිරෝද රථ සම්පූර්ණ ප්‍රතිසංස්කරණය',
    reviewEn: 'Gave my old tuk-tuk for body repair and painting. Now it looks brand new. The paint job has a premium gloss finish.',
    reviewSi: 'මගේ පැරණි ත්‍රිරෝද රථය බොඩි අලුත්වැඩියාවට සහ පින්තාරු කිරීමට ලබා දුන්නා. දැන් එය අලුත්ම එකක් වගේ. පින්තාරු කිරීමේ නිමාව ඉතා ඉහළ මට්ටමක පවතිනවා.',
    rating: 5,
    avatarInitials: 'RD',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Helper to generate the 60 items (10 per category)
export function generateSeedItems(): Item[] {
  const items: Item[] = [];

  // 1. IRON FABRICATION (IF) - 10 items
  const cat1Items = [
    { nameEn: 'Modern Sliding Gate', nameSi: 'නවීන ස්ලයිඩින් ගේට්ටුව', featured: true },
    { nameEn: 'Wrought Iron Swing Gate', nameSi: 'රොට් අයන් ස්වින්ග් ගේට්ටුව', featured: true },
    { nameEn: 'Decorative Window Grills', nameSi: 'අලංකාර ජනෙල් ග්‍රිල්', featured: false },
    { nameEn: 'Stainless Steel Stair Railing', nameSi: 'ස්ටේන්ලස් ස්ටීල් පඩිපෙළ රේලිං', featured: false },
    { nameEn: 'Heavy-Duty Warehouse Roof Structure', nameSi: 'ගබඩා කාමර සඳහා ශක්තිමත් වහල ව්‍යුහය', featured: false },
    { nameEn: 'Industrial Steel Door', nameSi: 'කාර්මික වානේ දොර', featured: false },
    { nameEn: 'Balcony Safety Railings', nameSi: 'බැල්කනි ආරක්ෂිත රේලිං', featured: false },
    { nameEn: 'Water Tank Steel Stand', nameSi: 'වතුර ටැංකි සඳහා වානේ ස්ටෑන්ඩ්', featured: false },
    { nameEn: 'Security Metal Cages', nameSi: 'ආරක්ෂිත ලෝහ කූඩු', featured: false },
    { nameEn: 'Metal Patio Garden Table Set', nameSi: 'මිදුල සඳහා ලෝහ මේස සහ පුටු කට්ටලය', featured: false },
  ];
  cat1Items.forEach((it, i) => {
    const idx = i + 1;
    items.push({
      id: `item-if-${idx}`,
      code: `RIW-IF-${String(idx).padStart(4, '0')}`,
      categoryId: 'cat-1',
      categorySlug: 'iron-fabrication',
      nameEn: it.nameEn,
      nameSi: it.nameSi,
      descriptionEn: `Premium custom ${it.nameEn.toLowerCase()} fabricated with high-quality carbon steel. Engineered for weather resistance, durability, and smooth mechanical function. Made to order based on client site measurements.`,
      descriptionSi: `උසස් තත්ත්වයේ කාබන් වානේ භාවිතයෙන් නිමවූ උසස් තත්ත්වයේ ${it.nameSi}. කාලගුණයට ඔරොත්තු දෙන ලෙස, කල් පැවැත්ම සහ සුමට ක්‍රියාකාරිත්වය සඳහාම නිපදවා ඇත. සේවාදායකයාගේ මිනුම් අනුව ඇණවුමට සකස් කර දෙනු ලැබේ.`,
      features: ['Heavy-gauge galvanised steel structure', 'Rust-inhibitive primer pre-coat', 'Precision mig welded seams', 'Custom dimensions and lock fittings'],
      featuresSi: ['ඝන ගැල්වනයිස් කරන ලද වානේ ව්‍යුහය', 'මලකඩ වළක්වන ප්‍රාථමික ආලේපනය', 'නිරවද්‍ය මිග් (MIG) වෙල්ඩිං නිමාව', 'අභිරුචි මානයන් සහ අගුල් සවි කිරීම්'],
      images: [
        `https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=600&q=80`
      ],
      isFeatured: it.featured,
      isActive: true,
      order: idx,
      createdAt: new Date().toISOString(),
    });
  });

  // 2. IRON PAINTING (IP) - 10 items
  const cat2Items = [
    { nameEn: 'Anti-Corrosive Red Oxide Coating', nameSi: 'මලකඩ වළක්වන රෙඩ් ඔක්සයිඩ් ආලේපනය', featured: true },
    { nameEn: 'Premium Polyurethane Gloss Coating', nameSi: 'පොලියුරේතන් (PU) දිලිසෙන ආලේපනය', featured: false },
    { nameEn: 'Matte Black Fence Spray Painting', nameSi: 'වැටවල් සඳහා මැට් කළු ස්ප්‍රේ පින්තාරුව', featured: false },
    { nameEn: 'Gold Detailing Highlight Painting', nameSi: 'රන්වන් පැහැති විස්තරාත්මක පින්තාරුව', featured: false },
    { nameEn: 'Gate Complete Rust Removal & Repaint', nameSi: 'ගේට්ටු සම්පූර්ණ මලකඩ හැරීම සහ නැවත පින්තාරුව', featured: true },
    { nameEn: 'Outdoor Furniture Weatherproofing', nameSi: 'එළිමහන් ගෘහභාණ්ඩ කාලගුණ ප්‍රතිරෝධී පින්තාරුව', featured: false },
    { nameEn: 'Steel Roof Structure Protection Coat', nameSi: 'වානේ වහල ව්‍යුහයන් සඳහා ආරක්ෂිත ආලේපන', featured: false },
    { nameEn: 'Industrial Machinery Metal Finishing', nameSi: 'කාර්මික යන්ත්‍රෝපකරණ ලෝහ නිමවුම් පින්තාරුව', featured: false },
    { nameEn: 'Epoxy Anti-Rust Floor & Rack Coat', nameSi: 'ඉපොක්සි මලකඩ විරෝධී රැක් සහ බිම් ආලේපනය', featured: false },
    { nameEn: 'Textured Hammer Finish Metal Paint', nameSi: 'හැමර් ෆිනිෂ් ලෝහ පින්තාරුව', featured: false },
  ];
  cat2Items.forEach((it, i) => {
    const idx = i + 1;
    items.push({
      id: `item-ip-${idx}`,
      code: `RIW-IP-${String(idx).padStart(4, '0')}`,
      categoryId: 'cat-2',
      categorySlug: 'iron-painting',
      nameEn: it.nameEn,
      nameSi: it.nameSi,
      descriptionEn: `Professional metal finishing using ${it.nameEn.toLowerCase()}. Protects iron items from moisture, humidity, and atmospheric rust. Ideal for Dambulla's seasonal weather.`,
      descriptionSi: `${it.nameSi} භාවිතයෙන් සිදු කරන වෘත්තීය ලෝහ නිමවුම් සේවාව. තෙතමනය සහ වායුගෝලීය තත්ත්ව නිසා සිදුවන මලකඩ කෑමෙන් ලෝහ භාණ්ඩ ආරක්ෂා කරයි. දඹුල්ලේ පවතින දේශගුණයට ඉතා යෝග්‍ය වේ.`,
      features: ['Rust scraping and surface preparation included', 'Dual-coat application for durability', 'High-quality weather-resistant paint brands', 'UV protection layer overlay'],
      featuresSi: ['මලකඩ සූරා මතුපිට සකස් කිරීම ඇතුළත් වේ', 'කල් පැවැත්ම සඳහා ද්විත්ව ආලේපනය', 'උසස් තත්ත්වයේ දේශගුණ ප්‍රතිරෝධී තීන්ත', 'හිරු එළියෙන් සිදුවන හානිය වළක්වන (UV) ස්ථරය'],
      images: [
        `https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80`
      ],
      isFeatured: it.featured,
      isActive: true,
      order: idx,
      createdAt: new Date().toISOString(),
    });
  });

  // 3. VEHICLE PAINTING (VP) - 10 items
  const cat3Items = [
    { nameEn: 'Full Car Paint Restoration', nameSi: 'මෝටර් රථ සම්පූර්ණ පින්තාරු ප්‍රතිසංස්කරණය', featured: true },
    { nameEn: 'Dent Repair & Spot Spray Painting', nameSi: 'ඩෙන්ට් අලුත්වැඩියාව සහ සීරීම් පින්තාරුව', featured: true },
    { nameEn: 'Bumper Scratch Paint Repair', nameSi: 'බෆර් සීරීම් පින්තාරු අලුත්වැඩියාව', featured: false },
    { nameEn: 'Alloy Wheel Custom Color Spray', nameSi: 'ඇලෝයි වීල් සඳහා අභිරුචි වර්ණ ස්ප්‍රේ කිරීම', featured: false },
    { nameEn: 'Undercarriage Anti-Corrosion Spray', nameSi: 'යටි පතුල මලකඩ විරෝධී ආරක්ෂණ ආලේපනය', featured: false },
    { nameEn: 'Van Complete Color Change Paint Job', nameSi: 'වෑන් රථ සම්පූර්ණ වර්ණ වෙනස් කිරීමේ පින්තාරුව', featured: false },
    { nameEn: 'Safari Jeep Exterior Mud Painting', nameSi: 'සෆාරි ජීප් රථ බාහිර පින්තාරු සේවාව', featured: false },
    { nameEn: 'Premium Clear Coat Gloss Polish', nameSi: 'ප්‍රිමියම් ක්ලියර් කෝට් දිලිසෙන ආලේපනය', featured: false },
    { nameEn: 'Motorbike Fuel Tank Custom Design Paint', nameSi: 'මෝටර් සයිකල් ටැංකි සරසා පින්තාරු කිරීම', featured: false },
    { nameEn: 'Commercial Vehicle Cab Painting', nameSi: 'වාණිජ ලොරි රථ කැබින් පින්තාරුව', featured: false },
  ];
  cat3Items.forEach((it, i) => {
    const idx = i + 1;
    items.push({
      id: `item-vp-${idx}`,
      code: `RIW-VP-${String(idx).padStart(4, '0')}`,
      categoryId: 'cat-3',
      categorySlug: 'vehicle-painting',
      nameEn: it.nameEn,
      nameSi: it.nameSi,
      descriptionEn: `High-quality vehicle painting services including ${it.nameEn.toLowerCase()}. Utilizes modern spray booths and dual-stage polyurethane automotive paint for a factory-grade finish.`,
      descriptionSi: `${it.nameSi} ඇතුළු උසස් තත්ත්වයේ වාහන පින්තාරු කිරීමේ සේවා. කර්මාන්තශාලා මට්ටමේ නිමාවක් ලබා ගැනීම සඳහා නවීන ස්ප්‍රේ කුටි සහ උසස් මෝටර් රථ තීන්ත වර්ග භාවිත කරයි.`,
      features: ['2K lacquer system for deep gloss', 'Computerised color matching', 'Dent pulling and body filler smoothing', 'Rust protection base treatment'],
      featuresSi: ['දිගුකාලීන දීප්තිය සඳහා 2K ලැකර් පද්ධතිය', 'පරිගණක ආශ්‍රිත නිවැරදි වර්ණ ගැළපීම', 'ඩෙන්ට් හැරීම සහ බොඩි ෆිලර් නිමාව', 'මලකඩ ආරක්ෂණ මූලික ප්‍රතිකාර'],
      images: [
        `https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80`
      ],
      isFeatured: it.featured,
      isActive: true,
      order: idx,
      createdAt: new Date().toISOString(),
    });
  });

  // 4. VEHICLE CANOPIES (VC) - 10 items
  const cat4Items = [
    { nameEn: 'Safari Jeep Open Canvas Canopy', nameSi: 'සෆාරි ජීප් රථ සඳහා විවෘත කැන්වස් කැනොපිය', featured: true },
    { nameEn: 'Mahindra Bolero Steel Delivery Canopy', nameSi: 'මහින්ද්‍රා බොලෙරෝ වානේ ඩිලිවරි කැනොපිය', featured: true },
    { nameEn: 'Toyota Hilux Aluminium Box Canopy', nameSi: 'ටොයෝටා හයිලක්ස් ඇලුමිනියම් බොක්ස් කැනොපිය', featured: false },
    { nameEn: 'Double Cab Canvas Folding Canopy', nameSi: 'ඩබල් කැබ් සඳහා නවන කැන්වස් කැනොපිය', featured: false },
    { nameEn: 'Pickup Truck High-Roof Metal Canopy', nameSi: 'පිකප් රථ සඳහා උස් වහල ලෝහ කැනොපිය', featured: false },
    { nameEn: 'Agricultural Vehicle Rain Canopy Cover', nameSi: 'කෘෂිකාර්මික වාහන වැසි ආරක්ෂිත කැනොපිය', featured: false },
    { nameEn: 'Custom Jeep Roll Cage & Frame Work', nameSi: 'අභිරුචි ජීප් රෝල් කේජ් සහ ෆ්‍රේම් වැඩ', featured: false },
    { nameEn: 'Stainless Steel Cargo Frame for Pickups', nameSi: 'ස්ටේන්ලස් ස්ටීල් බඩු පටවන ෆ්‍රේම්', featured: false },
    { nameEn: 'Tourist Safari Jeep Removable Hood', nameSi: 'සංචාරක සෆාරි ජීප් ගැලවිය හැකි හුඩ් එක', featured: false },
    { nameEn: 'Specialised Delivery Truck Box Canopy', nameSi: 'ඩිලිවරි ලොරි සඳහා විශේෂිත පෙට්ටි කැනොපිය', featured: false },
  ];
  cat4Items.forEach((it, i) => {
    const idx = i + 1;
    items.push({
      id: `item-vc-${idx}`,
      code: `RIW-VC-${String(idx).padStart(4, '0')}`,
      categoryId: 'cat-4',
      categorySlug: 'vehicle-canopies',
      nameEn: it.nameEn,
      nameSi: it.nameSi,
      descriptionEn: `Custom fabricated ${it.nameEn.toLowerCase()} designed for heavy utility, cargo protection, and passenger safety. Ideal for tour operators in Sigiriya/Minneriya and distribution vehicles.`,
      descriptionSi: `භාණ්ඩ ආරක්ෂාව, මගී ආරක්ෂාව සහ දැඩි භාවිතය සඳහාම නිපදවන ලද ${it.nameSi}. සීගිරිය/මින්නේරිය සංචාරක ජීප් රථ සහ බෙදාහැරීමේ රථ සඳහා ඉතා යෝග්‍ය වේ.`,
      features: ['High-tensile steel or structural aluminium build', 'Heavy-duty water-repellent canvas material', 'Bolt-on installation (no chassis modifications required)', 'Integrates seat frames and luggage racks'],
      featuresSi: ['ශක්තිමත් වානේ හෝ ඇලුමිනියම් ව්‍යුහය', 'ජල ප්‍රතිරෝධී ඝන කැන්වස් රෙදි', 'බෝල්ට් ඇණ මඟින් සවි කිරීම (චැසියට හානි නොවේ)', 'ආසන රාමු සහ බඩු රාක්ක ඇතුළත් කිරීමේ හැකියාව'],
      images: [
        `https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1533559662493-4403960f2012?auto=format&fit=crop&w=600&q=80`
      ],
      isFeatured: it.featured,
      isActive: true,
      order: idx,
      createdAt: new Date().toISOString(),
    });
  });

  // 5. THREE WHEELER REPAIRS (TW) - 10 items
  const cat5Items = [
    { nameEn: 'Tuk-Tuk Full Chassis Welding & Reinforcement', nameSi: 'ත්‍රිරෝද රථ චැසි වෙල්ඩිං සහ ශක්තිමත් කිරීම', featured: true },
    { nameEn: 'Three Wheeler Floorboard Sheet Replacement', nameSi: 'ත්‍රිරෝද රථයේ පතුල තහඩු මාරු කිරීම', featured: true },
    { nameEn: 'Tuk-Tuk Mudguard Denting & Paint Job', nameSi: 'ත්‍රිරෝද රථ මඩ්ගාඩ් ඩෙන්ට් හැරීම සහ පින්තාරුව', featured: false },
    { nameEn: 'Complete Body Shell Dent Repair', nameSi: 'බොඩි ෂෙල් සම්පූර්ණ ඩෙන්ට් අලුත්වැඩියාව', featured: false },
    { nameEn: 'Tuk-Tuk Passenger Seat Frame Fabrication', nameSi: 'පසුපස ආසන රාමුව අලුතින් නිෂ්පාදනය', featured: false },
    { nameEn: 'Rickshaw Canvas Hood Frame Welding', nameSi: 'කැන්වස් හුඩ් රාමුව වෙල්ඩිං කිරීම', featured: false },
    { nameEn: 'Front Windshield Frame Complete Replacement', nameSi: 'ඉදිරිපස වින්ඩ්ශීල්ඩ් ෆ්‍රේම් එක අලුතින් දැමීම', featured: false },
    { nameEn: 'Three Wheeler Full Exterior Repainting', nameSi: 'ත්‍රිරෝද රථය සම්පූර්ණ බාහිර නැවත පින්තාරුව', featured: false },
    { nameEn: 'Stainless Steel Tuk Bumper Welding', nameSi: 'මල නොබැඳෙන වානේ ත්‍රිරෝද බෆර් වෙල්ඩිං', featured: false },
    { nameEn: 'Under-Seat Tool Box Fabrication', nameSi: 'ආසනය යට අමතර මෙවලම් පෙට්ටිය සෑදීම', featured: false },
  ];
  cat5Items.forEach((it, i) => {
    const idx = i + 1;
    items.push({
      id: `item-tw-${idx}`,
      code: `RIW-TW-${String(idx).padStart(4, '0')}`,
      categoryId: 'cat-5',
      categorySlug: 'three-wheeler-repairs',
      nameEn: it.nameEn,
      nameSi: it.nameSi,
      descriptionEn: `Specialized body and chassis repair services for Piaggio and Bajaj three-wheelers (tuk-tuks) including ${it.nameEn.toLowerCase()}. Repairs structural damage from accidents and environmental rust.`,
      descriptionSi: `පියාජියෝ (Piaggio) සහ බජාජ් (Bajaj) ත්‍රිරෝද රථ සඳහා විශේෂිත බොඩි සහ චැසි අලුත්වැඩියා සේවා. අනතුරු හෝ මලකඩ නිසා සිදුවන ව්‍යුහාත්මක හානි යථා තත්ත්වයට පත් කෙරේ.`,
      features: ['Rust-proof zinc-coated sheet metal use', 'Original paint-code color match guaranteed', 'Chassis alignment using precision jigs', 'Accident repair insurance estimates supported'],
      featuresSi: ['මලකඩ නොකන සින්ක් ආලේපිත තහඩු භාවිතය', 'නිවැරදි සමාන වර්ණ ගැළපීම පිළිබඳ වගකීම', 'චැසිය නිසි පරිදි පෙළගැස්වීම', 'අනතුරු අලුත්වැඩියා සඳහා රක්ෂණ ඇස්තමේන්තු ලබාදීම'],
      images: [
        `https://images.unsplash.com/photo-1561131756-78e2448378a9?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80`
      ],
      isFeatured: it.featured,
      isActive: true,
      order: idx,
      createdAt: new Date().toISOString(),
    });
  });

  // 6. REPAIR & MAINTENANCE (RM) - 10 items
  const cat6Items = [
    { nameEn: 'Sliding Gate Roller Wheel Replacement', nameSi: 'ස්ලයිඩින් ගේට්ටු රෝද මාරු කිරීමේ සේවාව', featured: true },
    { nameEn: 'Iron Gate Hinges Welding Repair', nameSi: 'යකඩ ගේට්ටු සරනේරු වෙල්ඩිං අලුත්වැඩියාව', featured: false },
    { nameEn: 'Staircase Handrail Stabilization & Repair', nameSi: 'පඩිපෙළ අත්වැල් සවිමත් කිරීම සහ අලුත්වැඩියාව', featured: false },
    { nameEn: 'Roof Leak Repair & Sheet Replacement', nameSi: 'වහල කාන්දු වැළැක්වීම සහ තහඩු මාරු කිරීම', featured: false },
    { nameEn: 'Fence Structural Reinforcement & Repair', nameSi: 'වැටවල් ශක්තිමත් කිරීම සහ අලුත්වැඩියාව', featured: false },
    { nameEn: 'Heavy Equipment Structural Welding', nameSi: 'බර යන්ත්‍රෝපකරණ ව්‍යුහාත්මක වෙල්ඩිං සේවාව', featured: false },
    { nameEn: 'Door Security Lock Installation & Welding', nameSi: 'දොරවල් සඳහා ආරක්ෂිත අගුල් සවි කිරීම', featured: false },
    { nameEn: 'Rust Cutting & Metal Patch Repair', nameSi: 'මලකඩ කෑ කොටස් කපා ඉවත් කර පියවීම', featured: true },
    { nameEn: 'Steel Water Stand Height Adjustment', nameSi: 'වතුර ටැංකි ස්ටෑන්ඩ් උස සකස් කිරීම', featured: false },
    { nameEn: 'Periodic General Gate Servicing', nameSi: 'ගේට්ටු සඳහා වාරික පොදු නඩත්තු සේවාව', featured: false },
  ];
  cat6Items.forEach((it, i) => {
    const idx = i + 1;
    items.push({
      id: `item-rm-${idx}`,
      code: `RIW-RM-${String(idx).padStart(4, '0')}`,
      categoryId: 'cat-6',
      categorySlug: 'repair-maintenance',
      nameEn: it.nameEn,
      nameSi: it.nameSi,
      descriptionEn: `On-site or workshop-based repair and maintenance services for iron installations, including ${it.nameEn.toLowerCase()}. Restores safety, structural integrity, and ease of use to older gates and frames.`,
      descriptionSi: `යකඩ නිෂ්පාදන සඳහා ස්ථානීය හෝ වැඩපල මට්ටමින් සිදුකරන අලුත්වැඩියා සහ නඩත්තු සේවා. පැරණි ගේට්ටු සහ රාමු වල ආරක්ෂාව සහ ශක්තිමත් බව නැවත ලබා දේ.`,
      features: ['Quick response for emergency gate repairs', 'High-durability replacement parts and rollers', 'Precision welding on-site with portable units', 'Complete structural integrity checkup'],
      featuresSi: ['හදිසි ගේට්ටු අලුත්වැඩියා සඳහා ඉක්මන් පැමිණීම', 'දිගුකාලීන කල්පැවැත්ම සහිත රෝද සහ අමතර කොටස්', 'ජංගම යන්ත්‍ර මඟින් ස්ථානීයව සිදුකරන වෙල්ඩිං සේවා', 'සම්පූර්ණ ව්‍යුහාත්මක ශක්තිය පරීක්ෂා කිරීම'],
      images: [
        `https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=600&q=80`,
        `https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80`
      ],
      isFeatured: it.featured,
      isActive: true,
      order: idx,
      createdAt: new Date().toISOString(),
    });
  });

  return items;
}

export const seedBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'how-to-choose-the-right-iron-gate',
    titleEn: 'How to Choose the Right Iron Gate for Your Home',
    titleSi: 'ගෙදරට සුදුසු යකඩ ගේට්ටුව තෝරා ගන්නේ කෙසේද?',
    excerptEn: 'An essential guide to selecting the best metal gate for Sri Lankan homes, considering security, style, and rust protection.',
    excerptSi: 'ගේට්ටුවක් තේරීමේදී සැලකිලිමත් විය යුතු කරුණු - ආරක්ෂාව, මෝස්තරය සහ මලකඩ ආරක්ෂාව පිළිබඳව සවිස්තරාත්මක මඟපෙන්වීමක්.',
    coverImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    tags: ['Gates', 'Fabrication', 'Home Design'],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    contentEn: `# Choosing the Perfect Iron Gate

A house gate is not just a security barrier; it is the first impression of your home. When selecting an iron gate for Sri Lankan conditions, consider these key elements:

## 1. Sliding vs. Swing Gates
- **Sliding Gates:** Perfect for properties with short driveways or slopes. They slide horizontally along a track, saving space.
- **Swing Gates:** Classically beautiful, but require ample inward space to swing open.

## 2. Rust Protection (Essential for Sri Lanka)
Dambulla and the central region experience high heat and seasonal humidity. Ensure your gate uses **Galvanised Iron (GI)** pipes rather than black steel, and is coated with an **anti-corrosive red oxide primer** before final coat spray painting.

## 3. Automation Preparedness
If you plan to install an automatic remote motor later, inform your metal fabricator. Sliding gates require heavy-duty bottom wheels and alignment to support electric rack systems.

Contact Rangiri Iron Works to discuss your custom gate design today!`,
    contentSi: `# ඔබේ නිවසට ගැලපෙන හොඳම යකඩ ගේට්ටුව තෝරා ගැනීම

ගේට්ටුවක් යනු ඔබේ නිවසේ ආරක්ෂාව මෙන්ම එහි සුන්දරත්වය කියාපාන ප්‍රධානතම අංගයකි. ශ්‍රී ලංකාවේ දේශගුණයට ගැලපෙන පරිදි ගේට්ටුවක් තෝරා ගැනීමේදී පහත කරුණු ගැන සැලකිලිමත් වන්න:

## 1. ස්ලයිඩින් (Sliding) සහ ස්වින්ග් (Swing) ගේට්ටු
- **ස්ලයිඩින් ගේට්ටු:** ඉඩකඩ සීමිත හෝ බෑවුම් සහිත බිම් සඳහා ඉතා සුදුසුය. මේවා පැත්තකට ලිස්සා යන බැවින් ඉඩ ඉතිරි වේ.
- **ස්වින්ග් ගේට්ටු:** සම්ප්‍රදායිකව ලස්සන නමුත් ගේට්ටුව ඇරීමට ඉදිරියෙන් විශාල ඉඩක් අවශ්‍ය වේ.

## 2. මලකඩ කෑමෙන් ආරක්ෂා කිරීම
ලංකාවේ පවතින තෙතමනය සහිත දේශගුණය නිසා යකඩ ඉක්මනින් මලකඩ කෑමට ලක්වේ. මේ නිසා ගේට්ටුව සෑදීමට **ගැල්වනයිස් (GI)** බට භාවිතා කිරීම සහ පින්තාරු කිරීමට පෙර **මලකඩ විරෝධී ප්‍රාථමික ආලේපනයක් (Anti-corrosive Red Oxide)** ගැල්වීම අනිවාර්ය වේ.

## 3. ස්වයංක්‍රීය මෝටර් සවි කිරීම
ඔබ අනාගතයේදී රිමෝට් මෝටරයක් සවි කිරීමට බලාපොරොත්තු වන්නේ නම්, ගේට්ටුව හදන අවස්ථාවේදීම ඒ පිළිබඳව දැනුම් දෙන්න. ස්ලයිඩින් ගේට්ටු වල රෝද සහ රාමුව මෝටරයට ගැලපෙන පරිදි ශක්තිමත්ව සැකසිය යුතුය.

ඔබේ නිවසටම ගැලපෙන අලංකාර ගේට්ටුවක් සාදා ගැනීමට අදම රංගිරි යකඩ වැඩ ආයතනය අමතන්න!`,
  },
  {
    id: 'post-2',
    slug: 'safari-jeep-canopy-maintenance-tips',
    titleEn: 'Safari Jeep Canopy Maintenance Tips',
    titleSi: 'සෆාරි ජීප් රථ කැනොපි නඩත්තු කිරීමට උපදෙස්',
    excerptEn: 'Prolong the life of your tourist safari jeep canopy structure and waterproof canvas. Essential tips for Sigiriya jeep owners.',
    excerptSi: 'සෆාරි ජීප් රථ වල කැනොපි සහ කැන්වස් වහලවල් දිගුකාලීනව නඩත්තු කර ආරක්ෂා කරගන්නා ආකාරය පිළිබඳව උපදෙස් කිහිපයක්.',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    tags: ['Jeep', 'Canopies', 'Maintenance'],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    contentEn: `# Maintaining Your Safari Jeep Canopy

For tourist safari jeep operators in Sigiriya, Minneriya, and Dambulla, the jeep is the livelihood. Sun, rain, and low-hanging branches in national parks put heavy strain on canopies.

## 1. Clean Canvas Tops Correctly
- Never use harsh chemicals or petrol to clean your waterproof canvas hood.
- Use mild soap, warm water, and a soft brush to scrub off forest dust and mud.

## 2. Check Weld Joints Regularly
Safari tracks have deep ruts causing heavy vibrations. Frequently inspect the roll-bar joints and mounting bolts attaching the canopy to the jeep bed. If you spot micro-cracks, get them reinforced immediately.

## 3. Repaint Metal Frames
Scratches from tree branches expose raw metal to rain, initiating rust. Keep a spray can of matching color or touch-up paint to seal scratches before they rust the frame.

Visit Rangiri Iron Works for professional safari canopy modifications and steel cage welding.`,
    contentSi: `# සෆාරි ජීප් රථ වල කැනොපිය නිසි පරිදි නඩත්තු කිරීම

සීගිරිය, මින්නේරිය සහ දඹුල්ල ප්‍රදේශවල සෆාරි ජීප් රථ ධාවනය කරන ඔබගේ ජීප් රථය ඔබගේ ජීවනෝපාය වේ. වනෝද්‍යාන තුල ධාවනයේදී ගස් කොළන් වල ගැටීම සහ දැඩි අව් රශ්මිය නිසා කැනොපියට හානි සිදුවිය හැක.

## 1. කැන්වස් වහලය පිරිසිදු කිරීම
- කැන්වස් හුඩ් එක පිරිසිදු කිරීමට පෙට්‍රල් හෝ සැර රසායනික ද්‍රව්‍ය භාවිතා නොකරන්න.
- මෘදු සබන් සහ වතුර භාවිතා කර මෘදු බුරුසුවකින් කුණු සහ මඩ සෝදා හරින්න.

## 2. වෙල්ඩිං සන්ධි පරීක්ෂා කිරීම
වනෝද්‍යාන තුල ඇති අසමාන මාර්ග නිසා වාහනය අධික ලෙස ගැස්සීමට ලක්වේ. මේ නිසා කැනොපි රාමුවේ සන්ධි වල ඉරිතැලීම් තිබේදැයි නිතර පරීක්ෂා කරන්න. ඉරිතැලීමක් දුටුවහොත් වහාම එය වෙල්ඩිං කර ශක්තිමත් කරගන්න.

## 3. සීරීම් පින්තාරු කිරීම
ගස් අතු වල ගැටීමෙන් සිදුවන සීරීම් නිසා යකඩ මතුවී මලකඩ කෑමට පටන් ගනී. සීරීම් දුටු සැනින් ඒවා නැවත තීන්ත ආලේප කර වසා දැමීමෙන් මුළු රාමුවම ආරක්ෂා වේ.

නවීන පන්නයේ සෆාරි කැනොපි සැකසීමට සහ ශක්තිමත් ලෝහ රාමු නිර්මාණයට අදම රංගිරි යකඩ වැඩ වෙත පැමිණෙන්න.`,
  },
  {
    id: 'post-3',
    slug: '5-signs-your-vehicle-needs-repaint',
    titleEn: '5 Signs Your Vehicle Needs a Full Repaint',
    titleSi: 'ඔබේ වාහනය නැවත පින්තාරු කළ යුතු බව කියන ලක්ෂණ 5',
    excerptEn: 'Fading gloss, deep scratches, or structural rust? Discover when to invest in a complete professional auto spray painting job.',
    excerptSi: 'තීන්ත මැකී යාම, සීරීම් සහ මලකඩ කෑම? ඔබේ වාහනය සම්පූර්ණයෙන්ම පින්තාරු කිරීමට නියමිත කාලය පැමිණ ඇත්දැයි හඳුනා ගන්න.',
    coverImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    tags: ['Vehicle Painting', 'Auto Maintenance'],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    contentEn: `# When is it Time for a Full Vehicle Repaint?

Is your car or three-wheeler losing its sparkle? Here are 5 signs that a touch-up is no longer enough:

1. **Clear Coat Peeling:** When the protective clear coat flakes off, the underlying paint is vulnerable to water and sun.
2. **Deep Scratching & Rust spots:** Scratches that go through to the metal will rust quickly if not treated.
3. **Faded Paint Color:** Constant exposure to Sri Lankan sun fades paint pigment, reducing the vehicle's resale value.
4. **Bubbling Paint:** This is a sign of rust forming *under* the paint shell. It requires immediate scraping and patching.
5. **Post-Accident Body Repairs:** Major body filler work must be sealed with professional multi-coat paint matching.

Rangiri Iron Works provides state-of-the-art vehicle spray painting with computerized color matching in Dambulla.`,
    contentSi: `# ඔබේ වාහනය නැවත පින්තාරු කිරීමට කාලය පැමිණ ඇති බව හඳුනා ගන්නේ කෙසේද?

ඔබේ මෝටර් රථයේ හෝ ත්‍රිරෝද රථයේ තීන්ත අවපැහැ ගැන්වී තිබේද? නැවත සම්පූර්ණයෙන් පින්තාරු කිරීමට කාලය පැමිණ ඇති බව පෙන්වන ලක්ෂණ 5ක් මෙන්න:

1. **ක්ලියර් කෝට් එක ගැලවී යාම:** වාහනයේ දිලිසෙන ආරක්ෂිත ස්ථරය (Clear coat) ගැලවී යන්නේ නම්, තීන්ත තට්ටුව අව්වට සහ වැස්සට සෘජුවම නිරාවරණය වේ.
2. **ගැඹුරු සීරීම් සහ මලකඩ පැල්ලම්:** යකඩ මතුවන තෙක් සිදුවී ඇති සීරීම් ඉක්මනින් මලකඩ කෑමට ලක්වේ.
3. **තීන්ත අවපැහැ ගැන්වීම (Fading):** දැඩි හිරු රශ්මිය නිසා වාහනයේ වර්ණය මැකී යාම සිදු වන අතර මෙය වාහනයේ නැවත විකිණුම් මිල අඩු කරයි.
4. **තීන්ත පිම්බීම (Bubbling):** මෙය තීන්ත ස්ථරයට යටින් මලකඩ සෑදෙන බව පෙන්වන ලක්ෂණයකි. වහාම මලකඩ කපා ඉවත් කළ යුතුය.
5. **අනතුරුවලින් පසු බොඩි අලුත්වැඩියාවන්:** අනතුරකට ලක්වූ වාහනයක් නැවත සකස් කිරීමෙන් පසු වෘත්තීය මට්ටමේ පින්තාරු කිරීමක් සිදු කළ යුතුය.

දඹුල්ලේ පිහිටි අපගේ වැඩපලෙන් වර්ණ ගැළපීම් සහිතව වෘත්තීය මට්ටමේ වාහන පින්තාරු සේවා ලබා ගැනීමට අදම අපව අමතන්න.`,
  },
];
