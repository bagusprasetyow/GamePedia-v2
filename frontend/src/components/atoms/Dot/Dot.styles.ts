import type { TextSize } from '@/components/atoms/Text/Text.types';
import type {
  DotSize,
  DotVariant,
  DotDepth,
  DotPlacement,
} from './Dot.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<DotSize, string> = {
  '2xs': 'w-1.5 h-1.5 min-w-1.5 min-h-1.5',
  xs: 'w-2 h-2 min-w-2 min-h-2',
  sm: 'w-2.5 h-2.5 min-w-2.5 min-h-2.5',
  md: 'w-3 h-3 min-w-3 min-h-3',
  lg: 'w-3.5 h-3.5 min-w-3.5 min-h-3.5',
  xl: 'w-4 h-4 min-w-4 min-h-4',
};

export const sizeLabelMap: Record<DotSize, { textSize: TextSize; gap: string }> = {
  '2xs': { textSize: 'xs', gap: 'gap-1.5' },
  xs: { textSize: 'xs', gap: 'gap-1.5' },
  sm: { textSize: 'xs', gap: 'gap-2' },
  md: { textSize: 'sm', gap: 'gap-2' },
  lg: { textSize: 'sm', gap: 'gap-2.5' },
  xl: { textSize: 'base', gap: 'gap-2.5' },
};

export const variantClasses: Record<
  DotVariant,
  { dot: string; ping: string; glow: string }
> = {
  primary: {
    dot: 'bg-primary',
    ping: 'bg-primary',
    glow: 'shadow-[0_0_8px_var(--primary)]',
  },
  secondary: {
    dot: 'bg-secondary-500',
    ping: 'bg-secondary-500',
    glow: 'shadow-[0_0_8px_var(--color-secondary-500)]',
  },
  accent: {
    dot: 'bg-accent-500',
    ping: 'bg-accent-500',
    glow: 'shadow-[0_0_8px_var(--color-accent-500)]',
  },
  neutral: {
    dot: 'bg-neutral-400 dark:bg-neutral-500',
    ping: 'bg-neutral-400 dark:bg-neutral-500',
    glow: 'shadow-[0_0_8px_var(--color-neutral-400)]',
  },
  success: {
    dot: 'bg-success',
    ping: 'bg-success',
    glow: 'shadow-[0_0_8px_var(--color-success)]',
  },
  warning: {
    dot: 'bg-warning',
    ping: 'bg-warning',
    glow: 'shadow-[0_0_8px_var(--color-warning)]',
  },
  error: {
    dot: 'bg-destructive',
    ping: 'bg-destructive',
    glow: 'shadow-[0_0_8px_var(--color-destructive)]',
  },
  info: {
    dot: 'bg-info',
    ping: 'bg-info',
    glow: 'shadow-[0_0_8px_var(--color-info)]',
  },
  contrast: {
    dot: 'bg-foreground',
    ping: 'bg-foreground',
    glow: 'shadow-[0_0_8px_var(--foreground)]',
  },
  white: {
    dot: 'bg-white',
    ping: 'bg-white',
    glow: 'shadow-[0_0_8px_oklch(1_0_0)]',
  },
};

// Depth System: Skala -3 s/d 3 (Ref: frontend/dev)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1)
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

export const placementClasses: Record<DotPlacement, string> = {
  'top-right': 'top-0 right-0 -translate-y-1/2 translate-x-1/2',
  'top-left': 'top-0 left-0 -translate-y-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-0 right-0 translate-y-1/2 translate-x-1/2',
  'bottom-left': 'bottom-0 left-0 translate-y-1/2 -translate-x-1/2',
};

const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai DotDepth menjadi string key depthClasses yang valid.
 */
export const resolveDepthKey = (depth?: DotDepth): string => {
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

  return '0';
};
