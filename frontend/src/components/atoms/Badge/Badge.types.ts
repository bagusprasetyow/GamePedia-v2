import type { HTMLAttributes, ReactNode } from 'react';
import type { ButtonDepth } from '@/components/atoms/Button/Button.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export type BadgeAppearance = 'filled' | 'ghost' | 'outline' | 'tint';

export type BadgeVariant =
  | 'brand'
  | 'danger'
  | 'important'
  | 'informative'
  | 'severe'
  | 'subtle'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'outline'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type BadgeRounded = 'sm' | 'md' | 'lg' | 'full';

export type BadgeDepth = ButtonDepth;

export type BadgeWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface BadgeCustomProps {
  /**
   * Ukuran fisik badge.
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Varian warna semantik badge.
   * @default 'primary'
   */
  variant?: BadgeVariant;

  /**
   * Gaya tampilan badge (filled, ghost, outline, tint).
   * @default 'filled'
   */
  appearance?: BadgeAppearance;

  /**
   * Tingkat kedalaman visual badge (Depth System: -3 s/d 3 atau alias named).
   * @default 0
   */
  depth?: BadgeDepth;

  /**
   * Tingkat kebulatan sudut badge.
   * @default 'full'
   */
  rounded?: BadgeRounded;

  /**
   * Ketebalan font teks badge.
   * @default 'medium'
   */
  weight?: BadgeWeight;

  /**
   * Ikon di sebelah kiri teks (string Iconify atau ReactNode).
   */
  startIcon?: ReactNode;

  /**
   * Ikon di sebelah kanan teks (string Iconify atau ReactNode).
   */
  endIcon?: ReactNode;

  /**
   * Konten badge.
   */
  children?: ReactNode;

  /**
   * ClassName kustom tambahan (layout minimal).
   */
  className?: string;
}

export interface BadgeIconProps {
  /**
   * Elemen ikon atau nama string Iconify.
   */
  icon?: ReactNode;

  /**
   * Ukuran fisik ikon.
   */
  size?: IconSize | number | string;

  /**
   * ClassName kustom tambahan untuk ikon.
   */
  className?: string;
}

export interface BadgeLabelProps {
  /**
   * Ukuran tipografi label.
   * @default 'xs'
   */
  textSize?: TextSize;

  /**
   * Ketebalan font label.
   * @default 'medium'
   */
  weight?: BadgeWeight;

  /**
   * Konten teks label.
   */
  children?: ReactNode;
}

export type BadgeProps = BadgeCustomProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof BadgeCustomProps>;
