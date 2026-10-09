import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { ImageUploadInfoProps } from '../ImageUpload.types';

/**
 * ImageUploadInfo Component - Sub-Atom Internal ImageUpload
 *
 * Menampilkan rincian metadata nama dan ukuran berkas gambar
 * di atas (dalam) gambar tanpa background, tanpa ikon, dan tanpa tombol x,
 * yang hanya muncul saat area gambar di-hover.
 */
export const ImageUploadInfo: FC<ImageUploadInfoProps> = ({
  fileDetails,
  className = '',
}): ReactElement | null => {
  if (!fileDetails) return null;

  const infoContainerClasses = cn(
    // layout
    'flex flex-col min-w-0',
    // position
    'absolute top-3 left-3 z-20',
    // size
    'max-w-[calc(100%-1.5rem)]',
    // text
    'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]',
    // interaction
    'select-none pointer-events-none',
    // state & transition
    'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
    className
  );

  const isCompressed = Boolean(
    fileDetails.originalFormattedSize &&
    fileDetails.originalSize &&
    fileDetails.originalSize !== fileDetails.size
  );

  const sizeDetailsContainerClasses = cn(
    // layout
    'flex items-center gap-1.5 flex-wrap'
  );

  return (
    <div className={infoContainerClasses}>
      <Text as="p" size="xs" weight="medium" className="truncate max-w-45 sm:max-w-xs text-white">
        {fileDetails.name}
      </Text>
      <div className={sizeDetailsContainerClasses}>

        {isCompressed && (
          <Text as="span" size="xs" className="line-through text-white/60">
            {fileDetails.originalFormattedSize}
          </Text>
        )}
        <Text
          as="span"
          size="xs"
          weight={isCompressed ? 'semibold' : 'normal'}
          className={
            isCompressed
              ? 'text-success drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
              : 'text-white/80'
          }
        >
          {fileDetails.formattedSize}
        </Text>
      </div>
    </div>
  );
};
