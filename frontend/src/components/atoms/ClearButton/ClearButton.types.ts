import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { DepthNamed, DepthNumeric, DepthString } from '@/components/atoms/Button/Button.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';

export type ClearButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

export type ClearButtonVariant = 'default' | 'subtle' | 'ghost' | 'danger';

export type ClearButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type ClearButtonDepth = DepthNumeric | DepthString | DepthNamed;

export interface ClearButtonCustomProps {
  /**
   * Ukuran fisik tombol pembersih.
   * @default 'md'
   */
  size?: ClearButtonSize;

  /**
   * Varian warna/tampilan tombol pembersih.
   * - 'default': teks muted ke destructive saat hover
   * - 'subtle': teks muted ke foreground dengan bg muted saat hover
   * - 'ghost': teks mewarisi warna kontainer (text-current) dengan opacity
   * - 'danger': teks destructive
   * @default 'default'
   */
  variant?: ClearButtonVariant;

  /**
   * Kedalaman visual (Depth System: -3 s/d 3 atau alias named).
   * @default 0
   */
  depth?: ClearButtonDepth;

  /**
   * Kelengkungan sudut tombol.
   * @default 'full'
   */
  rounded?: ClearButtonRounded;

  /**
   * Ikon tombol (string nama Iconify atau elemen ReactNode).
   * @default 'mdi:close'
   */
  icon?: ReactNode;

  /**
   * Ukuran eksplisit ikon. Jika tidak diberikan, otomatis mengikuti ukuran `size`.
   */
  iconSize?: IconSize | number | string;

  /**
   * Label aksesibilitas (aria-label).
   * @default 'Bersihkan'
   */
  label?: string;

  /**
   * Menonaktifkan tombol.
   * @default false
   */
  disabled?: boolean;

  /**
   * ClassName kustom tambahan (hanya untuk layout minimal).
   */
  className?: string;
}

export type ClearButtonProps = ClearButtonCustomProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ClearButtonCustomProps>;
