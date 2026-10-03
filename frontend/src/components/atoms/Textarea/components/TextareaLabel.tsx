import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';
import type { TextareaLabelProps } from '../Textarea.types';
import { labelClasses } from '../Textarea.styles';

/**
 * TextareaLabel Component - Sub-Atom Internal Textarea
 *
 * Merender label judul di atas textarea beserta indikator tanda wajib (*).
 *
 * @param {TextareaLabelProps} props - Properti komponen TextareaLabel
 * @returns {ReactElement | null} Elemen label teks atau null
 */
export const TextareaLabel: FC<TextareaLabelProps> = ({
  textareaId,
  label,
  required = false,
  className = '',
}): ReactElement | null => {
  if (!label) {
    return null;
  }

  return (
    <label htmlFor={textareaId} className={cn(labelClasses, className)}>
      {typeof label === 'string' ? (
        <Text as="span" size="xs" weight="semibold" className="text-foreground">
          {label}
        </Text>
      ) : (
        label
      )}
      {required && (
        <Text as="span" variant="error" weight="bold" aria-hidden="true">
          *
        </Text>
      )}
    </label>
  );
};

export default TextareaLabel;
