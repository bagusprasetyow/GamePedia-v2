import type {
  ProgressBarSize,
  ProgressBarColor,
  ProgressBarDepth,
} from './ProgressBar.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export interface ProgressBarSizeStyle {
  trackHeight: string;
  labelText: string;
  valueText: string;
}

export const sizeStyles: Record<ProgressBarSize, ProgressBarSizeStyle> = {
  sm: {
    trackHeight: 'h-1.5',
    labelText: 'text-xs',
    valueText: 'text-xs',
  },
  md: {
    trackHeight: 'h-2.5',
    labelText: 'text-sm',
    valueText: 'text-xs',
  },
  lg: {
    trackHeight: 'h-3.5',
    labelText: 'text-base',
    valueText: 'text-sm',
  },
};

export const colorStyles: Record<ProgressBarColor, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent-600',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info-600',
};

// Depth System: Skala -3 s/d 3 untuk track alur progres (Ref: GamePedia-v2 design system)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1) - Ideal untuk track alur progres
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
 * Memetakan nilai ProgressBarDepth menjadi string key depthClasses yang valid.
 * Track ProgressBar bawaan menggunakan alur cekung / sunken ('-1').
 *
 * @param {ProgressBarDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: ProgressBarDepth): string => {
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

// Base & Helper CSS Classes
export const trackBaseClasses =
  'relative w-full overflow-hidden rounded-full bg-muted border border-border/40 select-none';

export const fillBaseClasses =
  'h-full rounded-full transition-[width] duration-300 ease-out motion-reduce:transition-none';

export const indeterminateFillClasses =
  'absolute inset-y-0 w-2/5 rounded-full animate-[progress-indeterminate_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none motion-reduce:w-full motion-reduce:opacity-75';

export const labelContainerClasses =
  'flex items-center justify-between gap-2 select-none mb-1.5';

export const descriptionClasses =
  'text-xs text-muted-foreground mt-1.5 select-none';
