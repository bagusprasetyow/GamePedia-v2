import { cn } from '@/lib/utils';
import type { DepthNamed } from '@/components/atoms/Button/Button.types';
import type {
  ImageFit,
  ImageRounded,
  ImageAspectRatio,
  ImageDepth,
} from './Image.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const fitClasses: Record<ImageFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
};

export const roundedClasses: Record<ImageRounded, string> = {
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const aspectRatioClasses: Record<ImageAspectRatio, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
  auto: 'h-auto',
};

// Depth System: Skala -3 s/d 3
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

export const defaultDepth: string = '0';

export const namedDepthMap: Record<DepthNamed, string> = {
  sunken: '-2',
  flat: '0',
  'raised-sm': '1',
  'raised-md': '2',
  'raised-lg': '3',
};

/**
 * Menyelesaikan nilai kedalaman visual ke format key string yang valid ('-3' s/d '3').
 *
 * @param {ImageDepth} [depth] - Nilai kedalaman input
 * @returns {string} String key depth valid ('-3' s/d '3')
 */
export function resolveDepthKey(depth?: ImageDepth): string {
  if (depth === undefined || depth === null) {
    return defaultDepth;
  }

  if (typeof depth === 'string' && depth in namedDepthMap) {
    return namedDepthMap[depth as DepthNamed];
  }

  const str = String(depth);
  if (str in depthClasses) {
    return str;
  }

  return defaultDepth;
}

export interface GetImageContainerClassesOptions {
  aspectRatio?: ImageAspectRatio;
  rounded?: ImageRounded;
  depth?: ImageDepth;
  hasAmbientBlur?: boolean;
  className?: string;
}

/**
 * Menghasilkan susunan className untuk kontainer pembungkus gambar atom.
 *
 * @param {GetImageContainerClassesOptions} options - Opsi styling kontainer gambar
 * @returns {string} String kelas Tailwind gabungan
 */
export function getImageContainerClasses(
  options: GetImageContainerClassesOptions
): string {
  const {
    aspectRatio = 'auto',
    rounded = 'none',
    depth = 0,
    hasAmbientBlur = false,
    className = '',
  } = options;

  const safeAspectRatio = aspectRatioClasses[aspectRatio] ? aspectRatio : 'auto';
  const safeRounded = roundedClasses[rounded] ? rounded : 'none';
  const depthKey = resolveDepthKey(depth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['0'];

  return cn(
    // layout
    'relative overflow-hidden inline-flex items-center justify-center',
    // size & aspect ratio
    aspectRatioClasses[safeAspectRatio],
    // border radius
    roundedClasses[safeRounded],
    // depth shadow
    resolvedDepthClass,
    // background saat ambient blur atau loading
    hasAmbientBlur && 'bg-background/20',
    className
  );
}

export interface GetImageElementClassesOptions {
  fit?: ImageFit;
  rounded?: ImageRounded;
  isLoaded?: boolean;
  hasAmbientBlur?: boolean;
  className?: string;
}

/**
 * Menghasilkan susunan className untuk elemen native <img> atom Image.
 *
 * @param {GetImageElementClassesOptions} options - Opsi styling elemen img
 * @returns {string} String kelas Tailwind gabungan
 */
export function getImageElementClasses(
  options: GetImageElementClassesOptions
): string {
  const {
    fit = 'cover',
    rounded = 'none',
    isLoaded = true,
    hasAmbientBlur = false,
    className = '',
  } = options;

  const safeFit = fitClasses[fit] ? fit : 'cover';
  const safeRounded = roundedClasses[rounded] ? rounded : 'none';

  return cn(
    // position
    hasAmbientBlur ? 'relative z-1' : 'block',
    // size
    'w-full h-full',
    // object fit
    fitClasses[safeFit],
    // border radius
    roundedClasses[safeRounded],
    // transition loading
    'transition-opacity duration-300',
    !isLoaded && 'opacity-0',
    className
  );
}

/**
 * Menghasilkan className untuk efek latar ambient blur gambar.
 *
 * @param {string} [className=''] - ClassName tambahan
 * @returns {string} String kelas Tailwind
 */
export function getAmbientBlurClasses(className: string = ''): string {
  return cn(
    // position
    'absolute inset-0',
    // size
    'w-full h-full object-cover scale-110',
    // visual filter & opacity
    'blur-2xl opacity-50 dark:opacity-40',
    // interaction
    'pointer-events-none select-none',
    // transition
    'transition-opacity duration-300',
    className
  );
}
