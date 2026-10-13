import type {
  VideoPlayerSize,
  VideoPlayerVariant,
  VideoPlayerAspectRatio,
  VideoPlayerObjectFit,
  VideoPlayerRounded,
  VideoPlayerDepth,
} from './VideoPlayer.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Tokens
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<VideoPlayerSize, string> = {
  sm: 'max-w-md w-full',
  md: 'max-w-2xl w-full',
  lg: 'max-w-4xl w-full',
  xl: 'max-w-6xl w-full',
  full: 'w-full',
};

export const aspectRatioClasses: Record<VideoPlayerAspectRatio, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
  auto: 'aspect-auto',
};

export const objectFitClasses: Record<VideoPlayerObjectFit, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

export const roundedClasses: Record<VideoPlayerRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
  full: 'rounded-3xl',
};

export const variantClasses: Record<VideoPlayerVariant, string> = {
  default: 'bg-black border border-border/40',
  card: 'bg-card border border-border/80',
  elevated: 'bg-black border border-primary/20',
  ghost: 'bg-transparent border-transparent',
};

// Depth System GamePedia (-3 s/d 3)
export const depthClasses: Record<string, string> = {
  '-3': 'shadow-n3',
  '-2': 'shadow-n2',
  '-1': 'shadow-n1',
  '0': 'shadow-0',
  '1': 'shadow-1',
  '2': 'shadow-2',
  '3': 'shadow-3',
};

export const defaultDepthByVariant: Record<VideoPlayerVariant, VideoPlayerDepth> = {
  default: -1,
  card: 2,
  elevated: 3,
  ghost: 0,
};

export const namedDepthMap: Record<string, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Memetakan nilai VideoPlayerDepth dan varian menjadi string key depthClasses yang valid.
 *
 * @param {VideoPlayerDepth} [depth] - Nilai depth eksplisit
 * @param {VideoPlayerVariant} [variant='default'] - Varian untuk penentuan default depth
 * @returns {string} String key depthClasses ('-3' s/d '3')
 */
export const resolveDepthKey = (
  depth?: VideoPlayerDepth,
  variant: VideoPlayerVariant = 'default'
): string => {
  if (depth === undefined || depth === null) {
    if (variant in defaultDepthByVariant) {
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

/**
 * Kelas penyesuaian posisi Tooltip khusus untuk tombol-tombol kontrol VideoPlayer.
 * Menempatkan tooltip lebih ke atas agar tidak menempel dekat dengan ikon atau badge HD.
 *
 * @param {boolean} [isFullscreen=false] - Status mode layar penuh
 * @returns {string} String class Tailwind penyesuaian margin-bottom
 */
export const videoPlayerTooltipClasses = (isFullscreen = false): string =>
  isFullscreen ? 'mb-9' : 'mb-7';
