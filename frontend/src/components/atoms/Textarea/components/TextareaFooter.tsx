import type { FC, ReactElement } from 'react';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { TextareaFooterProps } from '../Textarea.types';
import { footerClasses, characterCounterClasses } from '../Textarea.styles';

/**
 * TextareaFooter Component - Sub-Atom Internal Textarea
 *
 * Merender pesan kesalahan validasi (error), deskripsi petunjuk, dan penghitung karakter.
 *
 * @param {TextareaFooterProps} props - Properti komponen TextareaFooter
 * @returns {ReactElement | null} Elemen footer atau null bila tidak ada konten
 */
export const TextareaFooter: FC<TextareaFooterProps> = ({
  error,
  description,
  errorId,
  descId,
  charCount,
  maxLength,
  displayCharacterCount,
  className = '',
}): ReactElement | null => {
  const hasError = Boolean(error);
  const hasDescription = Boolean(description);

  if (!hasError && !hasDescription && !displayCharacterCount) {
    return null;
  }

  const isExceeded = Boolean(maxLength && charCount >= maxLength);

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const errorTextClasses = cn(
    // layout
    'flex items-center gap-1',
    // typography & text
    'text-xs font-medium text-destructive'
  );

  const descriptionTextClasses = cn(
    // size
    'w-full',
    // typography & text
    'text-xs text-muted-foreground'
  );

  return (
    <div className={cn(footerClasses, className)}>
      <div className="flex-1">
        {hasError ? (
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
        ) : hasDescription ? (
          <span id={descId} className={descriptionTextClasses}>
            {typeof description === 'string' ? (
              <Text as="span" size="xs" variant="muted">
                {description}
              </Text>
            ) : (
              description
            )}
          </span>
        ) : null}
      </div>

      {displayCharacterCount && (
        <div className={characterCounterClasses}>
          <Text
            as="span"
            size="xs"
            className={cn('text-2xs', isExceeded ? 'text-destructive font-semibold' : 'text-muted-foreground')}
          >
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </Text>
        </div>
      )}
    </div>
  );
};

export default TextareaFooter;
