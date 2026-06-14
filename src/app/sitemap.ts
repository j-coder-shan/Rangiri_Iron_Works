import { MetadataRoute } from 'next';
import { getCategories, getBlogPosts } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rangiri.lk';

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/services',
    '/gallery',
    '/quotation',
    '/about',
    '/blog',
    '/contact'
  ];
  
  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Categories
  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    categoryEntries = categories
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        url: `${siteUrl}/services/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  // 3. Dynamic Blog Posts
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await getBlogPosts();
    blogEntries = blogPosts
      .filter((post) => post.isPublished)
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticEntries, ...categoryEntries, ...blogEntries];
}
