import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { ShowcasePreviewInfoProps } from '../ShowcasePreview.types';

/**
 * ShowcasePreviewInfo Component - Sub-Atom Internal ShowcasePreview
 *
 * Menampilkan baris indikator informasi interaksi (misalnya hitungan klik dan timestamp)
 * pada pojok kiri atas kanvas ShowcasePreview.
 *
 * @param {ShowcasePreviewInfoProps} props - Properti komponen
 * @returns {ReactElement | null} Elemen bar informasi atau null bila tidak ada data
 */
export const ShowcasePreviewInfo: FC<ShowcasePreviewInfoProps> = ({
  clickCount,
  lastClickedAt,
  info,
  className = '',
}): ReactElement | null => {
  // Jika ada custom info node, render langsung
  if (info) {
    return <div className={cn('absolute top-3 left-4 flex items-center gap-2', className)}>{info}</div>;
  }

  // Jika tidak ada data klik yang tercatat, return null
  if (clickCount === undefined) {
    return null;
  }

  return (
    <div className={cn('absolute top-3 left-4 flex items-center gap-2', className)}>
      <Text as="span" size="xs" variant="muted" className="font-mono">
        Klik: <Text as="strong" size="xs" weight="bold" className="text-foreground">{clickCount}x</Text>
      </Text>
      {lastClickedAt && (
        <Text as="span" size="xs" variant="muted" className="font-mono">
          (Terakhir: {lastClickedAt})
        </Text>
      )}
    </div>
  );
};

export default ShowcasePreviewInfo;
