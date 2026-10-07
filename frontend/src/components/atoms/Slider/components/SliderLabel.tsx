import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { SliderLabelProps } from '../Slider.types';
import { labelContainerClasses } from '../Slider.styles';

/**
 * SliderLabel Component - Sub-Atom Internal Slider
 *
 * Merender label deskriptif di atas komponen Slider dengan indikator required
 * serta nilai saat ini jika dikonfigurasi pada posisi atas ('top').
 */
export const SliderLabel: FC<SliderLabelProps> = ({
  label,
  required = false,
  htmlFor,
  id,
  showValue = false,
  formattedValue,
  className = '',
}): ReactElement | null => {
  if (!label && (!showValue || formattedValue === undefined)) {
    return null;
  }

  const labelClasses = cn(
    // layout
    'flex items-center gap-1',
    // text
    'text-foreground',
    // interaction
    'cursor-pointer'
  );

  const valueDisplayClasses = cn(
    // layout
    'ml-auto',
    // typography
    'font-mono'
  );

  return (
    <div className={cn(labelContainerClasses, className)}>
      {label && (
        <Text
          as="label"
          id={id}
          htmlFor={htmlFor}
          size="xs"
          weight="semibold"
          className={labelClasses}
        >
          {label}
          {required && (
            <Text
              as="span"
              variant="error"
              weight="bold"
              className="select-none"
              aria-hidden="true"
            >
              *
            </Text>
          )}
        </Text>
      )}

      {showValue && formattedValue !== undefined && (
        <Text
          as="span"
          size="xs"
          variant="muted"
          weight="medium"
          className={valueDisplayClasses}
        >
          {formattedValue}
        </Text>
      )}
    </div>
  );
};

export default SliderLabel;
