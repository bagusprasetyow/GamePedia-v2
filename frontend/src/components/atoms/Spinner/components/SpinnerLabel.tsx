import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { SpinnerLabelProps } from '../Spinner.types';

/**
 * SpinnerLabel Component - Sub-Atom Internal Spinner
 *
 * Merender teks keterangan deskriptif pendamping pemuatan menggunakan komponen atom Text
 * dengan varian warna inherit agar konsisten dengan varian semantik spinner.
 *
 * @param {ReactNode} props.label - Teks atau node label pemuatan
 * @param {TextSize} [props.textSize='sm'] - Skala tipografi teks label
 * @param {string} [props.className] - Class kustom tambahan untuk teks label
 *
 * @returns {ReactElement | null} Elemen label status pemuatan
 */
export const SpinnerLabel: FC<SpinnerLabelProps> = ({
  label,
  textSize = 'sm',
  className = '',
}): ReactElement | null => {
  if (!label) return null;

  return (
    <Text
      as="span"
      size={textSize}
      weight="medium"
      variant="inherit"
      className={cn('select-none leading-none', className)}
    >
      {label}
    </Text>
  );
};

export default SpinnerLabel;
