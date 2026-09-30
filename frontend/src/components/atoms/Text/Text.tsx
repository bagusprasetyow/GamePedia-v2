import type { ElementType, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type {
  TextProps,
  TextSize,
  TextVariant,
  TextWeight,
  TextAlign,
  TextTransform,
  TextLeading,
  TextTracking,
  TextClamp,
} from './Text.types';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────
const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

const variantClasses: Record<TextVariant, string> = {
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
};

const weightClasses: Record<TextWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const transformClasses: Record<TextTransform, string> = {
  none: 'normal-case',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
};

const leadingClasses: Record<TextLeading, string> = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};

const trackingClasses: Record<TextTracking, string> = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
};

const clampClasses: Record<TextClamp, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

/**
 * Text Component - Atomic UI Element
 * 
 * Komponen tipografi polimorfik dasar dengan enkapsulasi styling penuh dan dukungan varian semantik tema GamePedia.
 * 
 * @template T - Tipe elemen HTML dasar (default: 'p')
 * @param {T} [props.as='p'] - Tag HTML polimorfik ('p', 'span', 'h1'-'h6', 'label', 'div', dll.)
 * @param {TextSize} [props.size='base'] - Skala ukuran teks ('xs', 'sm', 'base'/'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl')
 * @param {TextVariant} [props.variant='default'] - Warna teks semantik tema ('default', 'muted', 'subtle', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'contrast', 'white')
 * @param {TextWeight} [props.weight='normal'] - Ketebalan font ('light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black')
 * @param {TextAlign} [props.align='left'] - Perataan teks horizontal ('left', 'center', 'right', 'justify')
 * @param {TextTransform} [props.transform='none'] - Transformasi casing font ('none', 'capitalize', 'uppercase', 'lowercase')
 * @param {TextLeading} [props.leading] - Jarak baris vertikal ('none', 'tight', 'snug', 'normal', 'relaxed', 'loose')
 * @param {TextTracking} [props.tracking] - Jarak antar huruf ('tighter', 'tight', 'normal', 'wide', 'wider', 'widest')
 * @param {boolean} [props.italic=false] - Format teks miring
 * @param {boolean} [props.underline=false] - Format garis bawah
 * @param {boolean} [props.strikethrough=false] - Format garis coret
 * @param {boolean} [props.truncate=false] - Potong teks dengan elipsis satu baris
 * @param {TextClamp} [props.clamp] - Potong teks multi-baris (1-6)
 * @param {string} [props.className] - Class kustom opsional
 * @param {ReactNode} [props.children] - Konten teks atau elemen anak
 * 
 * @returns {ReactElement} Elemen teks React yang telah distilasi
 */
export const Text = <T extends ElementType = 'p'>({
  as,
  size = 'base',
  variant = 'default',
  weight = 'normal',
  align = 'left',
  transform = 'none',
  leading,
  tracking,
  italic = false,
  underline = false,
  strikethrough = false,
  truncate = false,
  clamp,
  className = '',
  children,
  ...restProps
}: TextProps<T>): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const Component = as || 'p';

  const safeSize = sizeClasses[size] ?? sizeClasses.base;
  const safeVariant = variantClasses[variant] ?? variantClasses.default;
  const safeWeight = weightClasses[weight] ?? weightClasses.normal;
  const safeAlign = alignClasses[align] ?? alignClasses.left;
  const safeTransform = transformClasses[transform] ?? transformClasses.none;
  const safeLeading = leading ? leadingClasses[leading] : '';
  const safeTracking = tracking ? trackingClasses[tracking] : '';
  const safeClamp = clamp ? clampClasses[clamp] : '';

  const textClasses = cn(
    // typography & size
    safeSize,
    safeVariant,
    safeWeight,
    safeAlign,
    safeTransform,
    safeLeading,
    safeTracking,
    // layout & clamping
    safeClamp,
    truncate && !clamp && 'truncate',
    // text decoration
    italic && 'italic',
    underline && 'underline underline-offset-4',
    strikethrough && 'line-through',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <Component className={textClasses} {...restProps}>
      {children}
    </Component>
  );
};

export default Text;
