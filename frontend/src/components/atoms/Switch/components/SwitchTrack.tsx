import type { FC, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import type { IconSize } from '@/components/atoms/Icon/Icon.types';
import type { SwitchTrackProps } from '../Switch.types';
import {
  sizeConfigMap,
  variantClasses,
  depthClasses,
  resolveDepthKey,
  trackInactiveClasses,
} from '../Switch.styles';

/**
 * Helper murni di level modul untuk merender ikon thumb sakelar.
 *
 * @param {ReactNode} iconNode - Node atau identifier nama ikon
 * @param {IconSize} iconSize - Skala ukuran ikon yang bersesuaian dengan ukuran switch
 * @returns {ReactNode} Elemen ikon atom atau node asli
 */
const renderThumbIcon = (iconNode: ReactNode, iconSize: IconSize): ReactNode => {
  if (typeof iconNode === 'string') {
    return <Icon icon={iconNode} size={iconSize} />;
  }
  return iconNode;
};

/**
 * SwitchTrack Component - Sub-Atom Internal Switch
 *
 * Merender trek visual sakelar dan knop thumb taktil dengan dukungan Depth System alur cekung (-3 s/d 3),
 * varian warna semantik saat aktif, transisi animasi halus, dan rendering ikon terintegrasi.
 *
 * @param {SwitchTrackProps} props - Properti komponen SwitchTrack
 * @returns {ReactElement} Elemen trek sakelar interaktif beserta knop thumb
 */
export const SwitchTrack: FC<SwitchTrackProps> = ({
  isChecked,
  disabled = false,
  size = 'md',
  variant = 'primary',
  depth = -1,
  thumbCheckedIcon,
  thumbUncheckedIcon,
  onKeyDown,
  className = '',
}): ReactElement => {
  const sizeConfig = sizeConfigMap[size] || sizeConfigMap.md;
  const safeVariantClass = variantClasses[variant] || variantClasses.primary;
  const depthKey = resolveDepthKey(depth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['-1'];

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const trackClasses = cn(
    // layout
    'inline-flex shrink-0 items-center',
    // position
    'relative',
    // size
    sizeConfig.track,
    // border
    'rounded-full border',
    // background & variant
    isChecked ? safeVariantClass : trackInactiveClasses,
    // shadow & depth
    resolvedDepthClass,
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    // transition
    'transition-all duration-300 ease-in-out',
    className
  );

  const thumbClasses = cn(
    // layout
    'pointer-events-none flex items-center justify-center',
    // size
    sizeConfig.thumb,
    // border
    'rounded-full',
    // background
    'bg-neutral-50',
    // text
    'text-neutral-900',
    // shadow & depth
    'shadow-1',
    // transition
    'transition-all duration-300 ease-out',
    // position & state
    isChecked ? sizeConfig.translate : 'translate-x-0',
    // dark mode
    'dark:bg-neutral-100'
  );

  const thumbIconWrapperClasses = cn(
    // layout
    'inline-flex items-center justify-center',
    // transition
    'transition-transform duration-300 ease-out'
  );

  return (
    <span
      role="switch"
      aria-checked={isChecked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      className={trackClasses}
    >
      <span className={thumbClasses}>
        <span className={thumbIconWrapperClasses}>
          {isChecked && thumbCheckedIcon && renderThumbIcon(thumbCheckedIcon, sizeConfig.iconSize)}
          {!isChecked && thumbUncheckedIcon && renderThumbIcon(thumbUncheckedIcon, sizeConfig.iconSize)}
        </span>
      </span>
    </span>
  );
};

export default SwitchTrack;
