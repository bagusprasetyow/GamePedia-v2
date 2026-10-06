import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { BadgeProps } from './Badge.types';
import {
  sizeClasses,
  iconOnlySizeClasses,
  sizeIconMap,
  sizeTextMap,
  appearanceClasses,
  depthClasses,
  roundedClasses,
  resolveDepthKey,
} from './Badge.styles';
import { BadgeIcon } from './components/BadgeIcon';
import { BadgeLabel } from './components/BadgeLabel';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Badge.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Badge Component - Atomic UI Element
 *
 * Label status/kategori kecil non-interaktif dengan varian semantik,
 * ikon opsional, dan Depth System (-3 s/d 3).
 *
 * @param {BadgeSize} [props.size='md'] - Ukuran badge ('xs', 'sm', 'md', 'lg')
 * @param {BadgeVariant} [props.variant='primary'] - Varian visual warna
 * @param {BadgeAppearance} [props.appearance='filled'] - Gaya tampilan ('filled', 'ghost', 'outline', 'tint')
 * @param {BadgeDepth} [props.depth] - Kedalaman visual ('sunken', 'flat', 'raised-sm', 'raised-md', 'raised-lg', atau -3 s/d 3)
 * @param {BadgeRounded} [props.rounded='full'] - Kelengkungan sudut badge
 * @param {BadgeWeight} [props.weight='medium'] - Bobot ketebalan teks
 * @param {ReactNode} [props.startIcon] - Ikon di awal badge
 * @param {ReactNode} [props.endIcon] - Ikon di akhir badge
 * @param {string} [props.className] - Class kustom tambahan (layout minimal)
 * @param {ReactNode} [props.children] - Konten badge
 *
 * @returns {ReactElement} Elemen span badge
 */
export const Badge: FC<BadgeProps> = ({
  size = 'md',
  variant = 'primary',
  appearance = 'filled',
  depth,
  rounded = 'full',
  weight = 'medium',
  startIcon,
  endIcon,
  className = '',
  children,
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const resolvedDepthClass = depthClasses[resolveDepthKey(depth, variant)] || depthClasses['1'];

  const hasChildren = children !== undefined && children !== null && children !== false && children !== '';
  const isIconOnly = !hasChildren && Boolean(startIcon) !== Boolean(endIcon);
  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = appearanceClasses[variant] ? variant : 'primary';
  const safeAppearance = appearanceClasses[safeVariant][appearance] ? appearance : 'filled';
  const safeRounded = roundedClasses[rounded] ? rounded : 'full';

  const badgeClasses = cn(
    // layout
    'inline-flex items-center justify-center shrink-0 whitespace-nowrap',
    // size
    isIconOnly ? iconOnlySizeClasses[safeSize] : sizeClasses[safeSize],
    // border
    isIconOnly ? roundedClasses.full : roundedClasses[safeRounded],
    // background & variant
    appearanceClasses[safeVariant][safeAppearance],
    // shadow & depth
    resolvedDepthClass,
    // interaction
    'select-none',
    // transition
    'transition-shadow duration-200',
    className
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Clean JSX Output
  // ─────────────────────────────────────────────────────────────
  return (
    <span className={badgeClasses} {...restProps}>
      <BadgeIcon icon={startIcon} size={sizeIconMap[safeSize]} />
      <BadgeLabel textSize={sizeTextMap[safeSize]} weight={weight}>
        {children}
      </BadgeLabel>
      <BadgeIcon icon={endIcon} size={sizeIconMap[safeSize]} />
    </span>
  );
};

export default Badge;
