import type { FC, ReactElement, CSSProperties, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { SliderMarksProps } from '../Slider.types';
import { sizeStyles, markTickClasses, markLabelClasses } from '../Slider.styles';
import { valueToPercentage } from '../Slider.utils';

/**
 * SliderMarks Component - Sub-Atom Internal Slider
 *
 * Menampilkan titik-titik penanda (*ticks*) dan teks penjelas nilai di sepanjang trek slider,
 * serta mendukung interaksi klik untuk melompatkan posisi slider ke nilai penanda.
 */
export const SliderMarks: FC<SliderMarksProps> = ({
  marks,
  min,
  max,
  orientation,
  direction,
  size,
  currentValue,
  disabled,
  marksClickable,
  onMarkClick,
}): ReactElement | null => {
  if (!marks || marks.length === 0) {
    return null;
  }

  const currentSize = sizeStyles[size] || sizeStyles.md;

  // Saring mark yang berada di dalam range [min, max] dan hilangkan duplikasi value
  const seenValues = new Set<number>();
  const validMarks = marks.filter((mark) => {
    if (typeof mark.value !== 'number' || isNaN(mark.value)) return false;
    if (mark.value < min || mark.value > max) return false;
    if (seenValues.has(mark.value)) return false;
    seenValues.add(mark.value);
    return true;
  });

  if (validMarks.length === 0) {
    return null;
  }

  const handleMarkClick = (e: MouseEvent, markValue: number, markDisabled?: boolean) => {
    e.stopPropagation();
    if (disabled || markDisabled || !marksClickable) return;
    onMarkClick(markValue);
  };

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {validMarks.map((mark) => {
        const pct = valueToPercentage(mark.value, min, max, direction);
        const isPassed = Array.isArray(currentValue)
          ? mark.value >= Math.min(currentValue[0], currentValue[1]) &&
            mark.value <= Math.max(currentValue[0], currentValue[1])
          : direction === 'reverse'
            ? mark.value >= currentValue
            : mark.value <= currentValue;

        const tickStyle: CSSProperties =
          orientation === 'vertical'
            ? direction === 'reverse'
              ? { top: `${pct}%`, left: '50%' }
              : { bottom: `${pct}%`, left: '50%' }
            : direction === 'reverse'
              ? { right: `${pct}%`, top: '50%' }
              : { left: `${pct}%`, top: '50%' };

        const labelStyle: CSSProperties =
          orientation === 'vertical'
            ? direction === 'reverse'
              ? { top: `${pct}%`, left: '100%', transform: 'translate(10px, -50%)' }
              : { bottom: `${pct}%`, left: '100%', transform: 'translate(10px, 50%)' }
            : direction === 'reverse'
              ? { right: `${pct}%`, top: '100%', transform: 'translate(50%, 6px)' }
              : { left: `${pct}%`, top: '100%', transform: 'translate(-50%, 6px)' };

        const isMarkInteractive = marksClickable && !mark.disabled && !disabled;

        const tickClasses = cn(
          // base & position
          markTickClasses,
          // size
          currentSize.markDot,
          // background
          isPassed ? 'bg-primary-foreground/90' : 'bg-muted-foreground/40',
          // interaction & hover
          isMarkInteractive && 'pointer-events-auto cursor-pointer hover:scale-125'
        );

        const labelClasses = cn(
          // base & position
          markLabelClasses,
          // typography & size
          currentSize.markLabel,
          // text color & weight
          isPassed ? 'text-foreground font-semibold' : 'text-muted-foreground',
          // state
          mark.disabled && 'opacity-40 cursor-not-allowed',
          // interaction & hover
          isMarkInteractive && 'pointer-events-auto cursor-pointer hover:text-foreground'
        );

        return (
          <div key={`slider-mark-${mark.value}`}>
            {/* Titik Penanda (Tick Dot) */}
            <span
              style={tickStyle}
              onClick={(e) => handleMarkClick(e, mark.value, mark.disabled)}
              className={tickClasses}
            />

            {/* Label Teks Penanda jika ada */}
            {mark.label && (
              <Text
                as="span"
                style={labelStyle}
                onClick={(e) => handleMarkClick(e, mark.value, mark.disabled)}
                className={labelClasses}
              >
                {mark.label}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SliderMarks;
