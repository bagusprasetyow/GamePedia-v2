import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { ImageSkeletonProps } from '../Image.types';
import { roundedClasses } from '../Image.styles';

/**
 * ImageSkeleton Component - Sub-Atom Internal Image
 *
 * Menampilkan placeholder animasi pulsa saat gambar sedang dimuat.
 */
export const ImageSkeleton: FC<ImageSkeletonProps> = ({
  rounded = 'none',
  className = '',
}): ReactElement => {
  const safeRounded = roundedClasses[rounded] ? rounded : 'none';

  return (
    <div
      aria-hidden="true"
      className={cn(
        // layout & position
        'absolute inset-0 z-0 pointer-events-none',
        // animation & background
        'animate-pulse bg-muted/70',
        // border radius
        roundedClasses[safeRounded],
        className
      )}
    />
  );
};
