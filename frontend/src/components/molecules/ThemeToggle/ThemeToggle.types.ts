import type { ButtonSize, ButtonVariant, ButtonRounded, ButtonDepth } from '@/components/atoms/Button/Button.types';

export type ThemeToggleDisplay = 'icon' | 'button' | 'switch';

export interface ThemeToggleProps {
  /**
   * Mode tampilan tombol:
   * - 'icon': Tombol bulat/kotak kompak hanya menampilkan ikon matahari/bulan
   * - 'button': Tombol lengkap dengan teks label dan ikon
   * - 'switch': Sakelar toggle biner dengan ikon matahari/bulan terintegrasi pada knop
   * @default 'icon'
   */
  display?: ThemeToggleDisplay;

  /**
   * Ukuran tombol.
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Varian visual tombol.
   * @default 'outline'
   */
  variant?: ButtonVariant;

  /**
   * Tingkat kedalaman tombol (Cekung, Rata, Timbul).
   * @default 'raised-sm'
   */
  depth?: ButtonDepth;

  /**
   * Kelengkungan sudut tombol.
   * @default 'full'
   */
  rounded?: ButtonRounded;

  /**
   * Menampilkan ikon di dalam knop sakelar (hanya berlaku saat display='switch').
   * @default false
   */
  showIcon?: boolean;

  /**
   * ClassName kustom tambahan.
   */
  className?: string;
}
