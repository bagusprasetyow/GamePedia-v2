import type { FC, ReactElement } from 'react';
import { Icon } from '@/components/atoms/Icon';
import type { BadgeIconProps } from '../Badge.types';

/**
 * BadgeIcon Component - Sub-Atom Internal Badge
 *
 * Merender ikon badge, mendukung nama string Iconify maupun custom ReactNode.
 *
 * @param {ReactNode} [props.icon] - Elemen ikon atau nama string Iconify
 * @param {IconSize | number | string} [props.size] - Ukuran fisik ikon
 * @param {string} [props.className] - Class kustom tambahan untuk ikon
 *
 * @returns {ReactElement | null} Elemen ikon atau null
 */
export const BadgeIcon: FC<BadgeIconProps> = ({
  icon,
  size,
  className = '',
}): ReactElement | null => {
  if (!icon) {
    return null;
  }

  if (typeof icon === 'string') {
    return <Icon icon={icon} size={size} className={className} />;
  }

  return <>{icon}</>;
};

export default BadgeIcon;
