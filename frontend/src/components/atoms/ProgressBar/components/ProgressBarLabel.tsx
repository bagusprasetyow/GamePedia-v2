import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { ProgressBarLabelProps } from '../ProgressBar.types';
import { labelContainerClasses, sizeStyles } from '../ProgressBar.styles';

/**
 * ProgressBarLabel Component - Sub-Atom Internal ProgressBar
 *
 * Menampilkan label deskriptif di bagian atas trek beserta teks tampilan nilai (persentase)
 * di sisi kanan jika diaktifkan melalui opsi `showValue`.
 */
export const ProgressBarLabel: FC<ProgressBarLabelProps> = ({
  id,
  label,
  showValue = false,
  formattedValue,
  size,
  className = '',
}): ReactElement | null => {
  const hasLabel = Boolean(label);
  const hasValue = showValue && formattedValue !== undefined && formattedValue !== null;

  if (!hasLabel && !hasValue) {
    return null;
  }

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const containerClasses = cn(
    // layout & base
    labelContainerClasses,
    className
  );

  const labelTextClasses = cn(
    // typography
    currentSize.labelText,
    // text
    'text-foreground',
    // interaction
    'select-none'
  );

  const valueTextClasses = cn(
    // layout
    'ml-auto',
    // typography
    'font-mono',
    currentSize.valueText,
    // interaction
    'select-none'
  );

  return (
    <div className={containerClasses}>
      {hasLabel && (
        <Text
          as="span"
          id={id}
          weight="semibold"
          className={labelTextClasses}
        >
          {label}
        </Text>
      )}

      {hasValue && (
        <Text
          as="span"
          weight="medium"
          variant="muted"
          className={valueTextClasses}
        >
          {formattedValue}
        </Text>
      )}
    </div>
  );
};

export default ProgressBarLabel;
