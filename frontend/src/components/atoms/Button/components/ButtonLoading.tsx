import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { ButtonLoadingProps } from '../Button.types';

/**
 * ButtonLoading Component - Sub-Atom Internal Button
 *
 * Merender indikator status pemuatan (spinner loading berputar) bersama teks opsional
 * menggunakan komponen atom Icon dan Text yang terenkapsulasi secara modular.
 *
 * @param {string} [props.loadingText] - Pesan teks pemuatan
 * @param {IconSize | number | string} [props.iconSize='sm'] - Ukuran ikon spinner
 * @param {TextSize} [props.textSize='sm'] - Ukuran tipografi teks pemuatan
 * @param {string} [props.className] - Class kustom tambahan untuk kontainer pemuatan
 *
 * @returns {ReactElement} Elemen indikator loading untuk tombol
 */
export const ButtonLoading: FC<ButtonLoadingProps> = ({
  loadingText,
  iconSize = 'sm',
  textSize = 'sm',
  className = '',
}): ReactElement => {
  const containerClasses = cn(
    // layout
    'inline-flex items-center justify-center shrink-0',
    loadingText && 'gap-2',
    className
  );

  return (
    <span className={containerClasses} aria-hidden="true">
      <Icon icon="mdi:loading" size={iconSize} spin />
      {loadingText && (
        <Text as="span" size={textSize} weight="medium" variant="inherit" className="truncate">
          {loadingText}
        </Text>
      )}
    </span>
  );
};

export default ButtonLoading;
