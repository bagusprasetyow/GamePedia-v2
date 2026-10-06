import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import type { ChipLabelProps } from '../Chip.types';

/**
 * ChipLabel Component - Sub-Atom Internal Chip
 *
 * Merender teks label chip memakai atom Text (mewarisi warna dari varian chip).
 *
 * @param {TextSize} [props.textSize='xs'] - Ukuran tipografi label
 * @param {ChipWeight} [props.weight='medium'] - Ketebalan font label
 * @param {ReactNode} [props.children] - Konten teks label
 *
 * @returns {ReactElement | null} Elemen label atau null jika kosong
 */
export const ChipLabel: FC<ChipLabelProps> = ({
  textSize = 'xs',
  weight = 'medium',
  children,
}): ReactElement | null => {
  if (children === undefined || children === null || children === false || children === '') {
    return null;
  }

  return (
    <Text
      as="span"
      size={textSize}
      weight={weight}
      variant="inherit"
      leading="normal"
      className="truncate"
    >
      {children}
    </Text>
  );
};

export default ChipLabel;
