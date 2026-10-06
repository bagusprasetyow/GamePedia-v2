import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type {
  ClearButtonSize,
  ClearButtonVariant,
  ClearButtonRounded,
  ClearButtonDepth,
} from './ClearButton.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<ClearButtonSize, string> = {
  '2xs': 'size-4 p-0.5',
  xs: 'size-5 p-0.5',
  sm: 'size-6 p-0.5',
  md: 'size-7 p-1',
  lg: 'size-8 p-1',
};

export const defaultIconSizeMap: Record<ClearButtonSize, IconSize> = {
  '2xs': '2xs',
  xs: '2xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export const variantClasses: Record<ClearButtonVariant, string> = {
  default:
    'text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20',
  subtle:
    'text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80',
  ghost:
    'text-current opacity-70 hover:opacity-100 hover:text-destructive active:opacity-90',
  danger:
    'text-destructive hover:bg-destructive/15 active:bg-destructive/25',
};

export const roundedClasses: Record<ClearButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

// Depth System: Skala -3 s/d 3
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2 active:shadow-n3',
  '-1': 'shadow-n1 active:shadow-n2',
  '0': 'shadow-0',
  '1': 'shadow-1 active:shadow-n1 active:translate-y-[0.5px]',
  '2': 'shadow-2 active:shadow-n1 active:translate-y-[0.5px]',
  '3': 'shadow-3 active:shadow-n2 active:translate-y-[0.5px]',
};

export const defaultDepthByVariant: Record<ClearButtonVariant, ClearButtonDepth> = {
  default: 0,
  subtle: 0,
  ghost: 0,
  danger: 0,
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai ClearButtonDepth dan varian menjadi string key depthClasses yang valid.
 *
 * @param {ClearButtonDepth} [depth] - Nilai depth eksplisit
 * @param {ClearButtonVariant} [variant] - Varian tombol pembersih untuk default depth
 * @returns {string} String key depthClasses ('-3' s/d '3'), fallback '0'
 */
export const resolveDepthKey = (
  depth?: ClearButtonDepth,
  variant?: ClearButtonVariant
): string => {
  if (depth === undefined || depth === null) {
    if (variant && variant in defaultDepthByVariant) {
      return String(defaultDepthByVariant[variant]);
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
