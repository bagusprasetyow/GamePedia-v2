import type { FC, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../Icon';
import type { IconSize } from '../Icon/Icon.types';
import type {
  ButtonProps,
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
const sizeClasses: Record<ButtonSize, string> = {
  '2xs': 'h-6 px-2 text-xs',
  xs: 'h-7 px-2.5 text-xs',
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
  xl: 'h-12 px-6 text-lg',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  '2xs': 'h-6 w-6 min-w-6 aspect-square p-0 shrink-0',
  xs: 'h-7 w-7 min-w-7 aspect-square p-0 shrink-0',
  sm: 'h-8 w-8 min-w-8 aspect-square p-0 shrink-0',
  md: 'h-10 w-10 min-w-10 aspect-square p-0 shrink-0',
  lg: 'h-11 w-11 min-w-11 aspect-square p-0 shrink-0',
  xl: 'h-12 w-12 min-w-12 aspect-square p-0 shrink-0',
};

const defaultIconSizeMap: Record<ButtonSize, IconSize> = {
  '2xs': '2xs',
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
};

const defaultIconOnlySizeMap: Record<ButtonSize, IconSize> = {
  '2xs': 'xs',
  xs: 'sm',
  sm: 'md',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active border border-transparent',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active border border-border/40',
  accent: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 border border-transparent',
  outline: 'border border-border hover:border-border-hover bg-card/60 text-foreground hover:bg-muted active:bg-muted-hover',
  ghost: 'bg-transparent text-foreground hover:bg-muted active:bg-muted-hover border border-transparent',
  contrast: 'bg-foreground text-background hover:opacity-90 active:opacity-80 border border-transparent',
  success: 'bg-success text-white hover:brightness-95 active:brightness-90 border border-transparent',
  warning: 'bg-warning text-neutral-950 hover:brightness-95 active:brightness-90 border border-transparent',
  error: 'bg-destructive text-white hover:brightness-95 active:brightness-90 border border-transparent',
  info: 'bg-info-600 text-white hover:bg-info-700 active:bg-info-800 border border-transparent',
  close: 'bg-transparent text-muted-foreground hover:bg-destructive hover:text-white active:brightness-90 border border-transparent',
};

// Depth System: Skala -3 s/d 3 (Ref: frontend/dev)
const depthClasses: Record<string, string> = {
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

  // Named Aliases
  sunken: 'shadow-n2 active:shadow-n3',
  flat: 'shadow-0',
  'raised-sm': 'shadow-1 active:shadow-n1 active:translate-y-[1px]',
  'raised-md': 'shadow-2 active:shadow-n1 active:translate-y-[1px]',
  'raised-lg': 'shadow-3 active:shadow-n2 active:translate-y-[1px]',
};

const roundedClasses: Record<ButtonRounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  default: 'rounded-xl',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const weightClasses: Record<ButtonWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const justifyClasses: Record<ButtonJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

const gapClasses: Record<ButtonGap, string> = {
  '2xs': 'gap-1',
  xs: 'gap-1.5',
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3',
  xl: 'gap-3.5',
};

const cursorClasses: Record<ButtonCursor, string> = {
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

/**
 * Button Component - Atomic UI Element
 * 
 * Komponen tombol interaktif terenkapsulasi penuh dengan dukungan varian semantik,
 * integrasi ikon otomatis, status loading, dan dimensi fleksibel.
 * 
 * @param {ButtonSize} [props.size='md'] - Ukuran tombol ('2xs', 'xs', 'sm', 'md', 'lg', 'xl')
 * @param {ButtonVariant} [props.variant='primary'] - Varian visual warna ('primary', 'secondary', 'accent', 'outline', 'ghost', 'contrast', 'success', 'warning', 'error', 'info', 'close')
 * @param {ButtonDepth} [props.depth] - Tingkat kedalaman visual ('sunken', 'flat', 'raised-sm', 'raised-md', 'raised-lg')
 * @param {'auto' | 'full' | string} [props.width='auto'] - Lebar tombol
 * @param {ButtonRounded} [props.rounded='default'] - Kelengkungan sudut tombol
 * @param {ButtonWeight} [props.weight='medium'] - Bobot ketebalan teks
 * @param {ButtonJustify} [props.justify='center'] - Penjajaran konten secara horizontal
 * @param {ButtonGap} [props.gap] - Jarak celah antara ikon dan teks
 * @param {ReactNode} [props.startIcon] - Ikon di awal tombol
 * @param {ReactNode} [props.endIcon] - Ikon di akhir tombol
 * @param {ReactNode} [props.icon] - Ikon untuk tombol icon-only tanpa teks
 * @param {IconSize | number | string} [props.iconSize] - Ukuran kustom ikon
 * @param {boolean} [props.isLoading=false] - Status loading aktif
 * @param {string} [props.loadingText] - Teks pengganti saat loading
 * @param {ButtonCursor} [props.cursor] - Jenis kursor mouse
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

  const defaultDepthByVariant: Record<ButtonVariant, ButtonDepth> = {
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

  const effectiveDepth = depth ?? defaultDepthByVariant[variant] ?? 1;
  const depthKey = String(effectiveDepth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['1'];

  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = variantClasses[variant] ? variant : 'primary';
  const safeRounded = roundedClasses[rounded] ? rounded : 'default';
  const safeWeight = weightClasses[weight] ? weight : 'medium';
  const safeJustify = justifyClasses[justify] ? justify : 'center';
  const safeGap = gap ? gapClasses[gap] : (size === '2xs' || size === 'xs' ? 'gap-1.5' : 'gap-2');

  const resolvedIconSize = iconSize || (isIconOnly ? defaultIconOnlySizeMap[safeSize] : defaultIconSizeMap[safeSize]);

  // Helper untuk me-render node ikon (bisa berupa nama string iconify atau ReactNode)
  const renderIconNode = (iconNode: ReactNode) => {
    if (typeof iconNode === 'string') {
      return <Icon icon={iconNode} size={resolvedIconSize} />;
    }
    return iconNode;
  };

  const computedWidthClass = isIconOnly
    ? (width === 'full' ? 'w-full' : '')
    : (width === 'full' ? 'w-full' : width === 'auto' ? 'w-auto' : '');
  const customWidthStyle = width !== 'full' && width !== 'auto' ? { width } : undefined;

  const resolvedCursor = isDisabled
    ? cursorClasses['not-allowed']
    : cursor && cursorClasses[cursor]
      ? cursorClasses[cursor]
      : cursorClasses.pointer;

  const buttonClasses = cn(
    // layout
    'inline-flex items-center justify-center select-none',
    // size & spacing
    isIconOnly ? iconOnlySizeClasses[safeSize] : [sizeClasses[safeSize], justifyClasses[safeJustify]],
    computedWidthClass,
    safeGap,
    // typography & border
    weightClasses[safeWeight],
    roundedClasses[safeRounded],
    // background & variant
    variantClasses[safeVariant],
    // shadow & depth
    resolvedDepthClass,
    // interaction & cursor
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

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClasses}
      style={{ ...customWidthStyle, ...style }}
      {...restProps}
    >
      {isLoading ? (
        <>
          <Icon icon="mdi:loading" size={resolvedIconSize} spin />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : isIconOnly ? (
        renderIconNode(icon)
      ) : (
        <>
          {startIcon && renderIconNode(startIcon)}
          {children}
          {endIcon && renderIconNode(endIcon)}
        </>
      )}
    </button>
  );
};

export default Button;
