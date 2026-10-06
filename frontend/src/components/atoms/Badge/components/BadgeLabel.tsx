import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import type { BadgeLabelProps } from '../Badge.types';

/**
 * BadgeLabel Component - Sub-Atom Internal Badge
 *
 * Merender teks label badge memakai atom Text (mewarisi warna dari varian badge).
 *
 * @param {TextSize} [props.textSize='xs'] - Ukuran tipografi label
 * @param {BadgeWeight} [props.weight='medium'] - Ketebalan font label
 * @param {ReactNode} [props.children] - Konten teks label
 *
 * @returns {ReactElement | null} Elemen label atau null jika kosong
 */
export const BadgeLabel: FC<BadgeLabelProps> = ({
  textSize = 'xs',
  weight = 'medium',
  children,
}): ReactElement | null => {
  if (children === undefined || children === null || children === false) {
    return null;
  }

  return (
    <Text as="span" size={textSize} weight={weight} variant="inherit" leading="normal" className="truncate">
      {children}
    </Text>
  );
};

export default BadgeLabel;
