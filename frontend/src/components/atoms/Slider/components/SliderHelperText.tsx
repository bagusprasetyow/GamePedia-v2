import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import type { SliderHelperTextProps } from '../Slider.types';
import { helperTextContainerClasses } from '../Slider.styles';

/**
 * SliderHelperText Component - Sub-Atom Internal Slider
 *
 * Merender pesan kesalahan validasi (*error message*) atau teks panduan bantuan (*description*)
 * dengan dukungan posisi absolute maupun relative dan atribut a11y terkait.
 */
export const SliderHelperText: FC<SliderHelperTextProps> = ({
  error,
  description,
  errorId,
  descId,
  errorPosition = 'absolute',
}): ReactElement | null => {
  const hasError = Boolean(error);
  const hasDescription = Boolean(description);

  if (!hasError && !hasDescription) {
    return null;
  }

  const containerClasses = cn(
    // layout & base
    helperTextContainerClasses,
    // position & size
    errorPosition === 'absolute' && 'absolute left-0 top-full mt-1 w-full'
  );

  const errorTextClasses = cn(
    // transition & animation
    'animate-in fade-in slide-in-from-top-1 duration-150'
  );

  return (
    <div className={containerClasses}>
      {hasError ? (
        <Text
          as="span"
          id={errorId}
          role="alert"
          size="xs"
          weight="medium"
          variant="error"
          className={errorTextClasses}
        >
          {error}
        </Text>
      ) : hasDescription ? (
        <Text as="span" id={descId} size="xs" variant="muted">
          {description}
        </Text>
      ) : null}
    </div>
  );
};

export default SliderHelperText;
