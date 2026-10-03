import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type {
  InputSize,
  InputVariant,
  InputDepth,
} from './Input.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export interface InputSizeStyle {
  container: string;
  input: string;
  iconSize: IconSize;
  clearIconSize: IconSize;
  adornmentGap: string;
}

export const sizeStyles: Record<InputSize, InputSizeStyle> = {
  sm: {
    container: 'h-8 px-2.5 text-xs rounded-lg',
    input: 'text-xs',
    iconSize: 'sm',
    clearIconSize: 'xs',
    adornmentGap: 'gap-1.5',
  },
  md: {
    container: 'h-10 px-3.5 text-sm rounded-xl',
    input: 'text-sm',
    iconSize: 'md',
    clearIconSize: 'sm',
    adornmentGap: 'gap-2',
  },
  lg: {
    container: 'h-12 px-4 text-base rounded-xl',
    input: 'text-base',
    iconSize: 'lg',
    clearIconSize: 'md',
    adornmentGap: 'gap-2.5',
  },
};

export const variantStyles: Record<InputVariant, string> = {
  outline:
    'bg-background border-2 border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
  filled:
    'bg-muted/70 border-2 border-transparent focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
  ghost:
    'bg-transparent border-2 border-transparent focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
};

// Depth System: Skala -3 s/d 3 (Ref: frontend/dev)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1) - Ideal untuk input form
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',

  // Rata / Flat (0)
  '0': 'shadow-0',

  // Timbul / Raised (1, 2, 3)
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai InputDepth menjadi string key depthClasses yang valid.
 * Input field menggunakan fallback default '-1' (sunken/cekung).
 *
 * @param {InputDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: InputDepth): string => {
  if (depth === undefined || depth === null) {
    return '-1';
  }

  const depthStr = String(depth);
  if (depthStr in namedDepthMap) {
    return namedDepthMap[depthStr];
  }

  if (depthStr in depthClasses) {
    return depthStr;
  }

  return '-1';
};

export const labelClasses = 'flex items-center gap-1 select-none text-xs font-semibold text-foreground';

export const adornmentClasses = 'flex shrink-0 items-center select-none text-muted-foreground';

export const clearButtonClasses =
  'flex shrink-0 items-center justify-center p-0.5 -mr-1.5 rounded-full text-muted-foreground hover:text-destructive focus:outline-none transition-colors';
