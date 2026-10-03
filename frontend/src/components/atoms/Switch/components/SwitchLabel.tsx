import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';
import type { SwitchLabelProps } from '../Switch.types';
import {
  labelWrapperClasses,
  labelTitleClasses,
  labelDescClasses,
} from '../Switch.styles';

/**
 * SwitchLabel Component - Sub-Atom Internal Switch
 *
 * Merender teks judul label dan deskripsi keterangan sakelar menggunakan atom Text.
 *
 * @param {SwitchLabelProps} props - Properti komponen SwitchLabel
 * @returns {ReactElement | null} Elemen label teks atau null bila tidak ada konten
 */
export const SwitchLabel: FC<SwitchLabelProps> = ({
  label,
  description,
  className = '',
}): ReactElement | null => {
  if (!label && !description) {
    return null;
  }

  return (
    <span className={cn(labelWrapperClasses, className)}>
      {label && (
        <span className={labelTitleClasses}>
          {typeof label === 'string' ? (
            <Text as="span" size="sm" weight="medium" className="text-foreground">
              {label}
            </Text>
          ) : (
            label
          )}
        </span>
      )}
      {description && (
        <span className={labelDescClasses}>
          {typeof description === 'string' ? (
            <Text as="span" size="xs" variant="muted">
              {description}
            </Text>
          ) : (
            description
          )}
        </span>
      )}
    </span>
  );
};

export default SwitchLabel;
