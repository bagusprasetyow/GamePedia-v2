import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';
import type {
  BadgeSize,
  BadgeAppearance,
  BadgeVariant,
  BadgeDepth,
  BadgeRounded,
  BadgeWeight,
} from './Badge.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<BadgeSize, string> = {
  xs: 'h-4 px-1.5 gap-1',
  sm: 'h-5 px-2 gap-1',
  md: 'h-6 px-2.5 gap-1.5',
  lg: 'h-7 px-3 gap-1.5',
};

export const iconOnlySizeClasses: Record<BadgeSize, string> = {
  xs: 'h-4 w-4 aspect-square p-0',
  sm: 'h-5 w-5 aspect-square p-0',
  md: 'h-6 w-6 aspect-square p-0',
  lg: 'h-7 w-7 aspect-square p-0',
};

export const sizeIconMap: Record<BadgeSize, IconSize> = {
  xs: '2xs',
  sm: '2xs',
  md: 'xs',
  lg: 'sm',
};

export const sizeTextMap: Record<BadgeSize, TextSize> = {
  xs: 'xs',
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
};

/**
 * Peta class per varian warna × appearance (filled, ghost, outline, tint).
 * Ditulis literal agar terdeteksi scanner Tailwind.
 */
export const appearanceClasses: Record<BadgeVariant, Record<BadgeAppearance, string>> = {
  brand: {
    filled: 'bg-primary text-primary-foreground border border-transparent',
    ghost: 'bg-transparent text-primary border border-transparent',
    outline: 'bg-transparent text-primary border border-primary',
    tint: 'bg-primary/10 text-primary border border-primary/20',
  },
  danger: {
    filled: 'bg-destructive text-white border border-transparent',
    ghost: 'bg-transparent text-destructive border border-transparent',
    outline: 'bg-transparent text-destructive border border-destructive',
    tint: 'bg-destructive/10 text-destructive border border-destructive/20',
  },
  important: {
    filled: 'bg-foreground text-background border border-transparent',
    ghost: 'bg-transparent text-foreground border border-transparent',
    outline: 'bg-transparent text-foreground border border-foreground',
    tint: 'bg-foreground/75 text-background border border-transparent',
  },
  informative: {
    filled: 'bg-muted text-muted-foreground border border-border/40',
    ghost: 'bg-transparent text-muted-foreground border border-transparent',
    outline: 'bg-transparent text-muted-foreground border border-border',
    tint: 'bg-muted/60 text-muted-foreground border border-border/60',
  },
  severe: {
    filled: 'bg-severe-600 text-white border border-transparent',
    ghost: 'bg-transparent text-severe-600 border border-transparent',
    outline: 'bg-transparent text-severe-600 border border-severe-600',
    tint: 'bg-severe-600/10 text-severe-700 border border-severe-600/20',
  },
  subtle: {
    filled: 'bg-transparent text-foreground border border-transparent',
    ghost: 'bg-transparent text-muted-foreground border border-transparent',
    outline: 'bg-transparent text-foreground border border-border/60',
    tint: 'bg-card text-foreground border border-border/60',
  },
  success: {
    filled: 'bg-success text-white border border-transparent',
    ghost: 'bg-transparent text-success-600 border border-transparent',
    outline: 'bg-transparent text-success-700 border border-success-700',
    tint: 'bg-success/10 text-success-700 border border-success/20',
  },
  warning: {
    filled: 'bg-warning text-neutral-950 border border-transparent',
    ghost: 'bg-transparent text-warning border border-transparent',
    outline: 'bg-transparent text-warning border border-warning',
    tint: 'bg-warning/10 text-warning border border-warning/20',
  },
  primary: {
    filled: 'bg-primary text-primary-foreground border border-transparent',
    ghost: 'bg-transparent text-primary border border-transparent',
    outline: 'bg-transparent text-primary border border-primary',
    tint: 'bg-primary/10 text-primary border border-primary/20',
  },
  secondary: {
    filled: 'bg-secondary text-secondary-foreground border border-border/40',
    ghost: 'bg-transparent text-secondary-foreground border border-transparent',
    outline: 'bg-transparent text-secondary-foreground border border-border',
    tint: 'bg-secondary/40 text-secondary-foreground border border-border/40',
  },
  accent: {
    filled: 'bg-accent-600 text-white border border-transparent',
    ghost: 'bg-transparent text-accent-600 border border-transparent',
    outline: 'bg-transparent text-accent-600 border border-accent-600',
    tint: 'bg-accent-600/10 text-accent-700 border border-accent-600/20',
  },
  muted: {
    filled: 'bg-muted text-muted-foreground border border-transparent',
    ghost: 'bg-transparent text-muted-foreground border border-transparent',
    outline: 'bg-transparent text-muted-foreground border border-border',
    tint: 'bg-muted/60 text-muted-foreground border border-border/60',
  },
  outline: {
    filled: 'bg-transparent text-foreground border border-border',
    ghost: 'bg-transparent text-foreground border border-transparent',
    outline: 'bg-transparent text-foreground border border-border',
    tint: 'bg-card text-foreground border border-border',
  },
  error: {
    filled: 'bg-destructive text-white border border-transparent',
    ghost: 'bg-transparent text-destructive border border-transparent',
    outline: 'bg-transparent text-destructive border border-destructive',
    tint: 'bg-destructive/10 text-destructive border border-destructive/20',
  },
  info: {
    filled: 'bg-info-600 text-white border border-transparent',
    ghost: 'bg-transparent text-info-600 border border-transparent',
    outline: 'bg-transparent text-info-600 border border-info-600',
    tint: 'bg-info-600/10 text-info-700 border border-info-600/20',
  },
};

/** Peta varian → class appearance 'filled' (kompatibel mundur). */
export const variantClasses: Record<BadgeVariant, string> = Object.fromEntries(
  (Object.keys(appearanceClasses) as BadgeVariant[]).map((v) => [v, appearanceClasses[v].filled])
) as Record<BadgeVariant, string>;

// Depth System: Skala -3 s/d 3 (non-interaktif → hover, bukan active)
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2 hover:shadow-n3',
  '-1': 'shadow-n1 hover:shadow-n2',
  '0': 'shadow-0',
  '1': 'shadow-1 hover:shadow-2',
  '2': 'shadow-2 hover:shadow-3',
  '3': 'shadow-3',
};

export const defaultDepthByVariant: Record<BadgeVariant, BadgeDepth> = Object.fromEntries(
  (Object.keys(appearanceClasses) as BadgeVariant[]).map((v) => [v, 0])
) as Record<BadgeVariant, BadgeDepth>;

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

export const roundedClasses: Record<BadgeRounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const weightClasses: Record<BadgeWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

/**
 * Memetakan nilai BadgeDepth dan varian menjadi string key depthClasses yang valid.
 *
 * @param {BadgeDepth} [depth] - Nilai depth eksplisit yang dioper
 * @param {BadgeVariant} [variant] - Varian badge untuk menentukan default depth
 * @returns {string} String key yang cocok di depthClasses ('-3' s/d '3'), fallback '1'
 */
export const resolveDepthKey = (depth?: BadgeDepth, variant?: BadgeVariant): string => {
  if (depth === undefined || depth === null) {
    if (variant && variant in defaultDepthByVariant) {
      return String(defaultDepthByVariant[variant]);
    }
    return '1';
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
