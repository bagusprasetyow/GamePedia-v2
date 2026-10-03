import type { FC, ReactElement } from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils';
import type { IconProps, IconSize } from './Icon.types';
import { sizeClasses, variantClasses } from './Icon.styles';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Icon.styles.ts)
// ─────────────────────────────────────────────────────────────

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
    // layout
    'inline-block shrink-0 align-middle',
    // size & typography
    safeSizeClass,
    // text
    safeVariantClass,
    // state
    spin && 'animate-spin',
    pulse && 'animate-pulse',
    className
  );

  const combinedStyle = customDimensionsStyle
    ? { ...customDimensionsStyle, ...style }
    : style;

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <IconifyIcon
      icon={icon}
      className={iconClasses}
      style={combinedStyle}
      aria-hidden="true"
      {...restProps}
    />
  );
};

export default Icon;
