import type { FC, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';

export interface ImageUploadHeaderProps {
  /**
   * Teks label di atas area unggah gambar.
   */
  label?: ReactNode;
  /**
   * Keterangan deskripsi petunjuk di bawah label.
   */
  description?: ReactNode;
  /**
   * ClassName tambahan untuk kontainer header.
   */
  className?: string;
}

/**
 * ImageUploadHeader Component - Sub-Atom Internal ImageUpload
 *
 * Menampilkan label dan teks deskripsi instruksi di atas bidang pengunggah berkas.
 */
export const ImageUploadHeader: FC<ImageUploadHeaderProps> = ({
  label,
  description,
  className = '',
}): ReactElement | null => {
  if (!label && !description) return null;


  const headerClasses = cn(
    // layout
    'flex flex-col gap-0.5',
    className
  );


  return (
    <div className={headerClasses}>
      {label && (
        <Text as="p" size="sm" weight="medium" variant="default">
          {label}
        </Text>
      )}
      {description && (
        <Text as="p" size="xs" variant="muted">
          {description}
        </Text>
      )}
    </div>
  );

};
