import type { SearchMatchMode } from './SearchInput.types';

/**
 * Helper utilitas untuk mencocokkan teks target terhadap query pencarian.
 * - `'x...'` atau `'startsWith'`: mencocokkan awalan teks (Prefix match).
 * - `'...x...'` atau `'contains'`: mencocokkan teks yang mengandung kata kunci (Substring match).
 *
 * @param text - Teks sumber yang akan diuji.
 * @param query - Kata kunci pencarian yang dimasukkan pengguna.
 * @param mode - Mode pencocokan ('x...' atau '...x...'). Default: '...x...'.
 * @returns boolean apakah teks cocok dengan query pencarian.
 */
export const matchesSearch = (
  text: string,
  query: string,
  mode: SearchMatchMode = '...x...'
): boolean => {
  const normalizedText = text.toLowerCase().trim();
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return true;
  if (mode === 'x...' || mode === 'startsWith') {
    return normalizedText.startsWith(normalizedQuery);
  }
  return normalizedText.includes(normalizedQuery);
};
