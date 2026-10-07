import type { FC, ReactElement, CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { ProgressBarFillProps } from '../ProgressBar.types';
import {
  colorStyles,
  fillBaseClasses,
  indeterminateFillClasses,
} from '../ProgressBar.styles';

/**
 * ProgressBarFill Component - Sub-Atom Internal ProgressBar
 *
 * Menampilkan isian bilah aktif (*filled progress bar*) dengan lebar berbasis persentase
 * atau animasi gelombang alur kontinu pada mode tak tentu (*indeterminate*).
 */
export const ProgressBarFill: FC<ProgressBarFillProps> = ({
  percentage,
  color,
  indeterminate = false,
  disabled = false,
  className = '',
}): ReactElement => {
  const safeColorClass = colorStyles[color] || colorStyles.primary;

  if (indeterminate) {
    const indeterminateClasses = cn(
      // layout & base
      indeterminateFillClasses,
      // background & variant
      safeColorClass,
      // state
      disabled && 'opacity-60',
      className
    );

    const shimmerClasses = cn(
      // position
      'absolute inset-0',
      // border
      'rounded-full',
      // background
      'bg-linear-to-r from-transparent via-white/20 to-transparent',
      // interaction
      'pointer-events-none'
    );

    return (
      <div
        data-testid="progressbar-fill-indeterminate"
        className={indeterminateClasses}
        aria-hidden="true"
      >
        <span className={shimmerClasses} aria-hidden="true" />
      </div>
    );
  }

  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const fillStyle: CSSProperties = {
    width: `${clampedPercentage}%`,
  };

  const determinateClasses = cn(
    // layout & base
    fillBaseClasses,
    // background & variant
    safeColorClass,
    // state
    disabled && 'opacity-60',
    className
  );

  return (
    <div
      data-testid="progressbar-fill"
      style={fillStyle}
      className={determinateClasses}
      aria-hidden="true"
    />
  );
};

export default ProgressBarFill;
