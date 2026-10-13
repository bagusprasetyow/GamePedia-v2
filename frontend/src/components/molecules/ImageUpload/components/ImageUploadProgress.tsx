import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { ProgressBar, Spinner } from '@/components/atoms';
import type { ImageUploadProgressProps } from '../ImageUpload.types';

/**
 * ImageUploadProgress Component - Sub-Atom Internal ImageUpload
 *
 * Menampilkan status animasi progress bar dan persentase pengunggahan berkas gambar
 * dengan indikator putaran pemuatan berbasis atom Spinner.
 */
export const ImageUploadProgress: FC<ImageUploadProgressProps> = ({
  progress = 0,
  label,
  indeterminate = false,
}): ReactElement => {
  const clampedProgress = Math.min(Math.max(Math.round(progress), 0), 100);

  const progressOverlayClasses = cn(
    // layout
    'flex flex-col items-center justify-center',
    // position
    'absolute inset-0 z-10',
    // spacing
    'p-6 gap-3',
    // background & visual filter
    'bg-background/85 backdrop-blur-xs'
  );

  const barWrapperClasses = cn(
    // size
    'w-full max-w-xs'
  );

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={progressOverlayClasses}
    >
      <Spinner
        size="md"
        variant="primary"
        label={label ?? `Mengunggah... ${clampedProgress}%`}
        labelSize="sm"
        labelClassName="font-semibold text-primary"
      />

      <div className={barWrapperClasses}>
        <ProgressBar
          value={clampedProgress}
          indeterminate={indeterminate}
          size="sm"
          color="primary"
          depth={-1}
        />
      </div>
    </div>
  );
};

export default ImageUploadProgress;
