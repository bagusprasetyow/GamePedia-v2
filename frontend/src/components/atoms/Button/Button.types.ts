import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconSize } from '../Icon/Icon.types';

export type ButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'outline' 
  | 'ghost' 
  | 'contrast' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'close';

export type ButtonRounded = 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full';

export type DepthNumeric = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export type DepthString = '-3' | '-2' | '-1' | '0' | '1' | '2' | '3';
export type DepthNamed = 'sunken' | 'flat' | 'raised-sm' | 'raised-md' | 'raised-lg';
export type ButtonDepth = DepthNumeric | DepthString | DepthNamed;

export type ButtonWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type ButtonJustify = 'start' | 'center' | 'end' | 'between';

export type ButtonGap = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonCursor = 
  | 'auto' 
  | 'default' 
  | 'pointer' 
  | 'wait' 
  | 'text' 
  | 'move' 
  | 'help' 
  | 'not-allowed' 
  | 'none' 
  | 'progress' 
  | 'grab' 
  | 'grabbing' 
  | 'crosshair' 
  | 'copy';

export interface ButtonCustomProps {
  /**
   * Ukuran tombol.
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Varian tampilan warna/gaya tombol.
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Tingkat kedalaman visual tombol (Depth System: -3 s/d 3).
   * - -3: Cekung Dalam (Deep Sunken)
   * - -2: Cekung Sedang (Medium Sunken)
   * - -1: Cekung Dangkal (Shallow Sunken)
   * -  0: Rata (Flat / Surface)
   * -  1: Timbul Rendah / Small (Ref: frontend/dev Level 1)
   * -  2: Timbul Sedang / Medium (Ref: frontend/dev Level 2)
   * -  3: Timbul Tinggi / Large (Ref: frontend/dev Level 3)
   * @default 1
   */
  depth?: ButtonDepth;

  /**
   * Lebar tombol ('auto', 'full', atau nilai CSS custom seperti '200px').
   * @default 'auto'
   */
  width?: 'auto' | 'full' | string;

  /**
   * Tingkat kebulatan sudut tombol (border radius).
   * @default 'default'
   */
  rounded?: ButtonRounded;

  /**
   * Ketebalan font teks tombol.
   * @default 'medium'
   */
  weight?: ButtonWeight;

  /**
   * Penjajaran konten tombol secara horizontal.
   * @default 'center'
   */
  justify?: ButtonJustify;

  /**
   * Jarak celah antara ikon dan teks (gap).
   */
  gap?: ButtonGap;

  /**
   * Ikon di sebelah kiri teks (bisa string Iconify nama atau ReactNode).
   */
  startIcon?: ReactNode;

  /**
   * Ikon di sebelah kanan teks (bisa string Iconify nama atau ReactNode).
   */
  endIcon?: ReactNode;

  /**
   * Ikon untuk tombol icon-only tanpa teks (bisa string Iconify nama atau ReactNode).
   */
  icon?: ReactNode;

  /**
   * Ukuran ikon kustom jika berbeda dari default size tombol.
   */
  iconSize?: IconSize | number | string;

  /**
   * Status loading, menampilkan spinner berputar dan menonaktifkan klik.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Teks pengganti yang tampil ketika status loading aktif.
   */
  loadingText?: string;

  /**
   * Jenis kursor mouse saat hover.
   */
  cursor?: ButtonCursor;

  /**
   * Konten anak dalam tombol.
   */
  children?: ReactNode;

  /**
   * ClassName kustom tambahan.
   */
  className?: string;
}

export type ButtonProps = ButtonCustomProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonCustomProps>;
