import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { SliderTrackProps } from '../Slider.types';
import {
  sizeStyles,
  depthClasses,
  resolveDepthKey,
  trackBaseClasses,
} from '../Slider.styles';

/**
 * SliderTrack Component - Sub-Atom Internal Slider
 *
 * Menangani jalur trek slider dengan kedalaman taktil (Depth System: skala -3 s/d 3),
 * dukungan interaksi klik pada trek (*trackClickable*), serta mewadahi komponen Range, Marks, dan Thumb.
 */
export const SliderTrack: FC<SliderTrackProps> = ({
  orientation,
  size,
  depth,
  disabled,
  hasError,
  isSuccess,
  trackClickable,
  onTrackPointerDown,
  className = '',
  children,
}): ReactElement => {
  const currentSize = sizeStyles[size] || sizeStyles.md;
  const depthKey = resolveDepthKey(depth);
  const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

  const trackDimensionClasses =
    orientation === 'vertical'
      ? currentSize.trackVertical
      : cn('w-full', currentSize.trackHorizontal);

  const trackClasses = cn(
    // layout & base
    trackBaseClasses,
    // size
    trackDimensionClasses,
    // shadow & depth
    resolvedDepth,
    // border & state
    hasError && 'border-destructive/60',
    isSuccess && 'border-success/60',
    disabled
      ? 'cursor-not-allowed opacity-50'
      : trackClickable
        ? 'cursor-pointer'
        : 'cursor-default',
    className
  );

  return (
    <div
      data-testid="slider-track"
      className={trackClasses}
      onPointerDown={onTrackPointerDown}
    >
      {children}
    </div>
  );
};

export default SliderTrack;
