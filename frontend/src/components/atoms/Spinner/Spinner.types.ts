import type { HTMLAttributes, ReactNode } from 'react';
import type {
  DepthNumeric,
  DepthString,
  DepthNamed,
} from '@/components/atoms/Button/Button.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';

export type SpinnerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'contrast'
  | 'muted'
  | 'white'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'inherit';

export type SpinnerThickness = 'thin' | 'normal' | 'thick';

export type SpinnerDepth = DepthNumeric | DepthString | DepthNamed;

export type SpinnerLabelPosition = 'right' | 'bottom' | 'top' | 'left';

export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

export type SpinnerTrackOpacity = 'faint' | 'light' | 'normal' | 'transparent';

export interface SpinnerRingProps {
  /**
   * Ukuran fisik spinner dalam pixel atau string preset.
   */
  size: SpinnerSize | number | string;

  /**
   * Ketebalan garis ring spinner.
   * @default 'normal'
   */
  thickness?: SpinnerThickness;

  /**
   * Tingkat opasitas cincin jalur latar belakang (track ring).
   * @default 'light'
   */
  trackOpacity?: SpinnerTrackOpacity;

  /**
   * Ikon Iconify opsional jika ingin menggunakan ikon khusus alih-alih SVG ring bawaan.
   */
  icon?: string;

  /**
   * Kecepatan rotasi putaran animasi.
   * @default 'normal'
   */
  speed?: SpinnerSpeed;

  /**
   * ClassName tambahan khusus untuk elemen SVG / ring spinner.
   */
  className?: string;
}

export interface SpinnerLabelProps {
  /**
   * Konten teks atau label pendamping spinner.
   */
  label: ReactNode;

  /**
   * Ukuran tipografi teks label.
   */
  textSize?: TextSize;

  /**
   * Class kustom tambahan untuk teks label.
   */
  className?: string;
}

export interface SpinnerCustomProps {
  /**
   * Skala ukuran fisik spinner (preset atau nilai pixel kustom).
   * - '2xs': 12px (h-3 w-3)
   * - 'xs': 14px (h-3.5 w-3.5)
   * - 'sm': 16px (h-4 w-4)
   * - 'md': 20px (h-5 w-5)
   * - 'lg': 24px (h-6 w-6)
   * - 'xl': 32px (h-8 w-8)
   * - '2xl': 40px (h-10 w-10)
   * @default 'md'
   */
  size?: SpinnerSize | number | string;

  /**
   * Varian warna semantik tema GamePedia.
   * @default 'primary'
   */
  variant?: SpinnerVariant;

  /**
   * Ketebalan garis putaran lingkaran (stroke width).
   * @default 'normal'
   */
  thickness?: SpinnerThickness;

  /**
   * Tingkat kedalaman taktil / visual Depth System (-3 s/d 3 atau alias named).
   * @default 0
   */
  depth?: SpinnerDepth;

  /**
   * Kecepatan rotasi putaran spinner.
   * - 'slow': durasi 1.5 detik
   * - 'normal': durasi 1 detik
   * - 'fast': durasi 0.6 detik
   * @default 'normal'
   */
  speed?: SpinnerSpeed;

  /**
   * Tingkat opasitas alur lingkar latar belakang (track ring).
   * - 'faint': opacity 10%
   * - 'light': opacity 20%
   * - 'normal': opacity 30%
   * - 'transparent': tidak ada lingkar alur
   * @default 'light'
   */
  trackOpacity?: SpinnerTrackOpacity;

  /**
   * Ikon Iconify alternatif (misal: "mdi:loading", "lucide:refresh-cw") jika tidak ingin SVG circular ring bawaan.
   */
  icon?: string;

  /**
   * Teks label deskripsi status pemuatan (misal: "Memuat data...", "Menyimpan...").
   */
  label?: ReactNode;

  /**
   * Posisi penempatan teks label relatif terhadap putaran spinner.
   * @default 'right'
   */
  labelPosition?: SpinnerLabelPosition;

  /**
   * Ukuran tipografi teks label kustom.
   * Jika tidak disetel, ukuran teks akan menyesuaikan secara otomatis dengan ukuran spinner.
   */
  labelSize?: TextSize;

  /**
   * ClassName tambahan khusus untuk elemen teks label.
   */
  labelClassName?: string;

  /**
   * ClassName tambahan khusus untuk elemen grafis spinner/ring.
   */
  spinnerClassName?: string;
}

export type SpinnerProps = SpinnerCustomProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof SpinnerCustomProps>;
