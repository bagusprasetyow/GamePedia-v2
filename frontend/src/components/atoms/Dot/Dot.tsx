import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { DotProps } from './Dot.types';
import {
  sizeClasses,
  sizeLabelMap,
  placementClasses,
} from './Dot.styles';
import { DotCircle } from './components/DotCircle';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Dot.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Dot Component - Atomic UI Element
 *
 * Komponen titik status visual terenkapsulasi penuh dengan dukungan varian semantik,
 * animasi denyut (ping halo & pulse), efek neon glow, Depth System (-3 s/d 3),
 * teks label pendamping, serta penempatan anchor overlay pada elemen anak (avatar/icon/button).
 *
 * @param {DotSize} [props.size='md'] - Ukuran fisik dot ('2xs', 'xs', 'sm', 'md', 'lg', 'xl')
 * @param {DotVariant} [props.variant='primary'] - Varian semantik warna ('primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info', 'contrast', 'white')
 * @param {DotDepth} [props.depth=0] - Kedalaman visual Depth System skala -3 s/d 3
 * @param {boolean} [props.ping=false] - Efek animasi gelombang halo berdenyut (ripple ping)
 * @param {boolean} [props.pulse=false] - Efek animasi pulsasi redup-terang perlahan
 * @param {boolean} [props.glow=false] - Efek pendaran neon ambient glow warna senada
 * @param {boolean} [props.bordered=false] - Cincin pemisah kontras di sekeliling dot (ring-2 ring-background)
 * @param {ReactNode} [props.label] - Teks label status pendamping (misal: "Online", "Live")
 * @param {'left' | 'right'} [props.labelPosition='right'] - Posisi peletakan label terhadap dot
 * @param {TextSize} [props.labelSize] - Ukuran teks label kustom
 * @param {string} [props.labelClassName] - Class kustom untuk teks label
 * @param {DotPlacement} [props.placement='top-right'] - Posisi penempatan anchor saat membungkus children
 * @param {boolean} [props.invisible=false] - Menyembunyikan dot secara visual jika bernilai true
 * @param {ReactNode} [props.children] - Elemen anak target yang ditempeli dot
 * @param {string} [props.className] - Class kustom untuk kontainer utama
 * @param {string} [props.dotClassName] - Class kustom khusus untuk bulatan dot
 *
 * @returns {ReactElement | null} Elemen dot status
 */
export const Dot: FC<DotProps> = ({
  size = 'md',
  variant = 'primary',
  depth = 0,
  ping = false,
  pulse = false,
  glow = false,
  bordered = false,
  label,
  labelPosition = 'right',
  labelSize,
  labelClassName = '',
  placement = 'top-right',
  invisible = false,
  children,
  className = '',
  dotClassName = '',
  role = 'status',
  ...restProps
}): ReactElement | null => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  if (invisible && !children) {
    return null;
  }

  const safeSize = sizeClasses[size] ? size : 'md';
  const labelConfig = sizeLabelMap[safeSize] || sizeLabelMap.md;
  const effectiveLabelSize = labelSize || labelConfig.textSize;

  const dotCircleNode = (
    <DotCircle
      size={size}
      variant={variant}
      depth={depth}
      ping={ping}
      pulse={pulse}
      glow={glow}
      bordered={bordered}
      invisible={invisible}
      className={dotClassName}
    />
  );

  const ariaLabelValue =
    (restProps['aria-label'] as string | undefined) ??
    (typeof label === 'string' ? label : `${variant} status indicator`);

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI: Skenario Render JSX
  // ─────────────────────────────────────────────────────────────

  // Skenario A: Overlay Anchor Mode (membungkus elemen anak seperti Avatar / Button / Icon)
  if (children) {
    return (
      <span
        role={role}
        aria-label={ariaLabelValue}
        className={cn('relative inline-flex shrink-0', className)}
        {...restProps}
      >
        {children}
        {!invisible && (
          <span
            className={cn(
              'absolute z-10 pointer-events-none',
              placementClasses[placement] || placementClasses['top-right']
            )}
          >
            {dotCircleNode}
          </span>
        )}
      </span>
    );
  }

  // Skenario B: Standalone Mode dengan Teks Label Pendamping
  if (label) {
    return (
      <span
        role={role}
        aria-label={ariaLabelValue}
        className={cn('inline-flex items-center shrink-0', labelConfig.gap, className)}
        {...restProps}
      >
        {labelPosition === 'left' && (
          <Text as="span" size={effectiveLabelSize} weight="medium" className={labelClassName}>
            {label}
          </Text>
        )}

        {dotCircleNode}

        {labelPosition === 'right' && (
          <Text as="span" size={effectiveLabelSize} weight="medium" className={labelClassName}>
            {label}
          </Text>
        )}
      </span>
    );
  }

  // Skenario C: Standalone Dot Tunggal
  return (
    <span
      role={role}
      aria-label={ariaLabelValue}
      className={cn('inline-flex items-center justify-center shrink-0', className)}
      {...restProps}
    >
      {dotCircleNode}
    </span>
  );
};

export default Dot;

