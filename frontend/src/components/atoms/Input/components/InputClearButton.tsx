import type { FC, ReactElement } from 'react';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import type { InputClearButtonProps } from '../Input.types';
import { clearButtonClasses } from '../Input.styles';

/**
 * InputClearButton Component - Sub-Atom Internal Input
 *
 * Merender tombol pembersih teks instan di sisi kanan input.
 */
export const InputClearButton: FC<InputClearButtonProps> = ({
  size,
  onClick,
  className = '',
}): ReactElement => {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      className={cn(clearButtonClasses, className)}
      aria-label="Bersihkan input"
    >
      <Icon icon="mdi:close" size={size} />
    </button>
  );
};

export default InputClearButton;
