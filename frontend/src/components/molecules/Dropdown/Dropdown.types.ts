import type { ReactNode } from 'react';
import type { InputDepth, InputSize, InputVariant } from '@/components/atoms/Input/Input.types';
import type { SearchMatchMode } from '@/components/molecules/Input/SearchInput';

export type DropdownVariant = 'single' | 'multi';

/**
 * Representasi struktur satu opsi pada komponen Dropdown.
 */
export interface DropdownOption<T = string | number> {
  /** Nilai unik opsi */
  value: T;
  /** Label teks yang ditampilkan kepada pengguna */
  label: string;
  /** Keterangan deskripsi tambahan di bawah label */
  description?: string;
  /** Ikon pendamping (nama ikon Iconify) */
  icon?: string;
  /** Menonaktifkan opsi tertentu */
  disabled?: boolean;
  /** Nama grup kategori opsi untuk pengelompokan */
  group?: string;
}

/**
 * Props dasar bersama untuk semua varian Dropdown.
 */
export interface DropdownBaseProps<T = string | number> {
  /**
   * Daftar opsi pilihan dropdown.
   */
  options: DropdownOption<T>[];

  /**
   * Varian seleksi: 'single' (pilihan tunggal) atau 'multi' (pilihan ganda).
   * @default 'single'
   */
  variant?: DropdownVariant;

  /**
   * Mode ComboBox (opsi dapat dicari dengan mengetikkan teks).
   * @default false
   */
  isComboBox?: boolean;

  /**
   * Alias untuk isComboBox.
   * @default false
   */
  isSearchable?: boolean;

  /**
   * Menentukan apakah kotak pencarian (searchbar) aktif atau ditampilkan.
   * Set ke `false` untuk memastikan dropdown tidak memiliki searchbar.
   * @default false
   */
  searchable?: boolean;

  /**
   * Menentukan visibilitas kotak pencarian (searchbar).
   * Set ke `false` untuk menghilangkan searchbar.
   */
  searchBar?: boolean;

  /**
   * Menampilkan atau menyembunyikan kotak pencarian di popover.
   */
  showSearch?: boolean;

  /**
   * Secara eksplisit menyembunyikan kotak pencarian (searchbar).
   * @default false
   */
  hideSearch?: boolean;

  /**
   * Menonaktifkan kotak pencarian (searchbar).
   * @default false
   */
  disableSearch?: boolean;

  /**
   * Mode pencocokan kata kunci pencarian (ComboBox):
   * - `'x...'`: Awalan kata (Starts with / Prefix match)
   * - `'...x...'`: Mengandung kata (Contains / Substring match)
   * @default '...x...'
   */
  searchMode?: SearchMatchMode;

  /**
   * Alias untuk prop `searchMode`.
   * @default '...x...'
   */
  matchMode?: SearchMatchMode;

  /**
   * Teks placeholder bidang pencarian di dalam popover (khusus mode ComboBox).
   * @default 'Cari opsi...'
   */
  searchPlaceholder?: string;

  /**
   * Teks petunjuk saat belum ada opsi yang dipilih.
   * @default 'Pilih opsi...'
   */
  placeholder?: string;

  /**
   * Label bidang formulir di atas trigger dropdown.
   */
  label?: string;

  /**
   * Keterangan deskripsi di bawah bidang input.
   */
  description?: ReactNode;

  /**
   * Pesan error validasi.
   */
  error?: string;

  /**
   * Menandai bidang sebagai wajib diisi (menampilkan tanda bintang merah).
   * @default false
   */
  required?: boolean;

  /**
   * Menampilkan tombol pembersih cepat saat ada nilai terpilih.
   * @default false
   */
  clearable?: boolean;

  /**
   * Callback saat tombol pembersih ditekan.
   */
  onClear?: () => void;

  /**
   * Menonaktifkan interaksi dropdown.
   * @default false
   */
  disabled?: boolean;

  /**
   * Membuat dropdown selebar 100% dari kontainer induknya.
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Ikon Iconify yang ditampilkan di sisi kiri trigger field.
   */
  startIcon?: string;

  /**
   * Skala ukuran visual dropdown.
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Varian gaya border & background trigger.
   * @default 'outline'
   */
  variantStyle?: InputVariant;

  /**
   * Kedalaman visual taktil (Depth System: -3 s/d 3).
   * @default -1
   */
  depth?: InputDepth;

  /**
   * Batas tinggi maksimal area daftar opsi sebelum scrollbar muncul (dalam px atau class styling).
   * @default 240
   */
  maxHeight?: number | string;

  /**
   * Teks saat tidak ada opsi yang cocok dengan pencarian.
   * @default 'Tidak ada opsi ditemukan'
   */
  notFoundText?: string;

  /**
   * Custom class untuk trigger field.
   */
  className?: string;

  /**
   * Custom class untuk pembungkus terluar dropdown.
   */
  wrapperClassName?: string;

  /**
   * Custom class untuk menu popover.
   */
  popoverClassName?: string;

  /**
   * ID elemen untuk keperluan form dan aksesibilitas.
   */
  id?: string;
}

/**
 * Props untuk Dropdown Mode Single (Pilihan Tunggal).
 */
export interface SingleDropdownProps<T = string | number> extends DropdownBaseProps<T> {
  variant?: 'single';
  /** Nilai terpilih saat ini (controlled mode) */
  value?: T | null;
  /** Nilai default awal (uncontrolled mode) */
  defaultValue?: T | null;
  /** Callback saat opsi dipilih */
  onChange?: (value: T | null, selectedOption?: DropdownOption<T> | null) => void;
}

/**
 * Props untuk Dropdown Mode Multi (Pilihan Ganda).
 */
export interface MultiDropdownProps<T = string | number> extends DropdownBaseProps<T> {
  variant: 'multi';
  /** Kumpulan nilai terpilih saat ini (controlled mode) */
  value?: T[];
  /** Kumpulan nilai default awal (uncontrolled mode) */
  defaultValue?: T[];
  /** Callback saat opsi dipilih atau dicentang */
  onChange?: (values: T[], selectedOptions: DropdownOption<T>[]) => void;
}

/**
 * Tipe gabungan props Dropdown.
 */
export type DropdownProps<T = string | number> = SingleDropdownProps<T> | MultiDropdownProps<T>;
