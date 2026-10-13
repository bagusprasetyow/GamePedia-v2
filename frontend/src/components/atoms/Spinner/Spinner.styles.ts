import type { TextSize } from '@/components/atoms/Text/Text.types';
import type {
  SpinnerSize,
  SpinnerVariant,
  SpinnerThickness,
  SpinnerDepth,
  SpinnerLabelPosition,
  SpinnerSpeed,
  SpinnerTrackOpacity,
} from './Spinner.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

/**
 * Peta class dimensi ukuran fisik spinner (lebar dan tinggi).
 */
export const sizeClasses: Record<SpinnerSize, string> = {
  '2xs': 'size-3',
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
  '2xl': 'size-10',
};

/**
 * Peta dimensi numerik (pixel) per preset ukuran untuk perhitungan SVG ring.
 */
export const sizeNumericMap: Record<SpinnerSize, number> = {
  '2xs': 12,
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
};

/**
 * Peta warna teks/stroke semantik tema GamePedia (OKLCH).
 */
export const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent-500',
  contrast: 'text-foreground',
  muted: 'text-muted-foreground',
  white: 'text-white',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  info: 'text-info-500',
  inherit: 'text-current',
};

/**
 * Peta ketebalan garis stroke SVG per ketebalan semantik.
 */
export const thicknessStrokeMap: Record<SpinnerThickness, number> = {
  thin: 2,
  normal: 3,
  thick: 4,
};

/**
 * Peta tingkat transparansi cincin jalur belakang (track ring).
 */
export const trackOpacityClasses: Record<SpinnerTrackOpacity, string> = {
  faint: 'opacity-10',
  light: 'opacity-20',
  normal: 'opacity-30',
  transparent: 'opacity-0',
};

/**
 * Peta kecepatan rotasi animasi putaran.
 */
export const speedClasses: Record<SpinnerSpeed, string> = {
  slow: '[animation-duration:1.5s]',
  normal: '[animation-duration:1s]',
  fast: '[animation-duration:0.6s]',
};

/**
 * Peta tata letak kontainer flex berdasarkan posisi teks label terhadap spinner.
 */
export const labelPositionClasses: Record<SpinnerLabelPosition, string> = {
  right: 'flex-row items-center gap-2',
  left: 'flex-row-reverse items-center gap-2',
  bottom: 'flex-col items-center gap-2 text-center',
  top: 'flex-col-reverse items-center gap-2 text-center',
};

/**
 * Peta ukuran tipografi bawaan teks label berdasarkan ukuran fisik spinner.
 */
export const sizeLabelTextMap: Record<SpinnerSize, TextSize> = {
  '2xs': 'xs',
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
  xl: 'base',
  '2xl': 'lg',
};

// Depth System: Skala -3 s/d 3 (Ref: Monorepo Design System)
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
};

export const defaultDepthByVariant: Record<SpinnerVariant, SpinnerDepth> = {
  primary: 0,
  secondary: 0,
  accent: 0,
  contrast: 0,
  muted: 0,
  white: 0,
  success: 0,
  warning: 0,
  error: 0,
  info: 0,
  inherit: 0,
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai SpinnerDepth dan varian menjadi string key depthClasses yang valid.
 *
 * @param {SpinnerDepth} [depth] - Nilai depth eksplisit yang dioper
 * @param {SpinnerVariant} [variant='primary'] - Varian spinner untuk fallback jika depth tidak ditentukan
 * @returns {string} String key yang cocok di depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: SpinnerDepth, variant?: SpinnerVariant): string => {
  if (depth === undefined || depth === null) {
    if (variant && variant in defaultDepthByVariant) {
      const defaultVal = defaultDepthByVariant[variant];
      return String(defaultVal);
    }
    return '0';
  }

  const depthStr = String(depth);
  if (depthStr in namedDepthMap) {
    return namedDepthMap[depthStr];
  }

  if (depthStr in depthClasses) {
    return depthStr;
  }

  return '0';
};
