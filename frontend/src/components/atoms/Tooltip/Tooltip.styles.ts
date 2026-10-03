import type {
  TooltipPlacement,
  TooltipVariant,
  TooltipSize,
  TooltipDepth,
} from './Tooltip.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  'left-start': 'right-full top-0 mr-2',
  'left-end': 'right-full bottom-0 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  'right-start': 'left-full top-0 ml-2',
  'right-end': 'left-full bottom-0 ml-2',
};

export const arrowPlacementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r',
  'top-start': 'bottom-[-5px] left-3 border-b border-r',
  'top-end': 'bottom-[-5px] right-3 border-b border-r',
  bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l',
  'bottom-start': 'top-[-5px] left-3 border-t border-l',
  'bottom-end': 'top-[-5px] right-3 border-t border-l',
  left: 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r',
  'left-start': 'right-[-5px] top-3 border-t border-r',
  'left-end': 'right-[-5px] bottom-3 border-t border-r',
  right: 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l',
  'right-start': 'left-[-5px] top-3 border-b border-l',
  'right-end': 'left-[-5px] bottom-3 border-b border-l',
};

export const variantClasses: Record<
  TooltipVariant,
  { bubble: string; arrow: string }
> = {
  dark: {
    bubble: 'bg-neutral-900 border-neutral-800 text-neutral-100',
    arrow: 'bg-neutral-900 border-neutral-800',
  },
  light: {
    bubble: 'bg-white border-neutral-200 text-neutral-900',
    arrow: 'bg-white border-neutral-200',
  },
  primary: {
    bubble: 'bg-primary-600 border-primary-500 text-white',
    arrow: 'bg-primary-600 border-primary-500',
  },
  secondary: {
    bubble: 'bg-secondary-600 border-secondary-500 text-white',
    arrow: 'bg-secondary-600 border-secondary-500',
  },
  accent: {
    bubble: 'bg-accent-600 border-accent-500 text-white',
    arrow: 'bg-accent-600 border-accent-500',
  },
  contrast: {
    bubble:
      'bg-neutral-950 dark:bg-white border-neutral-800 dark:border-neutral-200 text-white dark:text-neutral-900',
    arrow:
      'bg-neutral-950 dark:bg-white border-neutral-800 dark:border-neutral-200',
  },
  info: {
    bubble: 'bg-info-600 border-info-500 text-white',
    arrow: 'bg-info-600 border-info-500',
  },
  success: {
    bubble: 'bg-success-600 border-success-500 text-white',
    arrow: 'bg-success-600 border-success-500',
  },
  warning: {
    bubble: 'bg-warning-600 border-warning-500 text-white',
    arrow: 'bg-warning-600 border-warning-500',
  },
  error: {
    bubble: 'bg-error-600 border-error-500 text-white',
    arrow: 'bg-error-600 border-error-500',
  },
};

export const sizeClasses: Record<
  TooltipSize,
  { bubble: string; textSize: 'xs' | 'sm' | 'base'; iconSizePreset: 'xs' | 'sm' | 'md' | 'lg' }
> = {
  xs: { bubble: 'px-2 py-1 rounded-md gap-1', textSize: 'xs', iconSizePreset: 'xs' },
  sm: { bubble: 'px-2.5 py-1 rounded-lg gap-1.5', textSize: 'xs', iconSizePreset: 'sm' },
  md: { bubble: 'px-3 py-1.5 rounded-xl gap-2', textSize: 'sm', iconSizePreset: 'md' },
  lg: { bubble: 'px-4 py-2 rounded-xl gap-2.5', textSize: 'base', iconSizePreset: 'lg' },
};

// Depth System: Skala -3 s/d 3 untuk gelembung tooltip (Ref: frontend/dev)
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
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

// Alias kompatibilitas
export const depthNamedMap = namedDepthMap;

/**
 * Memetakan nilai TooltipDepth menjadi string key depthClasses yang valid.
 * Tooltip overlay menggunakan fallback default elevasi timbul '3'.
 *
 * @param {TooltipDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: TooltipDepth): string => {
  if (depth === undefined || depth === null) {
    return '3';
  }

  const depthStr = String(depth);
  if (depthStr in namedDepthMap) {
    return namedDepthMap[depthStr];
  }

  if (depthStr in depthClasses) {
    return depthStr;
  }

  return '3';
};
