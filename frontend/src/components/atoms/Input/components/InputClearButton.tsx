import type { FC, ReactElement } from 'react';
import { ClearButton } from '@/components/atoms/ClearButton';
import type { InputClearButtonProps } from '../Input.types';

/**
 * InputClearButton Component - Sub-Atom Internal Input
 *
 * Merender tombol pembersih teks instan di sisi kanan input memakai atom ClearButton.
 */
export const InputClearButton: FC<InputClearButtonProps> = ({
  size,
  onClick,
  className = '',
}): ReactElement => {
  return (
    <ClearButton
      iconSize={size}
      onClick={onClick}
      className={className}
      label="Bersihkan input"
    />
  );
};

export default InputClearButton;
