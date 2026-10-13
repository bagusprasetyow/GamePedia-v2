import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { SpinnerProps, SpinnerSize } from './Spinner.types';
import {
  sizeClasses,
  variantClasses,
  depthClasses,
  labelPositionClasses,
  sizeLabelTextMap,
  resolveDepthKey,
} from './Spinner.styles';
import { SpinnerRing } from './components/SpinnerRing';
import { SpinnerLabel } from './components/SpinnerLabel';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// (Didefinisikan dan diekspor secara modular di Spinner.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * Spinner Component - Atomic UI Element
 *
 * Komponen indikator status pemuatan (loading spinner) terenkapsulasi penuh dengan
 * dukungan varian semantik OKLCH, variasi ketebalan ring, Depth System (-3 s/d 3),
 * kecepatan rotasi animasi, teks label pendamping modular berbasis atom Text,
 * serta aksesibilitas layar (role="status" dan aria-live="polite").
 *
 * @param {SpinnerSize | number | string} [props.size='md'] - Ukuran fisik spinner ('2xs' s/d '2xl' atau nilai pixel kustom)
 * @param {SpinnerVariant} [props.variant='primary'] - Varian warna semantik ('primary', 'secondary', 'accent', 'contrast', 'muted', 'white', 'success', 'warning', 'error', 'info', 'inherit')
 * @param {SpinnerThickness} [props.thickness='normal'] - Ketebalan garis putaran lingkaran ('thin', 'normal', 'thick')
 * @param {SpinnerDepth} [props.depth=0] - Tingkat kedalaman visual taktil Depth System (-3 s/d 3 atau alias named)
 * @param {SpinnerSpeed} [props.speed='normal'] - Kecepatan durasi putaran ('slow', 'normal', 'fast')
 * @param {SpinnerTrackOpacity} [props.trackOpacity='light'] - Opasitas cincin latar belakang ('faint', 'light', 'normal', 'transparent')
 * @param {string} [props.icon] - Ikon kustom Iconify opsional jika tidak menggunakan SVG ring bawaan
 * @param {ReactNode} [props.label] - Teks deskripsi pemuatan (misal: "Memuat data...")
 * @param {SpinnerLabelPosition} [props.labelPosition='right'] - Posisi tata letak teks label ('right', 'bottom', 'top', 'left')
 * @param {TextSize} [props.labelSize] - Ukuran tipografi teks label kustom
 * @param {string} [props.labelClassName] - Class kustom tambahan untuk teks label
 * @param {string} [props.spinnerClassName] - Class kustom tambahan untuk elemen ring/SVG
 * @param {string} [props.className] - Class kustom tambahan untuk kontainer pembungkus
 *
 * @returns {ReactElement} Elemen HTML indikator loading status
 */
export const Spinner: FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  thickness = 'normal',
  depth = 0,
  speed = 'normal',
  trackOpacity = 'light',
  icon,
  label,
  labelPosition = 'right',
  labelSize,
  labelClassName = '',
  spinnerClassName = '',
  className = '',
  role = 'status',
  'aria-live': ariaLive = 'polite',
  ...restProps
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const isPresetSize = typeof size === 'string' && size in sizeClasses;
  const safeSizeKey = isPresetSize ? (size as SpinnerSize) : 'md';

  const safeVariant = variantClasses[variant] ? variant : 'primary';
  const safeLabelPosition = labelPositionClasses[labelPosition] ? labelPosition : 'right';

  const depthKey = resolveDepthKey(depth, variant);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['0'];

  const resolvedTextSize = labelSize || (isPresetSize ? sizeLabelTextMap[safeSizeKey] : 'sm');

  const containerClasses = cn(
    // layout
    'inline-flex shrink-0',
    // orientation & label positioning
    label ? labelPositionClasses[safeLabelPosition] : 'items-center justify-center',
    // semantic color
    variantClasses[safeVariant],
    // depth shadow
    resolvedDepthClass,
    // custom container className
    className
  );

  const accessibleLabel =
    typeof label === 'string' ? label : 'Memuat data, mohon tunggu...';

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI
  // ─────────────────────────────────────────────────────────────
  return (
    <span
      role={role}
      aria-live={ariaLive}
      aria-label={restProps['aria-label'] || accessibleLabel}
      className={containerClasses}
      {...restProps}
    >
      <SpinnerRing
        size={size}
        thickness={thickness}
        trackOpacity={trackOpacity}
        speed={speed}
        icon={icon}
        className={spinnerClassName}
      />
      {label && (
        <SpinnerLabel
          label={label}
          textSize={resolvedTextSize}
          className={labelClassName}
        />
      )}
    </span>
  );
};

export default Spinner;
