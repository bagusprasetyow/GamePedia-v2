import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';
import type {
  CheckboxSize,
  CheckboxColor,
  CheckboxDepth,
} from './Checkbox.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export interface CheckboxSizeConfig {
  box: string;
  iconSize: IconSize;
  solidSize: string;
  labelSize: TextSize;
  descSize: TextSize;
}

export const sizeConfigMap: Record<CheckboxSize, CheckboxSizeConfig> = {
  sm: {
    box: 'h-4 w-4 rounded border-2',
    iconSize: '2xs',
    solidSize: 'h-2 w-2 rounded-xs',
    labelSize: 'xs',
    descSize: 'xs',
  },
  md: {
    box: 'h-5 w-5 rounded-md border-2',
    iconSize: 'xs',
    solidSize: 'h-3 w-3 rounded-xs',
    labelSize: 'sm',
    descSize: 'xs',
  },
  lg: {
    box: 'h-6 w-6 rounded-lg border-2',
    iconSize: 'sm',
    solidSize: 'h-3.5 w-3.5 rounded-sm',
    labelSize: 'base',
    descSize: 'sm',
  },
};

export interface CheckboxColorStyle {
  border: string;
  dot: string;
  hoverBorder: string;
  ring: string;
  checkBg: string;
  checkBorder: string;
  checkText: string;
}

export const colorStyleMap: Record<CheckboxColor, CheckboxColorStyle> = {
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
 * Memetakan nilai CheckboxDepth menjadi string key depthClasses yang valid.
 *
 * @param {CheckboxDepth} [depth] - Tingkat kedalaman visual (-3 s/d 3)
 * @returns {string} String key depth valid (default: '-1')
 */
export const resolveDepthKey = (depth?: CheckboxDepth): string => {
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
