import type { FC, KeyboardEvent, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { appearanceClasses } from '@/components/atoms/Badge/Badge.styles';
import type { ChipProps } from './Chip.types';
import {
  sizeClasses,
  removableSizeClasses,
  sizeIconMap,
  sizeTextMap,
  depthClasses,
  roundedClasses,
  selectedClasses,
  clickableClasses,
  resolveDepthKey,
} from './Chip.styles';
import { ChipIcon } from './components/ChipIcon';
import { ChipLabel } from './components/ChipLabel';
import { ChipRemove } from './components/ChipRemove';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Chip.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Chip Component - Atomic UI Element
 *
 * Chip / Tag ringkas: dapat dipilih (toggle), dapat dihapus, dengan ikon opsional,
 * varian semantik, dan Depth System (-3 s/d 3).
 *
 * @param {ChipSize} [props.size='md'] - Ukuran chip ('sm', 'md', 'lg')
 * @param {ChipVariant} [props.variant='primary'] - Varian visual warna
 * @param {ChipAppearance} [props.appearance='outline'] - Gaya saat tidak terpilih
 * @param {ChipDepth} [props.depth] - Kedalaman visual ('sunken', 'flat', 'raised-sm', 'raised-md', 'raised-lg', atau -3 s/d 3)
 * @param {ChipRounded} [props.rounded='full'] - Kelengkungan sudut chip
 * @param {ChipWeight} [props.weight='medium'] - Bobot ketebalan teks
 * @param {boolean} [props.selected=false] - Status terpilih
 * @param {boolean} [props.disabled=false] - Menonaktifkan interaksi
 * @param {ReactNode} [props.startIcon] - Ikon di awal chip
 * @param {() => void} [props.onRemove] - Handler hapus (menampilkan tombol "x")
 * @param {string} [props.removeLabel='Hapus'] - Label aksesibilitas tombol hapus
 * @param {string} [props.className] - Class kustom tambahan (layout minimal)
 * @param {ReactNode} [props.children] - Konten chip
 *
 * @returns {ReactElement} Elemen span chip
 */
export const Chip: FC<ChipProps> = ({
  size = 'md',
  variant = 'primary',
  appearance = 'outline',
  depth,
  rounded = 'full',
  weight = 'medium',
  selected = false,
  disabled = false,
  startIcon,
  onRemove,
  removeLabel = 'Hapus',
  className = '',
  children,
  onClick,
  onKeyDown,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const isClickable = Boolean(onClick) && !disabled;
  const resolvedDepthClass = depthClasses[resolveDepthKey(depth)] || depthClasses['1'];

  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = appearanceClasses[variant] ? variant : 'primary';
  const safeAppearance = selected
    ? 'filled'
    : appearanceClasses[safeVariant][appearance]
      ? appearance
      : 'outline';
  const safeRounded = roundedClasses[rounded] ? rounded : 'full';

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
    onKeyDown?.(event);
    if (!isClickable || event.defaultPrevented) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const chipClasses = cn(
    // layout
    'inline-flex items-center justify-center shrink-0 whitespace-nowrap',
    // size
    onRemove ? removableSizeClasses[safeSize] : sizeClasses[safeSize],
    // border
    roundedClasses[safeRounded],
    // background & variant
    appearanceClasses[safeVariant][safeAppearance],
    // shadow & depth
    resolvedDepthClass,
    // interaction
    'select-none',
    isClickable && clickableClasses,
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // state
    selected && selectedClasses,
    disabled && 'opacity-60 pointer-events-none',
    // transition
    'transition-all duration-200',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <span
      className={chipClasses}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={isClickable ? selected : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      <ChipIcon icon={startIcon} size={sizeIconMap[safeSize]} />
      <ChipLabel textSize={sizeTextMap[safeSize]} weight={weight}>
        {children}
      </ChipLabel>
      <ChipRemove onRemove={onRemove} label={removeLabel} size={safeSize} disabled={disabled} />
    </span>
  );
};

export default Chip;
