// src/lib/cloudinary.ts

/**
 * Optimizes a Cloudinary image URL by injecting transformation parameters.
 * E.g., adding f_auto, q_auto, and optional width/height constraints.
 */
export function getOptimizedCloudinaryUrl(url: string, width?: number, height?: number): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com')) return url;
  
  let transformations = 'f_auto,q_auto';
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height},c_limit`;
  
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformations}/`);
  }
  return url;
}
