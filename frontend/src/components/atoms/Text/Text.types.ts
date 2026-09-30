import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

export type TextElement = 
  | 'p' 
  | 'span' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'label' 
  | 'div' 
  | 'small' 
  | 'strong' 
  | 'em' 
  | 'caption';

export type TextSize = 
  | 'xs' 
  | 'sm' 
  | 'base' 
  | 'md' 
  | 'lg' 
  | 'xl' 
  | '2xl' 
  | '3xl' 
  | '4xl' 
  | '5xl' 
  | '6xl';

export type TextVariant = 
  | 'default' 
  | 'muted' 
  | 'subtle' 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'contrast' 
  | 'white';

export type TextWeight = 
  | 'light' 
  | 'normal' 
  | 'medium' 
  | 'semibold' 
  | 'bold' 
  | 'extrabold' 
  | 'black';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';

export type TextLeading = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

export type TextTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

export type TextClamp = 1 | 2 | 3 | 4 | 5 | 6;

export interface TextCustomProps<T extends ElementType = 'p'> {
  /**
   * HTML tag / elemen dasar yang ingin di-render secara polimorfik.
   * @default 'p'
   */
  as?: T;

  /**
   * Skala ukuran teks berdasarkan tipografi Tailwind.
   * @default 'base'
   */
  size?: TextSize;

  /**
   * Varian warna teks semantik sesuai tema GamePedia.
   * @default 'default'
   */
  variant?: TextVariant;

  /**
   * Bobot ketebalan font teks.
   * @default 'normal'
   */
  weight?: TextWeight;

  /**
   * Perataan horizontal teks.
   * @default 'left'
   */
  align?: TextAlign;

  /**
   * Transformasi casing teks (uppercase, lowercase, capitalize).
   * @default 'none'
   */
  transform?: TextTransform;

  /**
   * Jarak antar baris teks (line height).
   */
  leading?: TextLeading;

  /**
   * Jarak antar huruf (letter spacing).
   */
  tracking?: TextTracking;

  /**
   * Apakah teks ditampilkan dalam format miring (italic).
   * @default false
   */
  italic?: boolean;

  /**
   * Garis bawah teks (underline).
   * @default false
   */
  underline?: boolean;

  /**
   * Coretan teks (strikethrough / line-through).
   * @default false
   */
  strikethrough?: boolean;

  /**
   * Memotong teks satu baris dengan elipsis (...).
   * @default false
   */
  truncate?: boolean;

  /**
   * Memotong teks multi-baris sesuai jumlah baris (CSS line-clamp).
   */
  clamp?: TextClamp;

  /**
   * Konten anak di dalam komponen Text.
   */
  children?: ReactNode;

  /**
   * ClassName kustom opsional.
   */
  className?: string;
}

export type TextProps<T extends ElementType = 'p'> = TextCustomProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextCustomProps<T>>;
