import { forwardRef, useId } from 'react';
import type { ReactElement, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { ProgressBarProps } from './ProgressBar.types';
import { descriptionClasses } from './ProgressBar.styles';
import { normalizeProgressValue, formatProgressValue } from './ProgressBar.utils';
import { ProgressBarTrack } from './components/ProgressBarTrack';
import { ProgressBarFill } from './components/ProgressBarFill';
import { ProgressBarLabel } from './components/ProgressBarLabel';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Tokens & Styling Setup
// ─────────────────────────────────────────────────────────────

/**
 * ProgressBar Component - Atomic UI Element
 *
 * Komponen bilah indikator kemajuan (status display) berbasis Atomic Design dengan
 * kedalaman visual taktil (Depth System skala -3 s/d 3), varian warna semantik GamePedia,
 * mode terukur (determinate) & tak terukur (indeterminate), label informatif, dan aksesibilitas ARIA penuh.
 *
 * @param {ProgressBarProps} props - Properti konfigurasi bilah progres
 * @param {number} [props.value=0] - Nilai progres saat ini (dibatasi 0 s/d max)
 * @param {number} [props.max=100] - Nilai kapasitas maksimum (> 0)
 * @param {boolean} [props.indeterminate=false] - Mode loading alur tak tentu tanpa batas nilai
 * @param {ProgressBarSize} [props.size='md'] - Ukuran tinggi bilah ('sm', 'md', 'lg')
 * @param {ProgressBarColor} [props.color='primary'] - Varian warna semantik tema
 * @param {ProgressBarDepth} [props.depth=-1] - Kedalaman visual trek (bawaan: alur cekung -1)
 * @param {ReactNode} [props.label] - Teks label judul di atas bilah
 * @param {boolean} [props.showValue=false] - Tampilkan teks nilai persentase secara visual
 * @param {(value: number, max: number) => ReactNode} [props.formatValue] - Formatter kustom nilai
 * @param {ReactNode} [props.description] - Keterangan teks bantuan di bawah bilah
 * @param {boolean} [props.disabled=false] - Menonaktifkan tampilan visual (opacity redup)
 * @param {boolean} [props.fullWidth=true] - Membentang selebar 100% kontainer induk
 * @param {'auto' | 'full' | string} [props.width] - Lebar kustom spesifik (misal '280px')
 * @param {string} [props.wrapperClassName=''] - Class CSS kustom untuk wadah pembungkus
 * @param {string} [props.className=''] - Class CSS kustom untuk elemen trek alur
 * @param {string} [props.id] - ID elemen trek untuk asosiasi ARIA
 *
 * @returns {ReactElement} Elemen bilah progres status
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      size = 'md',
      color = 'primary',
      depth = -1,
      label,
      showValue = false,
      formatValue,
      description,
      disabled = false,
      fullWidth = true,
      width,
      wrapperClassName = '',
      className = '',
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledByProp,
      'aria-describedby': ariaDescribedByProp,
      ...restProps
    },
    ref
  ): ReactElement => {
    // ─────────────────────────────────────────────────────────────
    // 2. LOGIKA: State, Identifiers & Accessible Computations
    // ─────────────────────────────────────────────────────────────
    const generatedId = useId();
    const progressId = id || generatedId;
    const labelId = `${progressId}-label`;
    const descId = `${progressId}-desc`;

    const {
      value: normalizedValue,
      max: normalizedMax,
      percentage,
    } = normalizeProgressValue(value, max);

    // Nilai angka hanya ditampilkan pada mode determinate
    const formattedValue =
      !indeterminate && showValue
        ? formatProgressValue(normalizedValue, normalizedMax, percentage, formatValue)
        : undefined;

    // Resolusi hubungan ARIA
    const resolvedAriaLabelledBy =
      ariaLabelledByProp || (label ? labelId : undefined);
    const resolvedAriaDescribedBy =
      ariaDescribedByProp || (description ? descId : undefined);

    // Penentuan lebar kontainer
    const customWidthStyle: CSSProperties | undefined =
      typeof width === 'string' && width.trim() !== '' && width !== 'auto' && width !== 'full'
        ? { width }
        : undefined;

    const widthClass =
      width === 'auto' || (!fullWidth && width !== 'full')
        ? 'w-auto'
        : width === 'full'
          ? 'w-full'
          : customWidthStyle
            ? ''
            : 'w-full';

    const wrapperClasses = cn(
      // layout
      'flex flex-col',
      // size
      widthClass,
      // state
      disabled && 'opacity-60 cursor-not-allowed',
      wrapperClassName
    );

    // ─────────────────────────────────────────────────────────────
    // 3. RENDER UI
    // ─────────────────────────────────────────────────────────────
    return (
      <div style={customWidthStyle} className={wrapperClasses}>
        <ProgressBarLabel
          id={label ? labelId : undefined}
          label={label}
          showValue={showValue && !indeterminate}
          formattedValue={formattedValue}
          size={size}
        />

        <ProgressBarTrack
          ref={ref}
          id={progressId}
          size={size}
          depth={depth}
          disabled={disabled}
          className={className}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={normalizedMax}
          aria-valuenow={indeterminate ? undefined : normalizedValue}
          aria-labelledby={resolvedAriaLabelledBy}
          aria-describedby={resolvedAriaDescribedBy}
          aria-label={ariaLabel}
          aria-busy={indeterminate ? true : undefined}
          {...restProps}
        >
          <ProgressBarFill
            percentage={percentage}
            color={color}
            indeterminate={indeterminate}
            disabled={disabled}
          />
        </ProgressBarTrack>

        {description && (
          <Text as="p" id={descId} className={descriptionClasses}>
            {description}
          </Text>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
