import type { FC, ReactElement } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { ClearButtonProps } from './ClearButton.types';
import {
  sizeClasses,
  defaultIconSizeMap,
  variantClasses,
  roundedClasses,
  depthClasses,
  resolveDepthKey,
} from './ClearButton.styles';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di ClearButton.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * ClearButton Component - Atomic UI Element
 *
 * Tombol pembersih atau penutup ("x") ringkas terstandardisasi untuk input,
 * chip, dropdown, modal, atau komponen kontainer lainnya.
 *
 * @param {ClearButtonSize} [props.size='md'] - Ukuran fisik tombol pembersih
 * @param {ClearButtonVariant} [props.variant='default'] - Varian visual warna/tampilan
 * @param {ClearButtonDepth} [props.depth] - Kedalaman visual (-3 s/d 3 atau alias named)
 * @param {ClearButtonRounded} [props.rounded='full'] - Kelengkungan sudut tombol
 * @param {ReactNode} [props.icon='mdi:close'] - Ikon tombol pembersih
 * @param {IconSize | number | string} [props.iconSize] - Ukuran eksplisit ikon
 * @param {string} [props.label='Bersihkan'] - Label aksesibilitas aria-label
 * @param {boolean} [props.disabled=false] - Menonaktifkan interaksi tombol
 * @param {string} [props.className] - Class kustom tambahan (layout minimal)
 *
 * @returns {ReactElement} Elemen button pembersih
 */
export const ClearButton: FC<ClearButtonProps> = ({
  size = 'md',
  variant = 'default',
  depth,
  rounded = 'full',
  icon = 'mdi:close',
  iconSize,
  label = 'Bersihkan',
  disabled = false,
  className = '',
  type = 'button',
  tabIndex = -1,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = variantClasses[variant] ? variant : 'default';
  const safeRounded = roundedClasses[rounded] ? rounded : 'full';

  const resolvedDepthKey = resolveDepthKey(depth, safeVariant);
  const resolvedDepthClass = depthClasses[resolvedDepthKey] || depthClasses['0'];

  const resolvedIconSize = iconSize ?? defaultIconSizeMap[safeSize];

  const clearButtonClasses = cn(
    // layout
    'inline-flex shrink-0 items-center justify-center',
    // size
    sizeClasses[safeSize],
    // border
    roundedClasses[safeRounded],
    // background & variant
    variantClasses[safeVariant],
    // shadow & depth
    resolvedDepthClass,
    // interaction
    'cursor-pointer select-none',
    !disabled && 'active:scale-95',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
    // state
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
    // transition
    'transition-all duration-150',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <button
      type={type}
      tabIndex={tabIndex}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={clearButtonClasses}
      {...restProps}
    >
      {typeof icon === 'string' ? (
        <Icon icon={icon} size={resolvedIconSize} />
      ) : (
        icon
      )}
    </button>
  );
};

export default ClearButton;
