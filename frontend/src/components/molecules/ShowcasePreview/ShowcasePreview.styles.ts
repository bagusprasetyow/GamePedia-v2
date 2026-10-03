import type { DepthNamed, DepthString } from '@/components/atoms/Button/Button.types';
import type {
  ShowcasePreviewBadgeItem,
  ShowcasePreviewBadgesInput,
  ShowcasePreviewBadgeVariant,
  ShowcasePreviewBackground,
  ShowcasePreviewBorderStyle,
  ShowcasePreviewDepth,
  ShowcasePreviewMinHeight,
  ShowcasePreviewRounded,
} from './ShowcasePreview.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const borderStyleClasses: Record<ShowcasePreviewBorderStyle, string> = {
  dashed: 'border-dashed border-border/80',
  solid: 'border-solid border-border',
  none: 'border-none',
};

export const roundedClasses: Record<ShowcasePreviewRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const minHeightClasses: Record<ShowcasePreviewMinHeight, string> = {
  none: 'min-h-0',
  sm: 'min-h-36',
  md: 'min-h-55',
  lg: 'min-h-72',
  xl: 'min-h-96',
};

export const badgeVariantClasses: Record<ShowcasePreviewBadgeVariant, string> = {
  default: 'bg-card text-muted-foreground border-border/60',
  primary: 'bg-primary/10 text-primary border-primary/20',
  accent: 'bg-accent/10 text-accent border-accent/20',
  muted: 'bg-muted/60 text-muted-foreground border-border/40',
};

export const backgroundVariantClasses: Record<ShowcasePreviewBackground, string> = {
  dots: '[background-image:radial-gradient(circle,var(--color-neutral-400)_1.5px,transparent_1.5px)] dark:[background-image:radial-gradient(circle,var(--color-neutral-600)_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60',
  radial: 'bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_75%)] opacity-[0.04]',
  grid: 'bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]',
  plain: '',
};

export const depthClasses: Record<DepthString, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
};

export const namedDepthMap: Record<DepthNamed, DepthString> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

// ─────────────────────────────────────────────────────────────
// 2. HELPER MURNI (Pure Helpers)
// ─────────────────────────────────────────────────────────────

/**
 * Menentukan kunci kedalaman (DepthString) yang valid untuk depthClasses.
 *
 * @param {ShowcasePreviewDepth} [depth=0] - Nilai depth masukan (angka, string, atau alias named)
 * @returns {DepthString} Kunci depth valid '-3' s/d '3'
 */
export const resolveDepthKey = (depth?: ShowcasePreviewDepth): DepthString => {
  if (depth === undefined || depth === null) {
    return '0';
  }

  if (typeof depth === 'number') {
    const clamped = Math.max(-3, Math.min(3, Math.round(depth)));
    return String(clamped) as DepthString;
  }

  if (depth in namedDepthMap) {
    return namedDepthMap[depth as DepthNamed];
  }

  if (depth in depthClasses) {
    return depth as DepthString;
  }

  return '0';
};

/**
 * Menormalisasi masukan badges menjadi daftar array ShowcasePreviewBadgeItem standar.
 *
 * @param {ShowcasePreviewBadgesInput} [badges] - Nilai badges masukan (array atau object)
 * @returns {ShowcasePreviewBadgeItem[]} Array badge item yang siap dirender
 */
export const normalizeBadges = (badges?: ShowcasePreviewBadgesInput): ShowcasePreviewBadgeItem[] => {
  if (!badges) return [];

  if (Array.isArray(badges)) {
    return badges.map((item) => {
      if (typeof item === 'string') {
        return { value: item, variant: 'default' };
      }
      return {
        label: item.label,
        value: item.value,
        variant: item.variant || 'default',
      };
    });
  }

  if (typeof badges === 'object') {
    const result: ShowcasePreviewBadgeItem[] = [];
    for (const [key, val] of Object.entries(badges)) {
      if (val !== undefined && val !== null) {
        result.push({
          label: key,
          value: val,
          variant: 'default',
        });
      }
    }
    return result;
  }

  return [];
};
