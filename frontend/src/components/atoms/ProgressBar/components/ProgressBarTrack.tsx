import { forwardRef } from 'react';
import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressBarTrackProps } from '../ProgressBar.types';
import {
  sizeStyles,
  depthClasses,
  resolveDepthKey,
  trackBaseClasses,
} from '../ProgressBar.styles';

/**
 * ProgressBarTrack Component - Sub-Atom Internal ProgressBar
 *
 * Menangani jalur trek alur bilah progres dengan kedalaman taktil (Depth System: skala -3 s/d 3),
 * tinggi terstandarisasi berdasarkan token ukuran, dan mewadahi komponen ProgressBarFill di dalamnya.
 */
export const ProgressBarTrack = forwardRef<HTMLDivElement, ProgressBarTrackProps>(
  (
    {
      size,
      depth,
      disabled = false,
      className = '',
      children,
      ...restProps
    },
    ref
  ): ReactElement => {
    const currentSize = sizeStyles[size] || sizeStyles.md;
    const depthKey = resolveDepthKey(depth);
    const resolvedDepth = depthClasses[depthKey] || depthClasses['-1'];

    const trackClasses = cn(
      // layout & base
      trackBaseClasses,
      // size
      currentSize.trackHeight,
      // shadow & depth
      resolvedDepth,
      // state
      disabled && 'opacity-60 cursor-not-allowed',
      className
    );

    return (
      <div
        ref={ref}
        data-testid="progressbar-track"
        className={trackClasses}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

ProgressBarTrack.displayName = 'ProgressBarTrack';

export default ProgressBarTrack;
