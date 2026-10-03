import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms';
import type { ClipboardLabelProps } from '../Clipboard.types';

/**
 * ClipboardLabel Component - Sub-Molecule Internal Clipboard
 *
 * Merender teks label atomik untuk status idle ('Salin') dan status tersalin ('Tersalin!')
 * menggunakan atom Text custom untuk menjaga konsistensi tipografi GamePedia.
 */
export const ClipboardLabel: FC<ClipboardLabelProps> = ({
  copied,
  label = 'Salin',
  copiedLabel = 'Tersalin!',
  className = '',
}): ReactElement | null => {
  const activeLabel = copied ? copiedLabel : label;
  if (!activeLabel) return null;

  if (typeof activeLabel === 'string') {
    return (
      <Text as="span" size="xs" weight="medium" variant="inherit" className={className}>
        {activeLabel}
      </Text>
    );
  }

  return <>{activeLabel}</>;
};

export default ClipboardLabel;
