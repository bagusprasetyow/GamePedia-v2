import type { FC, ReactElement } from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils';
import type {
  IconProps,
  IconSize,
  IconVariant,
} from './Icon.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
const sizeClasses: Record<IconSize, string> = {
  '2xs': 'w-3 h-3 text-xs',
  xs: 'w-3.5 h-3.5 text-xs',
  sm: 'w-4 h-4 text-sm',
  md: 'w-5 h-5 text-base',
  lg: 'w-6 h-6 text-lg',
  xl: 'w-7 h-7 text-xl',
  '2xl': 'w-8 h-8 text-2xl',
  '3xl': 'w-10 h-10 text-3xl',
  '4xl': 'w-12 h-12 text-4xl',
};

const variantClasses: Record<IconVariant, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  subtle: 'text-muted-foreground/80',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  accent: 'text-accent-600 dark:text-accent-400',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  info: 'text-info-600 dark:text-info-500',
  contrast: 'text-foreground',
  white: 'text-white',
  inherit: 'text-inherit',
};

/**
 * Icon Component - Atomic UI Element
 * 
 * Komponen ikon universal berbasis Iconify dengan enkapsulasi varian warna tema GamePedia,
 * ukuran preset standar, dan animasi pendukung.
 * 
 * @param {string} props.icon - Nama ikon Iconify (contoh: "mdi:controller", "lucide:bell")
 * @param {IconSize | number | string} [props.size='md'] - Ukuran preset ('2xs' - '4xl') atau nilai kustom
 * @param {IconVariant} [props.variant='inherit'] - Varian warna semantik tema GamePedia
 * @param {boolean} [props.spin=false] - Animasi memutar (spinner)
 * @param {boolean} [props.pulse=false] - Animasi berdenyut (pulse)
 * @param {string} [props.className] - Class kustom tambahan
 * 
 * @returns {ReactElement} Elemen ikon SVG terenkapsulasi
 */
export const Icon: FC<IconProps> = ({
  icon,
  size = 'md',
  variant = 'inherit',
  spin = false,
  pulse = false,
  className = '',
  style,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const isPresetSize = typeof size === 'string' && size in sizeClasses;
  const safeSizeClass = isPresetSize ? sizeClasses[size as IconSize] : '';
  const safeVariantClass = variantClasses[variant] ?? variantClasses.inherit;

  // Custom inline style jika menggunakan number atau string kustom (misal: 32 atau "2rem")
  const customDimensionsStyle = !isPresetSize && size ? {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  } : undefined;

  const iconClasses = cn(
    'inline-block shrink-0 align-middle',
    safeSizeClass,
    safeVariantClass,
    spin && 'animate-spin',
    pulse && 'animate-pulse',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <IconifyIcon
      icon={icon}
      className={iconClasses}
      style={{ ...customDimensionsStyle, ...style }}
      aria-hidden="true"
      {...restProps}
    />
  );
};

export default Icon;
