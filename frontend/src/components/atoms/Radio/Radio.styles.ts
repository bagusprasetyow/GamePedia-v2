import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type {
  RadioSize,
  RadioColor,
  RadioDepth,
} from './Radio.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export interface RadioSizeConfig {
  circle: string;
  solidDot: string;
  iconSize: IconSize;
}

export const sizeConfigMap: Record<RadioSize, RadioSizeConfig> = {
  sm: {
    circle: 'h-4 w-4 border-2',
    solidDot: 'h-2 w-2',
    iconSize: '2xs',
  },
  md: {
    circle: 'h-5 w-5 border-2',
    solidDot: 'h-3 w-3',
    iconSize: 'xs',
  },
  lg: {
    circle: 'h-6 w-6 border-[2.5px]',
    solidDot: 'h-3.5 w-3.5',
    iconSize: 'sm',
  },
};

export interface RadioColorStyle {
  border: string;
  dot: string;
  hoverBorder: string;
  ring: string;
  checkBg: string;
  checkBorder: string;
  checkText: string;
}

export const colorStyleMap: Record<RadioColor, RadioColorStyle> = {
  primary: {
    border: 'border-primary',
    dot: 'bg-primary',
    hoverBorder: 'hover:border-primary',
    ring: 'focus-visible:ring-primary/30',
    checkBg: 'bg-primary',
    checkBorder: 'border-primary',
    checkText: 'text-primary-foreground',
  },
  secondary: {
    border: 'border-secondary',
    dot: 'bg-secondary',
    hoverBorder: 'hover:border-secondary',
    ring: 'focus-visible:ring-secondary/30',
    checkBg: 'bg-secondary',
    checkBorder: 'border-secondary',
    checkText: 'text-secondary-foreground',
  },
  accent: {
    border: 'border-accent-600',
    dot: 'bg-accent-600',
    hoverBorder: 'hover:border-accent-600',
    ring: 'focus-visible:ring-accent-600/30',
    checkBg: 'bg-accent-600',
    checkBorder: 'border-accent-600',
    checkText: 'text-white',
  },
  success: {
    border: 'border-success',
    dot: 'bg-success',
    hoverBorder: 'hover:border-success',
    ring: 'focus-visible:ring-success/30',
    checkBg: 'bg-success',
    checkBorder: 'border-success',
    checkText: 'text-white',
  },
  warning: {
    border: 'border-warning',
    dot: 'bg-warning',
    hoverBorder: 'hover:border-warning',
    ring: 'focus-visible:ring-warning/30',
    checkBg: 'bg-warning',
    checkBorder: 'border-warning',
    checkText: 'text-neutral-950',
  },
  error: {
    border: 'border-destructive',
    dot: 'bg-destructive',
    hoverBorder: 'hover:border-destructive',
    ring: 'focus-visible:ring-destructive/30',
    checkBg: 'bg-destructive',
    checkBorder: 'border-destructive',
    checkText: 'text-white',
  },
  info: {
    border: 'border-info-600',
    dot: 'bg-info-600',
    hoverBorder: 'hover:border-info-600',
    ring: 'focus-visible:ring-info-600/30',
    checkBg: 'bg-info-600',
    checkBorder: 'border-info-600',
    checkText: 'text-white',
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

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai RadioDepth menjadi string key depthClasses yang valid.
 * Radio button menggunakan fallback default '-1' (sunken/cekung).
 *
 * @param {RadioDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: RadioDepth): string => {
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

export const labelWrapperClasses = 'flex flex-col text-left';

export const labelTitleClasses = 'text-sm font-medium text-foreground transition-colors group-hover:text-foreground';

export const labelDescClasses = 'text-xs text-muted-foreground';
