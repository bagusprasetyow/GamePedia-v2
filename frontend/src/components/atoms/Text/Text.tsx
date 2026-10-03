import type { ElementType, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { TextProps } from './Text.types';
import {
  sizeClasses,
  variantClasses,
  weightClasses,
  alignClasses,
  transformClasses,
  leadingClasses,
  trackingClasses,
  clampClasses,
} from './Text.styles';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Tokens & Styling Setup
// ─────────────────────────────────────────────────────────────

/**
 * Text Component - Atomic UI Element
 * 
 * Komponen tipografi polimorfik dasar dengan enkapsulasi styling penuh dan dukungan varian semantik tema GamePedia.
 * Menggantikan tag HTML teks primitif bawaan ('p', 'span', 'h1'-'h6', 'label', dll.) dengan standar monorepo.
 * 
 * @template T - Tipe elemen HTML dasar (default: 'p')
 * @param {TextProps<T>} props - Properti komponen Text
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
  // 2. LOGIKA: Calculations, Safe Fallbacks & Handlers
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

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const textClasses = cn(
    // layout
    safeClamp,
    truncate && !clamp && 'truncate',
    // typography
    safeSize,
    safeWeight,
    safeAlign,
    safeTransform,
    safeLeading,
    safeTracking,
    italic && 'italic',
    underline && 'underline underline-offset-4',
    strikethrough && 'line-through',
    // text
    safeVariant,
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
