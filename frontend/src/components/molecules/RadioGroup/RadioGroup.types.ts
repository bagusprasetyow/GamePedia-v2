import type { ReactNode } from 'react';
import type { RadioSize, RadioColor, RadioVariant, RadioDepth } from '@/components/atoms/Radio/Radio.types';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /**
   * Nama grup radio (HTML name attribute).
   */
  name?: string;

  /**
   * Daftar opsi pilihan radio dalam grup.
   */
  options: RadioGroupOption[];

  /**
   * Nilai yang sedang terpilih (controlled mode).
   */
  value?: string;

  /**
   * Nilai default awal saat render pertama (uncontrolled mode).
   */
  defaultValue?: string;

  /**
   * Callback saat opsi terpilih berubah.
   */
  onChange?: (value: string) => void;

  /**
   * Judul label grup radio.
   */
  label?: ReactNode;

  /**
   * Deskripsi keterangan tambahan untuk grup.
   */
  description?: ReactNode;

  /**
   * Orientasi tata letak ('vertical' atau 'horizontal').
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Skala ukuran untuk semua radio button dalam grup.
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Warna semantik tema untuk semua radio button dalam grup.
   * @default 'primary'
   */
  color?: RadioColor;

  /**
   * Varian visual indikator:
   * - 'solid': Titik bulat solid dot di tengah
   * - 'check': Tanda centang checklist di dalam lingkaran
   * @default 'solid'
   */
  variant?: RadioVariant;

  /**
   * Tingkat kedalaman taktil visual (Depth System: -3 s/d 3).
   * @default -1
   */
  depth?: RadioDepth;

  /**
   * Apakah seluruh grup radio dinonaktifkan.
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom tambahan untuk pembungkus terluar.
   */
  className?: string;
}
