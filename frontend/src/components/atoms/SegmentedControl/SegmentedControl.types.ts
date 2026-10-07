import type { HTMLAttributes, ReactNode } from 'react';
import type {
  DepthNumeric,
  DepthString,
  DepthNamed,
} from '@/components/atoms/Button/Button.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export type SegmentedControlColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type SegmentedControlDepth = DepthNumeric | DepthString | DepthNamed;

/**
 * Tipe data untuk setiap opsi segmen pilihan.
 */
export interface SegmentedControlOption<T extends string | number = string> {
  /**
   * Nilai unik pengenal opsi segmen.
   */
  value: T;

  /**
   * Label tampilan teks atau konten ReactNode.
   */
  label: ReactNode;

  /**
   * Ikon pendamping (nama iconify string atau elemen ReactNode).
   */
  icon?: ReactNode;

  /**
   * Status nonaktif khusus untuk opsi ini.
   * @default false
   */
  disabled?: boolean;

  /**
   * Label aksesibilitas untuk screen reader (wajib jika opsi bersifat icon-only).
   */
  ariaLabel?: string;
}

/**
 * Properti konfigurasi khusus untuk komponen SegmentedControl.
 */
export interface SegmentedControlCustomProps<T extends string | number = string> {
  /**
   * Daftar opsi pilihan segmen.
   */
  options: SegmentedControlOption<T>[];

  /**
   * Nilai segmen yang sedang aktif (mode controlled).
   */
  value?: T;

  /**
   * Nilai segmen awal saat pertama kali dimuat (mode uncontrolled).
   */
  defaultValue?: T;

  /**
   * Callback yang dipanggil saat nilai segmen aktif berubah.
   */
  onChange?: (value: T) => void;

  /**
   * Skala ukuran tinggi dan tipografi segmen.
   * @default 'md'
   */
  size?: SegmentedControlSize;

  /**
   * Varian warna semantik untuk segmen yang aktif.
   * @default 'primary'
   */
  color?: SegmentedControlColor;

  /**
   * Tingkat kedalaman taktil wadah kontainer trek (Depth System: -3 s/d 3).
   * Nilai bawaan wadah menggunakan alur cekung (-1).
   * @default -1
   */
  depth?: SegmentedControlDepth;

  /**
   * Mengatur wadah agar membentang selebar 100% kontainer induk
   * dengan pembagian lebar segmen yang merata.
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Menonaktifkan interaksi pada seluruh segmen pilihan.
   * @default false
   */
  disabled?: boolean;

  /**
   * Label aksesibilitas grup untuk pembaca layar (`aria-label`).
   */
  ariaLabel?: string;

  /**
   * Nama input form untuk integrasi native form submission.
   */
  name?: string;

  /**
   * Class name kustom tambahan untuk wadah pembungkus terluar.
   */
  wrapperClassName?: string;

  /**
   * Class name kustom tambahan untuk kontainer radiogroup segmen.
   */
  className?: string;
}

export type SegmentedControlProps<T extends string | number = string> =
  SegmentedControlCustomProps<T> &
    Omit<HTMLAttributes<HTMLDivElement>, keyof SegmentedControlCustomProps<T> | 'onChange'>;

export interface SegmentedControlItemProps<T extends string | number = string> {
  option: SegmentedControlOption<T>;
  isSelected: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  size: SegmentedControlSize;
  color: SegmentedControlColor;
  fullWidth: boolean;
  iconSize: IconSize;
  onSelect: (value: T) => void;
  onFocus: () => void;
}
