import type { FC, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import type { TooltipBubbleProps } from '../Tooltip.types';
import {
  placementClasses,
  arrowPlacementClasses,
  variantClasses,
  sizeClasses,
  depthClasses,
  resolveDepthKey,
} from '../Tooltip.styles';

/**
 * TooltipBubble Component - Sub-Atom Internal Tooltip
 *
 * Merender gelembung petunjuk overlay, panah penunjuk (arrow), ikon pendamping,
 * dan teks konten tooltip dengan dukungan Depth System elevasi (skala -3 s/d 3).
 *
 * @param {TooltipBubbleProps} props - Properti komponen TooltipBubble
 * @returns {ReactElement} Elemen gelembung tooltip interaktif
 */
export const TooltipBubble: FC<TooltipBubbleProps> = ({
  id,
  visible,
  content,
  placement = 'top',
  variant = 'dark',
  size = 'md',
  depth = 3,
  showArrow = true,
  icon,
  iconSize,
  maxWidth = '250px',
  tooltipClassName = '',
  arrowClassName = '',
}): ReactElement => {
  const resolvedDepthKey = resolveDepthKey(depth);
  const safeDepthClass = depthClasses[resolvedDepthKey] || depthClasses['3'];
  const safeVariantConfig = variantClasses[variant] || variantClasses.dark;
  const safeSizeConfig = sizeClasses[size] || sizeClasses.md;

  // Tailwind Class Composition Standard: Urutan Baku Kategori (1-15)
  const bubbleClasses = cn(
    // layout
    'flex items-center',
    // position
    'absolute z-50',
    placementClasses[placement] || placementClasses.top,
    // size
    'w-max',
    // border
    'border',
    // background & variant
    safeVariantConfig.bubble,
    // size presets (padding, rounded, gap)
    safeSizeConfig.bubble,
    // shadow & depth
    safeDepthClass,
    // interaction
    'pointer-events-none',
    // state
    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    // transition
    'transition-all duration-200 ease-in-out',
    tooltipClassName
  );

  const arrowClasses = cn(
    // position
    'absolute z-10',
    arrowPlacementClasses[placement] || arrowPlacementClasses.top,
    // size
    'h-2.5 w-2.5',
    // background & border
    safeVariantConfig.arrow,
    // transform
    'rotate-45',
    arrowClassName
  );

  const styleMaxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  const renderIcon = (): ReactNode => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      return (
        <Icon
          icon={icon}
          size={iconSize || safeSizeConfig.iconSizePreset}
          variant="inherit"
          className="shrink-0"
        />
      );
    }
    return <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>;
  };

  const renderContent = (): ReactNode => {
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text
          as="span"
          size={safeSizeConfig.textSize}
          weight="medium"
          leading="tight"
          className="whitespace-normal wrap-break-word text-inherit"
        >
          {content}
        </Text>
      );
    }
    return content;
  };

  return (
    <div
      id={id}
      role="tooltip"
      aria-hidden={!visible}
      style={{ maxWidth: styleMaxWidth }}
      className={bubbleClasses}
    >
      {renderIcon()}
      {renderContent()}
      {showArrow && <div className={arrowClasses} aria-hidden="true" />}
    </div>
  );
};

export default TooltipBubble;
