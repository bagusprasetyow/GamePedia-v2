import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';
import type { InputLabelProps } from '../Input.types';
import { labelClasses } from '../Input.styles';

/**
 * InputLabel Component - Sub-Atom Internal Input
 *
 * Merender label deskriptif di atas field input beserta indikator tanda wajib (*).
 */
export const InputLabel: FC<InputLabelProps> = ({
  inputId,
  label,
  required = false,
  className = '',
}): ReactElement => {
  return (
    <label htmlFor={inputId} className={cn(labelClasses, className)}>
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

export default InputLabel;
