import { useState, useEffect } from 'react';

/**
 * React Hook untuk menunda (debounce) perubahan suatu nilai (state value).
 * Sangat cocok untuk query pencarian, filter reaktif, atau input pengetikan.
 *
 * @template T Tipe data nilai yang didebounce.
 * @param value Nilai reaktif yang ingin ditunda perubahannya.
 * @param delay Jeda waktu penundaan dalam milidetik (default: 300ms).
 * @returns Nilai stabil setelah jeda penundaan tercapai.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // Hanya dipanggil setelah pengguna berhenti mengetik selama 300ms
 *   fetchData(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, Math.max(0, delay));

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
