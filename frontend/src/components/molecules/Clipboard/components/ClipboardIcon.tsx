import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms';
import type { ClipboardIconProps } from '../Clipboard.types';
import { getIconClasses } from '../Clipboard.styles';

/**
 * ClipboardIcon Component - Sub-Molecule Internal Clipboard
 *
 * Merender ikon status dinamis untuk Clipboard (idle vs copied)
 * dengan transisi warna responsif (hover, active, dan status copied).
 */
export const ClipboardIcon: FC<ClipboardIconProps> = ({
  copied,
  variant = 'terminal',
  size = 'xs',
  icon = 'mdi:content-copy',
  copiedIcon = 'mdi:check',
  className = '',
}): ReactElement | null => {
  const activeIcon = copied ? copiedIcon : icon;
  if (!activeIcon) return null;

  if (typeof activeIcon !== 'string') {
    return <>{activeIcon}</>;
  }

  const iconClasses = getIconClasses(copied, variant);

  return (
    <Icon
      icon={activeIcon}
      size={size}
      className={cn(iconClasses, className)}
    />
  );
};

export default ClipboardIcon;
