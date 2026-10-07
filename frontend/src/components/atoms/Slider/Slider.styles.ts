import type {
  SliderSize,
  SliderColor,
  SliderDepth,
} from './Slider.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export interface SliderSizeStyle {
  trackHorizontal: string;
  trackVertical: string;
  thumb: string;
  thumbIcon: string;
  label: string;
  markDot: string;
  markLabel: string;
  tooltip: string;
}

export const sizeStyles: Record<SliderSize, SliderSizeStyle> = {
  sm: {
    trackHorizontal: 'h-1.5',
    trackVertical: 'w-1.5 min-h-[140px]',
    thumb: 'h-4 w-4',
    thumbIcon: 'text-[10px]',
    label: 'text-xs',
    markDot: 'h-1.5 w-1.5',
    markLabel: 'text-[11px]',
    tooltip: 'text-[10px] py-0.5 px-1.5',
  },
  md: {
    trackHorizontal: 'h-2.5',
    trackVertical: 'w-2.5 min-h-[180px]',
    thumb: 'h-5 w-5',
    thumbIcon: 'text-xs',
    label: 'text-sm',
    markDot: 'h-2 w-2',
    markLabel: 'text-xs',
    tooltip: 'text-xs py-1 px-2',
  },
  lg: {
    trackHorizontal: 'h-3.5',
    trackVertical: 'w-3.5 min-h-[220px]',
    thumb: 'h-6 w-6',
    thumbIcon: 'text-sm',
    label: 'text-base',
    markDot: 'h-2.5 w-2.5',
    markLabel: 'text-sm',
    tooltip: 'text-xs py-1 px-2.5',
  },
};

export interface SliderColorStyle {
  range: string;
  thumbBorder: string;
  focusRing: string;
  thumbHover: string;
}

export const colorStyles: Record<SliderColor, SliderColorStyle> = {
  primary: {
    range: 'bg-primary',
    thumbBorder: 'border-primary',
    focusRing: 'focus-visible:ring-primary/30',
    thumbHover: 'hover:border-primary-hover',
  },
  secondary: {
    range: 'bg-secondary',
    thumbBorder: 'border-secondary',
    focusRing: 'focus-visible:ring-secondary/30',
    thumbHover: 'hover:border-secondary-hover',
  },
  accent: {
    range: 'bg-accent-600',
    thumbBorder: 'border-accent-600',
    focusRing: 'focus-visible:ring-accent-600/30',
    thumbHover: 'hover:border-accent-700',
  },
  success: {
    range: 'bg-success',
    thumbBorder: 'border-success',
    focusRing: 'focus-visible:ring-success/30',
    thumbHover: 'hover:border-success',
  },
  warning: {
    range: 'bg-warning',
    thumbBorder: 'border-warning',
    focusRing: 'focus-visible:ring-warning/30',
    thumbHover: 'hover:border-warning',
  },
  error: {
    range: 'bg-destructive',
    thumbBorder: 'border-destructive',
    focusRing: 'focus-visible:ring-destructive/30',
    thumbHover: 'hover:border-destructive',
  },
  info: {
    range: 'bg-info-600',
    thumbBorder: 'border-info-600',
    focusRing: 'focus-visible:ring-info-600/30',
    thumbHover: 'hover:border-info-700',
  },
};

// Depth System: Skala -3 s/d 3 untuk trek slider (Ref: GamePedia-v2 design system)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1) - Ideal untuk trek alur slider
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
 * Memetakan nilai SliderDepth menjadi string key depthClasses yang valid.
 * Trek slider default menggunakan kedalaman alur cekung / sunken ('-1').
 *
 * @param {SliderDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: SliderDepth): string => {
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
  'relative rounded-full bg-muted border border-border/40 select-none touch-none';

export const thumbBaseClasses =
  'absolute z-10 flex items-center justify-center rounded-full bg-background border-2 shadow-2 outline-none select-none touch-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-transform duration-75';

export const tooltipBaseClasses =
  'absolute flex items-center justify-center font-medium bg-neutral-900 text-neutral-50 rounded-md shadow-md pointer-events-none whitespace-nowrap z-20';

export const markTickClasses =
  'absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors pointer-events-none';

export const markLabelClasses =
  'absolute select-none font-medium text-muted-foreground whitespace-nowrap';

export const labelContainerClasses =
  'flex items-center justify-between gap-2 select-none mb-1.5';

export const helperTextContainerClasses =
  'flex flex-col gap-0.5 mt-1 select-none';
