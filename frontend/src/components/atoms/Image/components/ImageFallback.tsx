import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Text } from '@/components/atoms';
import type { ImageFallbackProps } from '../Image.types';
import { roundedClasses } from '../Image.styles';

/**
 * ImageFallback Component - Sub-Atom Internal Image
 *
 * Menampilkan tampilan visual pengganti saat gambar gagal dimuat.
 */
export const ImageFallback: FC<ImageFallbackProps> = ({
  children,
  alt = 'Gambar gagal dimuat',
  rounded = 'none',
  className = '',
}): ReactElement => {
  const safeRounded = roundedClasses[rounded] ? rounded : 'none';

  if (children) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center w-full h-full bg-muted/50',
          roundedClasses[safeRounded],
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        // layout
        'flex flex-col items-center justify-center p-4 gap-2',
        // size
        'w-full h-full min-h-25',
        // background & text
        'bg-muted/40 text-muted-foreground select-none',
        // border radius
        roundedClasses[safeRounded],
        className
      )}
    >
      <Icon icon="lucide:image-off" size="xl" className="opacity-60" />
      <Text as="span" size="xs" variant="muted" className="text-center line-clamp-1">
        {alt || 'Gambar tidak tersedia'}
      </Text>
    </div>
  );
};
