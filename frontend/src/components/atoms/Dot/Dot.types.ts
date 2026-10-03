import type { HTMLAttributes, ReactNode } from 'react';
import type { TextSize } from '@/components/atoms/Text/Text.types';
import type { DepthNumeric, DepthString, DepthNamed } from '@/components/atoms/Button/Button.types';

export type DotSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type DotVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'contrast'
  | 'white';

export type DotDepth = DepthNumeric | DepthString | DepthNamed;

export type DotPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface DotCustomProps {
  /**
   * Ukuran fisik titik dot.
   * @default 'md'
   */
  size?: DotSize;

  /**
   * Varian warna semantik sesuai token tema GamePedia.
   * @default 'primary'
   */
  variant?: DotVariant;

  /**
   * Tingkat kedalaman visual bayangan (Depth System: -3 s/d 3).
   * - -3 s/d -1: Cekung / Sunken (shadow-n3 s/d shadow-n1)
   * -  0: Rata / Flat (shadow-0)
   * -  1 s/d 3: Timbul / Raised (shadow-1 s/d shadow-3)
   * @default 0
   */
  depth?: DotDepth;

  /**
   * Menyalakan animasi gelombang berdenyut (ripple / halo ping) di belakang dot.
   * Sangat cocok untuk status live streaming, in-match, atau panggilan aktif.
   * @default false
   */
  ping?: boolean;

  /**
   * Menyalakan animasi fade-in-out berkedip perlahan (slow pulse).
   * @default false
   */
  pulse?: boolean;

  /**
   * Memberikan efek pencahayaan neon / ambient glow warna senada di sekeliling dot.
   * @default false
   */
  glow?: boolean;

  /**
   * Memberikan ring kontras di sekeliling dot agar menonjol saat berada di atas avatar atau gambar.
   * @default false
   */
  bordered?: boolean;

  /**
   * Teks label deskriptif di samping dot (misal: "Online", "Live", "Away").
   */
  label?: ReactNode;

  /**
   * Posisi letak teks label terhadap titik dot.
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';

  /**
   * Ukuran teks label (jika ingin menimpa default kalkulasi dari size dot).
   */
  labelSize?: TextSize;

  /**
   * ClassName kustom untuk elemen teks label.
   */
  labelClassName?: string;

  /**
   * Posisi penempatan dot saat membungkus elemen anak (`children`), misal di pojok avatar.
   * @default 'top-right'
   */
  placement?: DotPlacement;

  /**
   * Menyembunyikan tampilan dot jika bernilai true.
   * @default false
   */
  invisible?: boolean;

  /**
   * Elemen target anak yang akan ditempeli dot sebagai overlay indikator (misal avatar, icon, button).
   */
  children?: ReactNode;

  /**
   * ClassName tambahan untuk kontainer pembungkus utama.
   */
  className?: string;

  /**
   * ClassName tambahan khusus untuk bulatan dot itu sendiri (terutama saat membungkus children).
   */
  dotClassName?: string;
}

export interface DotCircleProps {
  /**
   * Ukuran fisik bulatan dot.
   * @default 'md'
   */
  size?: DotSize;

  /**
   * Varian warna semantik sesuai token tema GamePedia.
   * @default 'primary'
   */
  variant?: DotVariant;

  /**
   * Tingkat kedalaman visual bayangan (Depth System: -3 s/d 3).
   * @default 0
   */
  depth?: DotDepth;

  /**
   * Menyalakan animasi gelombang berdenyut (ripple / halo ping).
   * @default false
   */
  ping?: boolean;

  /**
   * Menyalakan animasi denyut perlahan (pulse).
   * @default false
   */
  pulse?: boolean;

  /**
   * Memberikan efek pencahayaan neon / ambient glow warna senada.
   * @default false
   */
  glow?: boolean;

  /**
   * Memberikan cincin pemisah kontras di sekeliling bulatan dot.
   * @default false
   */
  bordered?: boolean;

  /**
   * Menyembunyikan bulatan dot secara visual jika bernilai true.
   * @default false
   */
  invisible?: boolean;

  /**
   * Class kustom tambahan untuk bulatan dot.
   */
  className?: string;
}

export type DotProps = DotCustomProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof DotCustomProps>;

