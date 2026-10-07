import type { FC, ReactElement, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { SliderRangeProps } from '../Slider.types';
import { colorStyles } from '../Slider.styles';

/**
 * SliderRange Component - Sub-Atom Internal Slider
 *
 * Menampilkan bilah aktif (*filled range bar*) yang membentang dari titik batas
 * awal hingga posisi knop saat ini, atau membentang di antara dua knop pada mode Range Slider.
 */
export const SliderRange: FC<SliderRangeProps> = ({
  startPercentage,
  endPercentage,
  percentage,
  orientation,
  direction,
  color,
  disabled,
  hasError,
  isSuccess,
  className = '',
}): ReactElement => {
  const rawStart = startPercentage !== undefined ? startPercentage : 0;
  const rawEnd = endPercentage !== undefined ? endPercentage : (percentage ?? 0);

  const start = Math.min(Math.max(Math.min(rawStart, rawEnd), 0), 100);
  const end = Math.min(Math.max(Math.max(rawStart, rawEnd), 0), 100);
  const length = end - start;

  const style: CSSProperties =
    orientation === 'vertical'
      ? direction === 'reverse'
        ? { top: `${start}%`, height: `${length}%`, width: '100%' }
        : { bottom: `${start}%`, height: `${length}%`, width: '100%' }
      : direction === 'reverse'
        ? { right: `${start}%`, width: `${length}%`, height: '100%' }
        : { left: `${start}%`, width: `${length}%`, height: '100%' };

  const colorClass = hasError
    ? 'bg-destructive'
    : isSuccess
      ? 'bg-success'
      : colorStyles[color]?.range || colorStyles.primary.range;

  const rangeClasses = cn(
    // position
    'absolute',
    // border
    'rounded-full',
    // background & variant
    colorClass,
    // state
    disabled && 'opacity-50',
    // transition & interaction
    'pointer-events-none transition-colors duration-150',
    className
  );

  return <div style={style} className={rangeClasses} aria-hidden="true" />;
};

export default SliderRange;
