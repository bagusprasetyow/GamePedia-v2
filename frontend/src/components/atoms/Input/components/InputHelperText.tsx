import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { InputHelperTextProps } from '../Input.types';

/**
 * InputHelperText Component - Sub-Atom Internal Input
 *
 * Merender pesan kesalahan validasi (error) atau teks keterangan (description)
 * dengan dukungan posisi absolute maupun relative.
 */
export const InputHelperText: FC<InputHelperTextProps> = ({
  error,
  description,
  errorId,
  descId,
  errorPosition = 'absolute',
}): ReactElement | null => {
  if (error) {
    const errorTextClasses = cn(
      // layout
      'flex items-center gap-1',
      // position
      errorPosition === 'absolute'
        ? 'absolute left-0 right-0 top-full mt-1 z-10 animate-in fade-in slide-in-from-top-1 duration-150'
        : 'mt-0',
      // typography & text
      'text-xs font-medium text-destructive'
    );

    return (
      <span id={errorId} role="alert" className={errorTextClasses}>
        <Icon icon="mdi:alert-circle" size="2xs" className="shrink-0 text-destructive" />
        {typeof error === 'string' ? (
          <Text as="span" size="xs" variant="error" className="truncate">
            {error}
          </Text>
        ) : (
          <span className="truncate">{error}</span>
        )}
      </span>
    );
  }

  if (description) {
    const descriptionTextClasses = cn(
      // position
      errorPosition === 'absolute'
        ? 'absolute left-0 right-0 top-full mt-1 z-10'
        : 'mt-0',
      // size
      'w-full',
      // typography & text
      'text-xs text-muted-foreground'
    );

    return (
      <span id={descId} className={descriptionTextClasses}>
        {typeof description === 'string' ? (
          <Text as="span" size="xs" variant="muted">
            {description}
          </Text>
        ) : (
          description
        )}
      </span>
    );
  }

  return null;
};

export default InputHelperText;
