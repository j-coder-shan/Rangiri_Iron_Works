// src/lib/codeGenerator.ts
import { getItems } from './db';

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
    categorySlug
      .split('-')
      .map(w => w[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2) || 'CC';

  // Get all existing items from the database
  const allItems = await getItems();
  
  // Filter items in the current category
  const categoryItems = allItems.filter(item => item.categorySlug === categorySlug);
  
  // The next number will be the category count + 1, padded to 4 digits
  const num = String(categoryItems.length + 1).padStart(4, '0');
  
  return `RIW-${prefix}-${num}`;
}
