import type { InputCustomProps, InputProps } from '@/components/atoms/Input/Input.types';

export interface SearchInputCustomProps extends InputCustomProps {
  /**
   * Callback reaktif saat query pencarian berubah (dilengkapi jeda debounce).
   */
  onSearch?: (query: string) => void;

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
}

export type SearchInputProps = SearchInputCustomProps &
  Omit<InputProps, keyof SearchInputCustomProps>;
