import { useState } from 'react';
import type { FC, ReactElement, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { TooltipBubble } from '@/components/atoms/Tooltip';
import type { SliderThumbProps } from '../Slider.types';
import {
  sizeStyles,
  colorStyles,
  thumbBaseClasses,
} from '../Slider.styles';

/**
 * SliderThumb Component - Sub-Atom Internal Slider
 *
 * Menangani elemen knop interaktif (*thumb*) dengan peran aksesibilitas ARIA slider,
 * event keyboard & pointer, indikator visual fokus, depth tactile feedback, serta tooltip nilai.
 */
export const SliderThumb: FC<SliderThumbProps> = ({
  thumbIndex,
  percentage,
  value,
  min,
  max,
  orientation,
  direction,
  size,
  color,
  disabled,
  hasError,
  isSuccess,
  thumbIcon,
  tooltip = false,
  showValueTooltip = false,
  formatValue,
  getAriaValueText,
  isDragging,
  isOtherDragging = false,
  isHovered,
  isFocused,
  onThumbPointerDown,
  onThumbKeyDown,
  onThumbFocus,
  onThumbBlur,
  onThumbMouseEnter,
  onThumbMouseLeave,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  className = '',
}): ReactElement => {
  const [isLocalHovered, setIsLocalHovered] = useState(false);

  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  const thumbPositionStyle: CSSProperties =
    orientation === 'vertical'
      ? direction === 'reverse'
        ? { top: `${safePercentage}%`, left: '50%', transform: 'translate(-50%, -50%)' }
        : { bottom: `${safePercentage}%`, left: '50%', transform: 'translate(-50%, 50%)' }
      : direction === 'reverse'
        ? { right: `${safePercentage}%`, top: '50%', transform: 'translate(50%, -50%)' }
        : { left: `${safePercentage}%`, top: '50%', transform: 'translate(-50%, -50%)' };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentColor = colorStyles[color] || colorStyles.primary;

  const colorAndRingClass = hasError
    ? 'border-destructive text-destructive focus-visible:ring-destructive/30'
    : isSuccess
      ? 'border-success text-success focus-visible:ring-success/30'
      : cn(currentColor.thumbBorder, currentColor.focusRing, currentColor.thumbHover);

  // Tooltip selalu stabil dan tidak berkedip saat drag
  const isTooltipVisible =
    (tooltip || showValueTooltip) &&
    !disabled &&
    !isOtherDragging &&
    (isDragging || isLocalHovered || isHovered || isFocused);

  const formattedDisplayValue = formatValue ? formatValue(value) : value;
  const ariaValueText = getAriaValueText ? getAriaValueText(value) : String(value);

  const thumbDisabledClasses = 'cursor-not-allowed opacity-50 bg-muted border-muted-foreground/30 shadow-none';
  const thumbInteractiveClasses = isOtherDragging
    ? 'pointer-events-none'
    : 'cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95';

  const thumbClasses = cn(
    // position & base
    thumbBaseClasses,
    // size
    currentSize.thumb,
    // border, focus & hover ring
    colorAndRingClass,
    // interaction & state
    disabled ? thumbDisabledClasses : thumbInteractiveClasses,
    // active & dragging
    isDragging && 'scale-110 shadow-3 cursor-grabbing',
    className
  );

  const thumbIconClasses = cn(
    // layout
    'flex items-center justify-center',
    // typography & size
    currentSize.thumbIcon,
    // interaction
    'pointer-events-none select-none'
  );

  const tooltipBubbleClasses = cn(
    // position
    'z-30',
    // typography
    'whitespace-nowrap',
    // interaction
    'pointer-events-none select-none',
    // transition
    isDragging && '!transition-none'
  );

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={ariaValueText}
      aria-orientation={orientation}
      aria-disabled={disabled}
      aria-invalid={hasError}
      aria-label={ariaLabel || (thumbIndex !== undefined ? `Slider knop ${thumbIndex + 1}` : undefined)}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      style={thumbPositionStyle}
      className={thumbClasses}
      onPointerDown={onThumbPointerDown}
      onKeyDown={onThumbKeyDown}
      onFocus={onThumbFocus}
      onBlur={onThumbBlur}
      onMouseEnter={() => {
        setIsLocalHovered(true);
        onThumbMouseEnter();
      }}
      onMouseLeave={() => {
        setIsLocalHovered(false);
        onThumbMouseLeave();
      }}
    >
      {/* Icon di dalam Thumb jika ada */}
      {thumbIcon && (
        <span className={thumbIconClasses} aria-hidden="true">
          {thumbIcon}
        </span>
      )}

      {/* Floating Tooltip Nilai Menggunakan Atom Tooltip */}
      {isTooltipVisible && (
        <TooltipBubble
          id={`${ariaDescribedBy || 'slider-thumb'}-${thumbIndex ?? 0}-tooltip`}
          visible={true}
          content={formattedDisplayValue}
          placement={orientation === 'vertical' ? 'right' : 'top'}
          size={size === 'lg' ? 'sm' : 'xs'}
          variant="dark"
          depth={3}
          showArrow
          tooltipClassName={tooltipBubbleClasses}
          arrowClassName={cn(isDragging && '!transition-none')}
        />
      )}
    </div>
  );
};

export default SliderThumb;
