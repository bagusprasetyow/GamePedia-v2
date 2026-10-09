import { cn } from '@/lib/utils';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { DepthNamed } from '@/components/atoms/Button/Button.types';
import type {
  ImageUploadSize,
  ImageUploadVariant,
  ImageUploadRounded,
  ImageUploadAspectRatio,
  ImageUploadDepth,
} from './ImageUpload.types';
export * from './ImageUpload.utils';


// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

export const sizeClasses: Record<ImageUploadSize, string> = {
  sm: 'p-3 min-h-[140px]',
  md: 'p-5 min-h-[190px]',
  lg: 'p-7 min-h-[250px]',
  xl: 'p-9 min-h-[310px]',
};

export const dropzoneIconSizeMap: Record<ImageUploadSize, IconSize> = {
  sm: '2xl',
  md: '3xl',
  lg: '4xl',
  xl: '4xl',
};

export const variantClasses: Record<ImageUploadVariant, string> = {
  dashed:
    'border-2 border-dashed border-border/80 bg-card/60 hover:bg-card/90 hover:border-primary/60',
  solid:
    'border-2 border-solid border-border/70 bg-card hover:bg-card/90 hover:border-border-hover',
  ghost:
    'border-2 border-dashed border-transparent bg-muted/30 hover:bg-muted/50 hover:border-border',
};

export const roundedClasses: Record<ImageUploadRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export const aspectRatioClasses: Record<ImageUploadAspectRatio, string> = {
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

export const defaultDepthByVariant: Record<ImageUploadVariant, string> = {
  dashed: '0',
  solid: '1',
  ghost: '0',
};

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
 * @param {ImageUploadDepth} [depth] - Nilai kedalaman input
 * @param {ImageUploadVariant} [variant='dashed'] - Varian visual sebagai fallback
 * @returns {string} String key depth valid ('-3' s/d '3')
 */
export function resolveDepthKey(
  depth?: ImageUploadDepth,
  variant: ImageUploadVariant = 'dashed'
): string {
  if (depth === undefined || depth === null) {
    return defaultDepthByVariant[variant] ?? '0';
  }

  if (typeof depth === 'string' && depth in namedDepthMap) {
    return namedDepthMap[depth as DepthNamed];
  }

  const str = String(depth);
  if (str in depthClasses) {
    return str;
  }

  return defaultDepthByVariant[variant] ?? '0';
}

export interface GetDropzoneContainerClassesOptions {
  size?: ImageUploadSize;
  variant?: ImageUploadVariant;
  rounded?: ImageUploadRounded;
  aspectRatio?: ImageUploadAspectRatio;
  depth?: ImageUploadDepth;
  isInvalid?: boolean;
  success?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Menghasilkan className untuk wrapper terluar ImageUpload.
 *
 * @param {string} [className=''] - ClassName tambahan dari konsumen
 * @returns {string} String kelas Tailwind gabungan
 */
export function getWrapperClasses(className: string = ''): string {
  return cn(
    // layout
    'flex flex-col gap-1.5',
    // size
    'w-full',
    className
  );
}

/**
 * Menghasilkan susunan className untuk kontainer area dropzone/preview ImageUpload.
 *
 * @param {GetDropzoneContainerClassesOptions} options - Opsi konfigurasi style dan state
 * @returns {string} String kelas Tailwind gabungan
 */
export function getDropzoneContainerClasses(
  options: GetDropzoneContainerClassesOptions
): string {
  const {
    size = 'md',
    variant = 'dashed',
    rounded = 'lg',
    aspectRatio = 'video',
    depth,
    isInvalid = false,
    success = false,
    disabled = false,
    className = '',
  } = options;

  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = variantClasses[variant] ? variant : 'dashed';
  const safeRounded = roundedClasses[rounded] ? rounded : 'lg';
  const safeAspectRatio = aspectRatioClasses[aspectRatio] ? aspectRatio : 'video';

  const depthKey = resolveDepthKey(depth, safeVariant);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['0'];

  return cn(
    // layout
    'flex flex-col items-center justify-center overflow-hidden group',
    // position
    'relative',
    // size
    'w-full',
    aspectRatioClasses[safeAspectRatio],
    safeAspectRatio === 'auto' && sizeClasses[safeSize],
    // border
    roundedClasses[safeRounded],
    // background & variant
    variantClasses[safeVariant],
    // shadow & depth
    resolvedDepthClass,
    // state
    isInvalid && 'border-destructive/80 focus-within:border-destructive',
    success && !isInvalid && 'border-success/80 focus-within:border-success',
    disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
    // transition
    'transition-all duration-200',
    className
  );
}



// ─────────────────────────────────────────────────────────────
// 2. HELPER & STYLING SUB-KOMPONEN: Dropzone & Preview
// ─────────────────────────────────────────────────────────────

export interface GetDropzoneInnerClassesOptions {
  isDragging?: boolean;
  disabled?: boolean;
}

export function getDropzoneClasses({
  isDragging = false,
  disabled = false,
}: GetDropzoneInnerClassesOptions = {}): string {
  return cn(
    // layout
    'flex flex-col items-center justify-center',
    // size
    'w-full h-full',
    // spacing
    'p-4 sm:p-6 gap-2 sm:gap-3',
    // typography
    'text-center',
    // interaction
    'cursor-pointer select-none',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    // state
    isDragging && 'scale-[0.99] border-primary bg-primary/10 text-primary',
    disabled && 'cursor-not-allowed opacity-60',
    // transition
    'transition-all duration-200'
  );
}

export function getDropzoneIconWrapperClasses(isDragging: boolean = false): string {
  return cn(
    // layout
    'flex items-center justify-center',
    // spacing
    'p-3.5',
    // border
    'rounded-full',
    // background & text
    isDragging ? 'bg-primary/20 scale-110 text-primary' : 'bg-muted/70 text-muted-foreground',
    // transition
    'transition-transform duration-200'
  );
}

export const previewContainerClasses = cn(
  // layout
  'flex items-center justify-center overflow-hidden group',
  // position
  'relative',
  // size
  'w-full h-full',
  // background
  'bg-muted/40',
  // interaction
  'select-none'
);

export const ambientBlurClasses = cn(
  // position
  'absolute inset-0',
  // size
  'w-full h-full object-cover scale-110',
  // interaction
  'pointer-events-none select-none',
  // visual filter & opacity
  'blur-2xl opacity-50',
  // dark mode
  'dark:opacity-40',
  // transition
  'transition-opacity duration-300'
);

export const ambientOverlayClasses = cn(
  // position
  'absolute inset-0',
  // background
  'bg-background/20',
  // interaction
  'pointer-events-none'
);

export const mainImageClasses = cn(
  // position
  'relative z-1',
  // size
  'w-full h-full object-contain',
  // interaction
  'group-hover:scale-[1.01]',
  // transition
  'transition-transform duration-300'
);

export function getGradientOverlayClasses(isUploading: boolean = false): string {
  return cn(
    // layout & position
    'absolute inset-x-0 top-0 h-20 pointer-events-none z-10',
    // background
    'bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.2)_55%,transparent_100%)]',
    // state & transition
    'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
    isUploading && 'hidden'
  );
}

export const previewActionsWrapperClasses = cn(
  // position
  'absolute top-4 right-3 z-20',
  // state & transition
  'opacity-0 group-hover:opacity-100 has-focus-visible:opacity-100 transition-opacity duration-200'
);

