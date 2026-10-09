import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms';
import type { ImageUploadActionsProps } from '../ImageUpload.types';

/**
 * ImageUploadActions Component - Sub-Atom Internal ImageUpload
 *
 * Tombol kontrol aksi untuk mengganti atau membatalkan/menghapus pilihan gambar.
 */
export const ImageUploadActions: FC<ImageUploadActionsProps> = ({
  onBrowse,
  onClear,
  clearable,
  disabled,
  className = '',
}): ReactElement => {
  const containerClasses = cn(
    // layout
    'flex items-center gap-1.5',
    className
  );

  return (
    <div className={containerClasses}>
      <Button
        type="button"
        size="2xs"
        variant="secondary"
        depth={1}
        disabled={disabled}
        onClick={(e) => {
          (e.currentTarget as HTMLElement)?.blur();
          onBrowse();
        }}
        startIcon="lucide:refresh-cw"
      >
        Ganti
      </Button>

      {clearable && (
        <Button
          type="button"
          size="2xs"
          variant="error"
          depth={1}
          disabled={disabled}
          onClick={(e) => {
            (e.currentTarget as HTMLElement)?.blur();
            onClear();
          }}
          startIcon="lucide:trash-2"
        >
          Hapus
        </Button>
      )}
    </div>
  );
};

