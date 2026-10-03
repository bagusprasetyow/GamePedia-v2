import type { InputCustomProps, InputProps } from '@/components/atoms/Input/Input.types';

/**
 * Mode pencocokan kata kunci pencarian:
 * - `'x...'`: Awalan kata (Starts with / Prefix match)
 * - `'...x...'`: Mengandung kata (Contains / Substring match)
 * - `'startsWith'`: Alias untuk 'x...'
 * - `'contains'`: Alias untuk '...x...'
 */
export type SearchMatchMode = 'x...' | '...x...' | 'startsWith' | 'contains';

export interface SearchInputCustomProps extends InputCustomProps {
  /**
   * Callback reaktif saat query pencarian berubah (dilengkapi jeda debounce).
   */
  onSearch?: (query: string, matchMode?: SearchMatchMode) => void;

  /**
   * Waktu jeda debounce dalam milidetik sebelum `onSearch` dipanggil.
   * Set ke `0` untuk pemanggilan instan tanpa jeda.
   * @default 300
   */
  debounceTime?: number;

  /**
   * Menampilkan indikator loading/spin saat proses pencarian sedang berjalan.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Ikon pencarian di sisi kiri input (Iconify name).
   * @default 'mdi:magnify'
   */
  searchIcon?: string;

  /**
   * Mode pencocokan pencarian:
   * - `'x...'`: Awalan kata (Starts with)
   * - `'...x...'`: Mengandung kata (Contains)
   * @default '...x...'
   */
  searchMode?: SearchMatchMode;

  /**
   * Alias untuk prop `searchMode`.
   * @default '...x...'
   */
  matchMode?: SearchMatchMode;
}

export type SearchInputProps = SearchInputCustomProps &
  Omit<InputProps, keyof SearchInputCustomProps>;
