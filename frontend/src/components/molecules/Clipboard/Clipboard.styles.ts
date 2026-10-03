import { cn } from '@/lib/utils';
import type { ClipboardVariant } from './Clipboard.types';
import type { ButtonDepth } from '@/components/atoms/Button/Button.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Depth System Skala -3 s/d 3 & Variant Maps (OKLCH)
// ─────────────────────────────────────────────────────────────

/**
 * Pemetaan Depth System skala -3 s/d 3 untuk komponen Clipboard.
 */
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2 active:shadow-n3',
  '-1': 'shadow-n1 active:shadow-n2',
  '0': 'shadow-0',
  '1': 'shadow-1 active:shadow-n1 active:translate-y-[1px]',
  '2': 'shadow-2 active:shadow-n1 active:translate-y-[1px]',
  '3': 'shadow-3 active:shadow-n2 active:translate-y-[1px]',
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai depth ke string key depthClasses yang valid.
 */
export const resolveDepthKey = (depth?: ButtonDepth | number | string): string => {
  if (depth === undefined || depth === null) return '0';
  const key = String(depth);
  if (key in namedDepthMap) return namedDepthMap[key];
  if (key in depthClasses) return key;
  return '0';
};

/**
 * Menyelesaikan class shadow kedalaman berdasarkan prop depth.
 */
export const resolveDepthClass = (depth?: ButtonDepth | number | string): string => {
  const key = resolveDepthKey(depth);
  return depthClasses[key] || depthClasses['0'];
};

/**
 * Pemetaan kelas varian visual saat idle.
 */
export const variantClasses: Record<ClipboardVariant, string> = {
  terminal: cn(
    // layout
    'group',
    // border
    'border border-neutral-700/80 active:border-success',
    // background
    'bg-neutral-850 hover:bg-neutral-800 active:bg-success',
    // text
    'text-neutral-200 active:text-white',
    // interaction
    'cursor-pointer select-none'
  ),
  ghost: cn(
    // layout
    'group',
    // border
    'border border-transparent active:border-success',
    // background
    'bg-transparent hover:bg-muted active:bg-success',
    // text
    'text-foreground active:text-white',
    // interaction
    'cursor-pointer select-none'
  ),
  outline: cn(
    // layout
    'group',
    // border
    'border border-border hover:border-border-hover active:border-success',
    // background
    'bg-card/60 hover:bg-muted active:bg-success',
    // text
    'text-foreground active:text-white',
    // interaction
    'cursor-pointer select-none'
  ),
  primary: cn(
    // layout
    'group',
    // border
    'border border-transparent active:border-success',
    // background
    'bg-primary hover:bg-primary-hover active:bg-success',
    // text
    'text-primary-foreground active:text-white',
    // interaction
    'cursor-pointer select-none'
  ),
  secondary: cn(
    // layout
    'group',
    // border
    'border border-border/40 active:border-success',
    // background
    'bg-secondary hover:bg-secondary-hover active:bg-success',
    // text
    'text-secondary-foreground active:text-white',
    // interaction
    'cursor-pointer select-none'
  ),
  contrast: cn(
    // layout
    'group',
    // border
    'border border-transparent active:border-success',
    // background
    'bg-foreground hover:opacity-90 active:bg-success',
    // text
    'text-background active:text-white',
    // interaction
    'cursor-pointer select-none'
  ),
};

/**
 * Kelas penimpa saat status tombol berhasil disalin (copied: true).
 */
export const copiedFeedbackClasses = cn(
  // border
  'border-success',
  // background
  'bg-success hover:bg-success/90 active:bg-success/80',
  // text
  'text-white'
);

/**
 * Menyelesaikan class styling tombol Clipboard lengkap.
 */
export const getClipboardClasses = (
  variant: ClipboardVariant = 'terminal',
  copied: boolean = false,
  depth?: ButtonDepth,
  className: string = ''
): string => {
  return cn(
    // variant idle
    variantClasses[variant] || variantClasses.terminal,
    // shadow & depth
    resolveDepthClass(depth),
    // state
    copied && copiedFeedbackClasses,
    // transition
    'transition-all duration-150',
    className
  );
};

/**
 * Menyelesaikan class styling untuk ikon di dalam tombol.
 */
export const getIconClasses = (copied: boolean, variant: ClipboardVariant = 'terminal'): string => {
  if (copied) {
    return cn(
      // text
      'text-white'
    );
  }

  if (variant === 'terminal') {
    return cn(
      // text
      'text-neutral-300',
      // state
      'group-active:text-white'
    );
  }

  return cn(
    // state
    'group-active:text-white'
  );
};
