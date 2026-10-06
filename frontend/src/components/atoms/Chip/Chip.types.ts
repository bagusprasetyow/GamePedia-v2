import type { HTMLAttributes, ReactNode } from 'react';
import type {
  BadgeAppearance,
  BadgeVariant,
  BadgeRounded,
  BadgeWeight,
} from '@/components/atoms/Badge/Badge.types';
import type { ButtonDepth } from '@/components/atoms/Button/Button.types';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';

export type ChipSize = 'sm' | 'md' | 'lg';

export type ChipVariant = BadgeVariant;

export type ChipAppearance = BadgeAppearance;

export type ChipRounded = BadgeRounded;

export type ChipWeight = BadgeWeight;

export type ChipDepth = ButtonDepth;

export interface ChipCustomProps {
  /**
   * Ukuran fisik chip.
   * @default 'md'
   */
  size?: ChipSize;

  /**
   * Varian warna semantik chip.
   * @default 'primary'
   */
  variant?: ChipVariant;

  /**
   * Gaya tampilan chip saat tidak terpilih (filled, ghost, outline, tint).
   * Saat `selected`, chip otomatis memakai gaya `filled`.
   * @default 'outline'
   */
  appearance?: ChipAppearance;

  /**
   * Tingkat kedalaman visual chip (Depth System: -3 s/d 3 atau alias named).
   * @default 0
   */
  depth?: ChipDepth;

  /**
   * Tingkat kebulatan sudut chip.
   * @default 'full'
   */
  rounded?: ChipRounded;

  /**
   * Ketebalan font teks chip.
   * @default 'medium'
   */
  weight?: ChipWeight;

  /**
   * Status terpilih (selected / toggled).
   * @default false
   */
  selected?: boolean;

  /**
   * Menonaktifkan interaksi chip.
   * @default false
   */
  disabled?: boolean;

  /**
   * Ikon di sebelah kiri teks (string Iconify atau ReactNode).
   */
  startIcon?: ReactNode;

  /**
   * Handler hapus. Jika diberikan, tombol "x" ditampilkan.
   */
  onRemove?: () => void;

  /**
   * Label aksesibilitas untuk tombol hapus.
   * @default 'Hapus'
   */
  removeLabel?: string;

  /**
   * Konten chip.
   */
  children?: ReactNode;

  /**
   * ClassName kustom tambahan (layout minimal).
   */
  className?: string;
}

export interface ChipIconProps {
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

export interface ChipLabelProps {
  /**
   * Ukuran tipografi label.
   * @default 'xs'
   */
  textSize?: TextSize;

  /**
   * Ketebalan font label.
   * @default 'medium'
   */
  weight?: ChipWeight;

  /**
   * Konten teks label.
   */
  children?: ReactNode;
}

export interface ChipRemoveProps {
  /**
   * Handler yang dipanggil saat tombol hapus ditekan.
   */
  onRemove?: () => void;

  /**
   * Label aksesibilitas tombol hapus.
   * @default 'Hapus'
   */
  label?: string;

  /**
   * Ukuran chip induk (menentukan ukuran tombol & ikon).
   * @default 'md'
   */
  size?: ChipSize;

  /**
   * Menonaktifkan tombol hapus.
   * @default false
   */
  disabled?: boolean;
}

export type ChipProps = ChipCustomProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof ChipCustomProps>;
