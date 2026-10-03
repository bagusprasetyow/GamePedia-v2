import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { ButtonProps } from './Button.types';
import {
  sizeClasses,
  iconOnlySizeClasses,
  defaultIconSizeMap,
  defaultIconOnlySizeMap,
  sizeLoadingTextMap,
  variantClasses,
  depthClasses,
  roundedClasses,
  weightClasses,
  justifyClasses,
  gapClasses,
  cursorClasses,
  resolveDepthKey,
} from './Button.styles';
import { ButtonLoading } from './components/ButtonLoading';
import { ButtonIcon } from './components/ButtonIcon';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Button.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Button Component - Atomic UI Element
 *
 * Komponen tombol interaktif terenkapsulasi penuh dengan dukungan varian semantik,
 * integrasi ikon otomatis, Depth System (-3 s/d 3), sub-atom status loading,
 * dan dimensi fleksibel sesuai standar monorepo GamePedia.
 *
 * @param {ButtonSize} [props.size='md'] - Ukuran tombol ('2xs', 'xs', 'sm', 'md', 'lg', 'xl')
 * @param {ButtonVariant} [props.variant='primary'] - Varian visual warna ('primary', 'secondary', 'accent', 'outline', 'ghost', 'contrast', 'success', 'warning', 'error', 'info', 'close')
 * @param {ButtonDepth} [props.depth] - Tingkat kedalaman visual ('sunken', 'flat', 'raised-sm', 'raised-md', 'raised-lg', atau -3 s/d 3)
 * @param {'auto' | 'full' | string} [props.width='auto'] - Lebar tombol
 * @param {ButtonRounded} [props.rounded='default'] - Kelengkungan sudut tombol
 * @param {ButtonWeight} [props.weight='medium'] - Bobot ketebalan teks
 * @param {ButtonJustify} [props.justify='center'] - Penjajaran konten secara horizontal
 * @param {ButtonGap} [props.gap] - Jarak celah antara ikon dan teks
 * @param {ReactNode} [props.startIcon] - Ikon di awal tombol
 * @param {ReactNode} [props.endIcon] - Ikon di akhir tombol
 * @param {ReactNode} [props.icon] - Ikon untuk tombol icon-only tanpa teks
 * @param {IconSize | number | string} [props.iconSize] - Ukuran kustom ikon
 * @param {boolean} [props.isLoading=false] - Status pemuatan loading aktif
 * @param {string} [props.loadingText] - Teks keterangan saat loading
 * @param {ButtonCursor} [props.cursor] - Jenis kursor mouse saat hover
 * @param {boolean} [props.disabled=false] - Menonaktifkan interaksi tombol
 * @param {string} [props.className] - Class kustom tambahan
 * @param {ReactNode} [props.children] - Konten anak tombol
 *
 * @returns {ReactElement} Elemen HTML button interaktif
 */
export const Button: FC<ButtonProps> = ({
  size = 'md',
  variant = 'primary',
  depth,
  width = 'auto',
  rounded = 'default',
  weight = 'medium',
  justify = 'center',
  gap,
  startIcon,
  endIcon,
  icon,
  iconSize,
  isLoading = false,
  loadingText,
  cursor,
  disabled = false,
  className = '',
  style,
  children,
  type = 'button',
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const isIconOnly = Boolean(icon && !children);
  const isDisabled = disabled || isLoading;

  const depthKey = resolveDepthKey(depth, variant);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['1'];

  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = variantClasses[variant] ? variant : 'primary';
  const safeRounded = roundedClasses[rounded] ? rounded : 'default';
  const safeWeight = weightClasses[weight] ? weight : 'medium';
  const safeJustify = justifyClasses[justify] ? justify : 'center';
  const safeGap = gap ? gapClasses[gap] : size === '2xs' || size === 'xs' ? 'gap-1.5' : 'gap-2';

  const resolvedIconSize =
    iconSize || (isIconOnly ? defaultIconOnlySizeMap[safeSize] : defaultIconSizeMap[safeSize]);
  const resolvedLoadingTextSize = sizeLoadingTextMap[safeSize] || 'sm';

  const computedWidthClass = isIconOnly
    ? width === 'full'
      ? 'w-full'
      : ''
    : width === 'full'
      ? 'w-full'
      : width === 'auto'
        ? 'w-auto'
        : '';
  const customWidthStyle = width !== 'full' && width !== 'auto' ? { width } : undefined;

  const resolvedCursor = isDisabled
    ? cursorClasses['not-allowed']
    : cursor && cursorClasses[cursor]
      ? cursorClasses[cursor]
      : cursorClasses.pointer;

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const buttonClasses = cn(
    // layout
    'inline-flex items-center',
    isIconOnly ? 'justify-center' : justifyClasses[safeJustify],
    safeGap,
    // size
    isIconOnly ? iconOnlySizeClasses[safeSize] : sizeClasses[safeSize],
    computedWidthClass,
    // typography
    weightClasses[safeWeight],
    // border
    roundedClasses[safeRounded],
    // background & variant
    variantClasses[safeVariant],
    // shadow & depth
    resolvedDepthClass,
    // interaction
    'select-none',
    resolvedCursor,
    !isDisabled && 'active:scale-[0.98]',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // state
    isDisabled && 'opacity-60 active:scale-100 pointer-events-none',
    // transition
    'transition-all duration-200',
    className
  );

  const combinedStyle = customWidthStyle
    ? { ...customWidthStyle, ...style }
    : style;

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={buttonClasses}
      style={combinedStyle}
      {...restProps}
    >
      {isLoading ? (
        <ButtonLoading
          loadingText={isIconOnly ? undefined : loadingText}
          iconSize={resolvedIconSize}
          textSize={resolvedLoadingTextSize}
        />
      ) : isIconOnly ? (
        <ButtonIcon icon={icon} size={resolvedIconSize} />
      ) : (
        <>
          <ButtonIcon icon={startIcon} size={resolvedIconSize} />
          {children}
          <ButtonIcon icon={endIcon} size={resolvedIconSize} />
        </>
      )}
    </button>
  );
};

export default Button;
