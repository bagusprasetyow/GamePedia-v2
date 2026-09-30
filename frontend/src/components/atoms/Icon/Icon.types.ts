import type { IconProps as IconifyIconProps } from '@iconify/react';

export type IconSize = 
  | '2xs' 
  | 'xs' 
  | 'sm' 
  | 'md' 
  | 'lg' 
  | 'xl' 
  | '2xl' 
  | '3xl' 
  | '4xl';

export type IconVariant = 
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
  | 'white' 
  | 'inherit';

export interface IconCustomProps {
  /**
   * Identifier ikon Iconify (contoh: "mdi:gamepad-variant", "lucide:sparkles", dll.)
   */
  icon: string;

  /**
   * Skala ukuran ikon preset atau ukuran kustom (string pixel/rem atau number).
   * @default 'md'
   */
  size?: IconSize | number | string;

  /**
   * Varian warna semantik tema GamePedia.
   * @default 'inherit'
   */
  variant?: IconVariant;

  /**
   * Apakah ikon memiliki animasi rotasi berputar terus-menerus (loading spinner).
   * @default false
   */
  spin?: boolean;

  /**
   * Apakah ikon memiliki animasi berdenyut (pulse).
   * @default false
   */
  pulse?: boolean;

  /**
   * ClassName kustom tambahan.
   */
  className?: string;
}

export type IconProps = IconCustomProps & Omit<IconifyIconProps, keyof IconCustomProps>;
