import type { InputSize, InputVariant, InputDepth } from '@/components/atoms/Input/Input.types';
import type { TextareaResize } from './Textarea.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<InputSize, string> = {
  sm: 'text-xs p-2.5 min-h-[70px]',
  md: 'text-sm p-3 min-h-[90px]',
  lg: 'text-base p-3.5 min-h-[120px]',
};

export const wrapperRadiusClasses: Record<InputSize, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-xl',
};

export const variantClasses: Record<InputVariant, string> = {
  outline:
    'bg-background border-2 border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
  filled:
    'bg-muted/70 border-2 border-transparent focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
  ghost:
    'bg-transparent border-2 border-transparent focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25',
};

export const resizeClasses: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

// Depth System: Skala -3 s/d 3 untuk form input & textarea (Ref: frontend/dev)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1) - Standar realistis form input
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
 * Textarea menggunakan fallback default '-1' (sunken/cekung).
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

// Class Base Tokens
export const labelClasses = 'flex items-center gap-1 select-none text-xs font-semibold text-foreground';

export const footerClasses = 'flex items-center justify-between gap-2 text-xs';

export const characterCounterClasses = 'flex items-center gap-2 select-none shrink-0 ml-auto text-2xs text-muted-foreground';
