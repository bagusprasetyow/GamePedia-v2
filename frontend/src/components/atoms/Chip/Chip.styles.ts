import { cn } from '@/lib/utils';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';
import type { ChipSize, ChipRounded, ChipWeight, ChipDepth } from './Chip.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Warna varian × appearance memakai appearanceClasses dari Badge)
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<ChipSize, string> = {
  sm: 'h-6 pl-2.5 pr-2.5 gap-1.5',
  md: 'h-7 pl-3 pr-3 gap-1.5',
  lg: 'h-8 pl-3.5 pr-3.5 gap-2',
};

export const removableSizeClasses: Record<ChipSize, string> = {
  sm: 'h-6 pl-2.5 pr-2 gap-1.5',
  md: 'h-7 pl-3 pr-2.5 gap-1.5',
  lg: 'h-8 pl-3.5 pr-3 gap-2',
};

export const sizeIconMap: Record<ChipSize, IconSize> = {
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
};

export const sizeTextMap: Record<ChipSize, TextSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
};

/** Gaya tombol hapus — identik dengan clearButtonClasses pada Input. */
export const removeButtonClasses = cn(
  // layout
  'flex shrink-0 items-center justify-center',
  // spacing
  'p-0.5 -mr-1.5',
  // border
  'rounded-full',
  // text
  'text-current',
  // interaction
  'opacity-70 hover:opacity-100 hover:text-destructive',
  // focus
  'focus:outline-none',
  // transition
  'transition-colors'
);

/** Ukuran ikon "x" satu tingkat di bawah clearIconSize pada Input (sm→2xs, md→xs, lg→sm). */
export const removeIconSizeMap: Record<ChipSize, IconSize> = {
  sm: '2xs',
  md: 'xs',
  lg: 'sm',
};

// Depth System: Skala -3 s/d 3 (chip interaktif → active feedback)
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2 active:shadow-n3',
  '-1': 'shadow-n1 active:shadow-n2',
  '0': 'shadow-0',
  '1': 'shadow-1 active:shadow-n1 active:translate-y-[1px]',
  '2': 'shadow-2 active:shadow-n1 active:translate-y-[1px]',
  '3': 'shadow-3 active:shadow-n2 active:translate-y-[1px]',
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

export const roundedClasses: Record<ChipRounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const weightClasses: Record<ChipWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/** Ring penanda status terpilih. */
export const selectedClasses = 'ring-2 ring-ring/40 ring-offset-1 ring-offset-background';

/** Hover untuk chip yang dapat diklik. */
export const clickableClasses = 'cursor-pointer hover:brightness-95';

/**
 * Memetakan nilai ChipDepth menjadi string key depthClasses yang valid.
 *
 * @param {ChipDepth} [depth] - Nilai depth eksplisit yang dioper
 * @returns {string} String key yang cocok di depthClasses ('-3' s/d '3'), default '0', fallback '1' untuk input tak dikenal
 */
export const resolveDepthKey = (depth?: ChipDepth): string => {
  if (depth === undefined || depth === null) {
    return '0';
  }

  const depthStr = String(depth);
  if (depthStr in namedDepthMap) {
    return namedDepthMap[depthStr];
  }

  if (depthStr in depthClasses) {
    return depthStr;
  }

  return '1';
};
