import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type {
  SegmentedControlSize,
  SegmentedControlColor,
  SegmentedControlDepth,
} from './SegmentedControl.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export interface SegmentedControlSizeStyle {
  container: string;
  item: string;
  text: string;
  iconSize: IconSize;
  gap: string;
}

export const sizeStyles: Record<SegmentedControlSize, SegmentedControlSizeStyle> = {
  sm: {
    container: 'p-0.5 rounded-lg',
    item: 'h-7 px-2.5 rounded-md gap-1.5',
    text: 'text-xs',
    iconSize: 'xs',
    gap: 'gap-0.5',
  },
  md: {
    container: 'p-1 rounded-xl',
    item: 'h-8.5 px-3.5 rounded-lg gap-2',
    text: 'text-sm',
    iconSize: 'sm',
    gap: 'gap-1',
  },
  lg: {
    container: 'p-1 rounded-xl',
    item: 'h-10 px-4.5 rounded-lg gap-2.5',
    text: 'text-base',
    iconSize: 'md',
    gap: 'gap-1.5',
  },
};

export const activeColorStyles: Record<SegmentedControlColor, string> = {
  primary: 'bg-primary text-primary-foreground shadow-1',
  secondary: 'bg-secondary text-secondary-foreground shadow-1',
  accent: 'bg-accent-600 text-white shadow-1',
  success: 'bg-success text-white shadow-1',
  warning: 'bg-warning text-neutral-950 shadow-1',
  error: 'bg-destructive text-white shadow-1',
  info: 'bg-info-600 text-white shadow-1',
};

export const indicatorColorStyles: Record<SegmentedControlColor, string> = {
  primary: 'bg-primary shadow-1',
  secondary: 'bg-secondary shadow-1',
  accent: 'bg-accent-600 shadow-1',
  success: 'bg-success shadow-1',
  warning: 'bg-warning shadow-1',
  error: 'bg-destructive shadow-1',
  info: 'bg-info-600 shadow-1',
};

export const activeTextStyles: Record<SegmentedControlColor, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  accent: 'text-white',
  success: 'text-white',
  warning: 'text-neutral-950',
  error: 'text-white',
  info: 'text-white',
};

export const indicatorRadiusMap: Record<SegmentedControlSize, string> = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-lg',
};

export const indicatorBaseClasses =
  'absolute transition-all duration-200 ease-out pointer-events-none motion-reduce:transition-none z-0';

export const inactiveItemClasses =
  'text-muted-foreground hover:text-foreground hover:bg-card/40 active:bg-card/60 bg-transparent';

// Depth System: Skala -3 s/d 3 untuk wadah alur segmented control (Ref: GamePedia-v2 design system)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1) - Wadah alur trek cekung
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
 * Memetakan nilai SegmentedControlDepth menjadi string key depthClasses yang valid.
 * Wadah trek bawaan menggunakan alur cekung / sunken ('-1').
 *
 * @param {SegmentedControlDepth} [depth] - Nilai depth yang diberikan
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: SegmentedControlDepth): string => {
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

// Base CSS Classes
export const containerBaseClasses =
  'relative inline-flex items-center bg-muted border border-border/40 select-none transition-colors';

export const itemBaseClasses =
  'relative inline-flex items-center justify-center font-medium select-none outline-none whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background';
