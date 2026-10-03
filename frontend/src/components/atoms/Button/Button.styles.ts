import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { TextSize } from '@/components/atoms/Text/Text.types';
import type {
  ButtonSize,
  ButtonVariant,
  ButtonDepth,
  ButtonRounded,
  ButtonWeight,
  ButtonJustify,
  ButtonGap,
  ButtonCursor,
} from './Button.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<ButtonSize, string> = {
  '2xs': 'h-6 px-2 text-xs',
  xs: 'h-7 px-2.5 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
  xl: 'h-12 px-6 text-lg',
};

export const iconOnlySizeClasses: Record<ButtonSize, string> = {
  '2xs': 'h-6 w-6 min-w-6 aspect-square p-0 shrink-0',
  xs: 'h-7 w-7 min-w-7 aspect-square p-0 shrink-0',
  sm: 'h-8 w-8 min-w-8 aspect-square p-0 shrink-0',
  md: 'h-10 w-10 min-w-10 aspect-square p-0 shrink-0',
  lg: 'h-11 w-11 min-w-11 aspect-square p-0 shrink-0',
  xl: 'h-12 w-12 min-w-12 aspect-square p-0 shrink-0',
};

export const defaultIconSizeMap: Record<ButtonSize, IconSize> = {
  '2xs': '2xs',
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

export const defaultIconOnlySizeMap: Record<ButtonSize, IconSize> = {
  '2xs': 'xs',
  xs: 'sm',
  sm: 'md',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

export const sizeLoadingTextMap: Record<ButtonSize, TextSize> = {
  '2xs': 'xs',
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'base',
  xl: 'lg',
};

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active border border-transparent',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active border border-border/40',
  accent:
    'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 border border-transparent',
  outline:
    'border border-border hover:border-border-hover bg-card/60 text-foreground hover:bg-muted active:bg-muted-hover',
  ghost:
    'bg-transparent text-foreground hover:bg-muted active:bg-muted-hover border border-transparent',
  contrast:
    'bg-foreground text-background hover:opacity-90 active:opacity-80 border border-transparent',
  success:
    'bg-success text-white hover:brightness-95 active:brightness-90 border border-transparent',
  warning:
    'bg-warning text-neutral-950 hover:brightness-95 active:brightness-90 border border-transparent',
  error:
    'bg-destructive text-white hover:brightness-95 active:brightness-90 border border-transparent',
  info:
    'bg-info-600 text-white hover:bg-info-700 active:bg-info-800 border border-transparent',
  close:
    'bg-transparent text-muted-foreground hover:bg-destructive hover:text-white active:brightness-90 border border-transparent',
};

// Depth System: Skala -3 s/d 3 (Ref: frontend/dev)
export const depthClasses: Record<string, string> = {
  // Cekung / Sunken (-3, -2, -1)
  '-3': 'shadow-n3',
  '-2': 'shadow-n2 active:shadow-n3',
  '-1': 'shadow-n1 active:shadow-n2',

  // Rata / Flat (0)
  '0': 'shadow-0',

  // Timbul / Raised (1, 2, 3) (dengan tactile feedback saat ditekan)
  '1': 'shadow-1 active:shadow-n1 active:translate-y-[1px]',
  '2': 'shadow-2 active:shadow-n1 active:translate-y-[1px]',
  '3': 'shadow-3 active:shadow-n2 active:translate-y-[1px]',
};

export const defaultDepthByVariant: Record<ButtonVariant, ButtonDepth> = {
  primary: 1,
  secondary: 1,
  accent: 1,
  contrast: 1,
  success: 1,
  warning: 1,
  error: 1,
  info: 1,
  outline: 0,
  ghost: 0,
  close: 0,
};

export const roundedClasses: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  default: 'rounded-xl',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const weightClasses: Record<ButtonWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const justifyClasses: Record<ButtonJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const gapClasses: Record<ButtonGap, string> = {
  '2xs': 'gap-1',
  xs: 'gap-1.5',
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3',
  xl: 'gap-3.5',
};

export const cursorClasses: Record<ButtonCursor, string> = {
  auto: 'cursor-auto',
  default: 'cursor-default',
  pointer: 'cursor-pointer',
  wait: 'cursor-wait',
  text: 'cursor-text',
  move: 'cursor-move',
  help: 'cursor-help',
  'not-allowed': 'cursor-not-allowed',
  none: 'cursor-none',
  progress: 'cursor-progress',
  grab: 'cursor-grab',
  grabbing: 'cursor-grabbing',
  crosshair: 'cursor-crosshair',
  copy: 'cursor-copy',
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai ButtonDepth dan varian menjadi string key depthClasses yang valid.
 *
 * @param {ButtonDepth} [depth] - Nilai depth eksplisit yang dioper
 * @param {ButtonVariant} [variant='primary'] - Varian tombol untuk menentukan default depth jika depth tidak ditentukan
 * @returns {string} String key yang cocok di depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (depth?: ButtonDepth, variant?: ButtonVariant): string => {
  if (depth === undefined || depth === null) {
    if (variant && variant in defaultDepthByVariant) {
      const defaultVal = defaultDepthByVariant[variant];
      return String(defaultVal);
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
