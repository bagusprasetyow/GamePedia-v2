import type { IconSize, IconVariant } from './Icon.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

/**
 * Pemetaan ukuran preset standar untuk komponen Icon.
 */
export const sizeClasses: Record<IconSize, string> = {
  '2xs': 'w-3 h-3 text-xs',
  xs: 'w-3.5 h-3.5 text-xs',
  sm: 'w-4 h-4 text-sm',
  md: 'w-5 h-5 text-base',
  lg: 'w-6 h-6 text-lg',
  xl: 'w-7 h-7 text-xl',
  '2xl': 'w-8 h-8 text-2xl',
  '3xl': 'w-10 h-10 text-3xl',
  '4xl': 'w-12 h-12 text-4xl',
};

/**
 * Pemetaan varian warna semantik sesuai token tema OKLCH GamePedia.
 */
export const variantClasses: Record<IconVariant, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  subtle: 'text-muted-foreground/80',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  accent: 'text-accent-600 dark:text-accent-400',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  info: 'text-info-600 dark:text-info-500',
  contrast: 'text-foreground',
  white: 'text-white',
  inherit: 'text-inherit',
};
