import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { ShowcasePreviewBackgroundProps } from '../ShowcasePreview.types';
import { backgroundVariantClasses } from '../ShowcasePreview.styles';

/**
 * ShowcasePreviewBackground Component - Sub-Atom Internal ShowcasePreview
 *
 * Menampilkan dekorasi latar belakang grafis halus (dot matrix, grid, atau radial accent)
 * di belakang komponen yang sedang diuji tanpa mengganggu event interaksi pointer.
 *
 * @param {ShowcasePreviewBackgroundProps} props - Properti komponen
 * @returns {ReactElement | null} Elemen background overlay
 */
export const ShowcasePreviewBackground: FC<ShowcasePreviewBackgroundProps> = ({
  variant = 'dots',
  className = '',
}): ReactElement | null => {
  if (variant === 'plain') {
    return null;
  }

  const patternClass = backgroundVariantClasses[variant] || backgroundVariantClasses.dots;

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', patternClass, className)}
    />
  );
};

export default ShowcasePreviewBackground;
