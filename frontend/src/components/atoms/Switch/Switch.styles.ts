import type {
  SwitchSize,
  SwitchVariant,
  SwitchDepth,
  SwitchSizeConfig,
} from './Switch.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeConfigMap: Record<SwitchSize, SwitchSizeConfig> = {
  sm: {
    track: 'h-5 w-9 p-0.5',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
    iconSize: '2xs',
  },
  md: {
    track: 'h-6 w-11 p-0.5',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
    iconSize: 'xs',
  },
  lg: {
    track: 'h-7 w-14 p-1',
    thumb: 'h-5 w-5',
    translate: 'translate-x-7',
    iconSize: 'sm',
  },
  xl: {
    track: 'h-8 w-16 p-1',
    thumb: 'h-6 w-6',
    translate: 'translate-x-8',
    iconSize: 'md',
  },
};

export const variantClasses: Record<SwitchVariant, string> = {
  primary: 'bg-primary border-primary text-primary-foreground',
  secondary: 'bg-secondary border-secondary text-secondary-foreground',
  accent: 'bg-accent-600 border-accent-600 text-white',
  success: 'bg-success border-success text-white',
  warning: 'bg-warning border-warning text-neutral-950',
  error: 'bg-destructive border-destructive text-white',
  info: 'bg-info-600 border-info-600 text-white',
};

// Depth System: Skala -3 s/d 3 untuk trek switch (Ref: frontend/dev)
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
 * Memetakan nilai SwitchDepth menjadi string key depthClasses yang valid.
 * Trek switch default menggunakan kedalaman alur cekung / sunken ('-1').
 *
 * @param {SwitchDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: SwitchDepth): string => {
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

// Class Base & Label Tokens
export const trackInactiveClasses = 'bg-muted border-border text-muted-foreground';

export const labelWrapperClasses = 'flex flex-col text-left';

export const labelTitleClasses = 'text-sm font-medium text-foreground';

export const labelDescClasses = 'text-xs text-muted-foreground';
