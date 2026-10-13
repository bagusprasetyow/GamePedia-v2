import type { CSSProperties, FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import type { SpinnerRingProps, SpinnerSize } from '../Spinner.types';
import {
  sizeClasses,
  sizeNumericMap,
  thicknessStrokeMap,
  trackOpacityClasses,
  speedClasses,
} from '../Spinner.styles';

/**
 * SpinnerRing Component - Sub-Atom Internal Spinner
 *
 * Merender elemen visual grafis cincin putaran animasi, baik melalui SVG Circular Ring
 * berbasis geometri stroke mulus maupun ikon putar Iconify kustom.
 *
 * @param {SpinnerSize | number | string} props.size - Ukuran fisik ring
 * @param {SpinnerThickness} [props.thickness='normal'] - Ketebalan garis ring
 * @param {SpinnerTrackOpacity} [props.trackOpacity='light'] - Opasitas cincin latar belakang
 * @param {SpinnerSpeed} [props.speed='normal'] - Kecepatan animasi putaran
 * @param {string} [props.icon] - Ikon alternatif Iconify
 * @param {string} [props.className] - Class kustom tambahan untuk elemen ring
 *
 * @returns {ReactElement} Elemen visual putaran loading
 */
export const SpinnerRing: FC<SpinnerRingProps> = ({
  size,
  thickness = 'normal',
  trackOpacity = 'light',
  speed = 'normal',
  icon,
  className = '',
}): ReactElement => {
  const isPresetSize = typeof size === 'string' && size in sizeClasses;
  const safeSizeClass = isPresetSize ? sizeClasses[size as SpinnerSize] : '';
  const safeThickness = thicknessStrokeMap[thickness] ? thickness : 'normal';
  const strokeWidth = thicknessStrokeMap[safeThickness];
  const safeTrackOpacity = trackOpacityClasses[trackOpacity] ? trackOpacity : 'light';
  const safeSpeed = speedClasses[speed] ? speed : 'normal';

  // Inline custom dimensi bila menggunakan angka numerik atau string pixel
  const customDimensionsStyle: CSSProperties | undefined =
    !isPresetSize && size
      ? {
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }
      : undefined;

  // Jika menggunakan ikon kustom alternatif
  if (icon) {
    const iconSizeValue = isPresetSize
      ? sizeNumericMap[size as SpinnerSize]
      : typeof size === 'number'
        ? size
        : 20;

    return (
      <Icon
        icon={icon}
        size={iconSizeValue}
        spin
        className={cn('shrink-0', speedClasses[safeSpeed], className)}
      />
    );
  }

  const ringClasses = cn(
    // layout
    'inline-block shrink-0 animate-spin',
    // size preset
    safeSizeClass,
    // speed
    speedClasses[safeSpeed],
    className
  );

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={ringClasses}
      style={customDimensionsStyle}
      aria-hidden="true"
    >
      {/* 1. Background Track Circle */}
      {safeTrackOpacity !== 'transparent' && (
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackOpacityClasses[safeTrackOpacity]}
        />
      )}

      {/* 2. Active Spinning Arc */}
      <path
        d="M12 2.5 A 9.5 9.5 0 0 1 21.5 12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default SpinnerRing;
