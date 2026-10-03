import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';
import type { RadioLabelProps } from '../Radio.types';
import {
  labelWrapperClasses,
  labelTitleClasses,
  labelDescClasses,
} from '../Radio.styles';

/**
 * RadioLabel Component - Sub-Atom Internal Radio
 *
 * Merender label pendamping teks dan deskripsi keterangan menggunakan atom Text.
 */
export const RadioLabel: FC<RadioLabelProps> = ({
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

export default RadioLabel;
