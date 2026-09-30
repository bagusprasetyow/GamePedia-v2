import type { ReactNode } from 'react';
import type { CheckboxSize, CheckboxColor, CheckboxVariant, CheckboxDepth } from '@/components/atoms/Checkbox/Checkbox.types';

export interface CheckboxGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /**
   * Daftar opsi checkbox dalam grup.
   */
  options: CheckboxGroupOption[];

  /**
   * Nilai array yang sedang terpilih (controlled mode).
   */
  value?: string[];

  /**
   * Nilai default awal saat render pertama (uncontrolled mode).
   * @default []
   */
  defaultValue?: string[];

  /**
   * Callback saat pilihan berubah.
   */
  onChange?: (values: string[]) => void;

  /**
   * Label judul grup checkbox.
   */
  label?: ReactNode;

  /**
   * Deskripsi keterangan tambahan untuk grup.
   */
  description?: ReactNode;

  /**
   * Orientasi tata letak checkbox ('vertical' atau 'horizontal').
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Jumlah kolom tata letak grid (1, 2, 3, atau 4).
   */
  columns?: 1 | 2 | 3 | 4;

  /**
   * Skala ukuran untuk semua checkbox di dalam grup.
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * Warna semantik tema untuk semua checkbox di dalam grup.
   * @default 'primary'
   */
  color?: CheckboxColor;

  /**
   * Varian visual indikator ('check' atau 'solid').
   * @default 'check'
   */
  variant?: CheckboxVariant;

  /**
   * Tingkat kedalaman visual taktil (Depth System: -3 s/d 3).
   * @default -1
   */
  depth?: CheckboxDepth;

  /**
   * Apakah seluruh grup checkbox dinonaktifkan.
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom tambahan untuk pembungkus terluar.
   */
  className?: string;
}
