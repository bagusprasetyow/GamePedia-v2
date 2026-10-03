import type { FC, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { TextSize } from '@/components/atoms/Text/Text.types';

export interface CheckboxLabelProps {
  /**
   * Teks atau node label utama checkbox.
   */
  label?: ReactNode;

  /**
   * Teks atau node deskripsi tambahan di bawah label.
   */
  description?: ReactNode;

  /**
   * Skala ukuran tipografi teks label.
   * @default 'sm'
   */
  labelSize?: TextSize;

  /**
   * Skala ukuran tipografi teks deskripsi.
   * @default 'xs'
   */
  descSize?: TextSize;

  /**
   * ClassName kustom tambahan untuk wadah label.
   */
  className?: string;
}

/**
 * CheckboxLabel Component - Sub-Atom Internal Checkbox
 *
 * Merender label dan deskripsi pendamping checkbox berbasis komponen atom Text terenkapsulasi.
 *
 * @param {ReactNode} [props.label] - Teks label
 * @param {ReactNode} [props.description] - Teks deskripsi
 * @param {TextSize} [props.labelSize='sm'] - Ukuran teks label
 * @param {TextSize} [props.descSize='xs'] - Ukuran teks deskripsi
 * @param {string} [props.className] - Class kustom tambahan
 *
 * @returns {ReactElement | null} Elemen label pendamping atau null jika keduanya kosong
 */
export const CheckboxLabel: FC<CheckboxLabelProps> = ({
  label,
  description,
  labelSize = 'sm',
  descSize = 'xs',
  className = '',
}): ReactElement | null => {
  if (!label && !description) {
    return null;
  }

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const labelWrapperClasses = cn(
    // layout
    'flex flex-col text-left',
    className
  );

  return (
    <span className={labelWrapperClasses}>
      {label && (
        <Text
          as="span"
          size={labelSize}
          weight="medium"
          className="text-foreground transition-colors group-hover:text-foreground"
        >
          {label}
        </Text>
      )}
      {description && (
        <Text as="span" size={descSize} variant="muted">
          {description}
        </Text>
      )}
    </span>
  );
};

export default CheckboxLabel;
