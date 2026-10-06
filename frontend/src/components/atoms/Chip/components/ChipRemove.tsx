import type { FC, MouseEvent, ReactElement } from 'react';
import { ClearButton } from '@/components/atoms/ClearButton';
import type { ClearButtonSize } from '@/components/atoms/ClearButton';
import type { ChipRemoveProps, ChipSize } from '../Chip.types';
import { removeIconSizeMap } from '../Chip.styles';

const chipToClearButtonSize: Record<ChipSize, ClearButtonSize> = {
  sm: '2xs',
  md: 'xs',
  lg: 'sm',
};

/**
 * ChipRemove Component - Sub-Atom Internal Chip
 *
 * Tombol hapus ("x") pada chip menggunakan atom ClearButton.
 * Klik tidak diteruskan ke chip induk.
 *
 * @param {() => void} [props.onRemove] - Handler hapus
 * @param {string} [props.label='Hapus'] - Label aksesibilitas
 * @param {ChipSize} [props.size='md'] - Ukuran chip induk
 * @param {boolean} [props.disabled=false] - Menonaktifkan tombol
 *
 * @returns {ReactElement | null} Tombol hapus atau null jika tanpa handler
 */
export const ChipRemove: FC<ChipRemoveProps> = ({
  onRemove,
  label = 'Hapus',
  size = 'md',
  disabled = false,
}): ReactElement | null => {
  if (!onRemove) {
    return null;
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    onRemove();
  };

  return (
    <ClearButton
      size={chipToClearButtonSize[size] || 'xs'}
      iconSize={removeIconSizeMap[size]}
      variant="ghost"
      disabled={disabled}
      onClick={handleClick}
      label={label}
      className="-mr-1.5"
    />
  );
};

export default ChipRemove;
