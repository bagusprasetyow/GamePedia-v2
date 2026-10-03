import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '../Text';
import { Icon } from '../Icon';
import type {
  TooltipPlacement,
  TooltipVariant,
  TooltipSize,
  TooltipDepth,
} from './Tooltip.types';
import {
  placementClasses,
  arrowPlacementClasses,
  variantClasses,
  sizeClasses,
  depthClasses,
  resolveDepthKey,
} from './Tooltip.styles';

export interface TooltipBubbleProps {
  id: string;
  visible: boolean;
  content: ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  size?: TooltipSize;
  depth?: TooltipDepth;
  showArrow?: boolean;
  icon?: ReactNode;
  iconSize?: number | string;
  maxWidth?: string | number;
  tooltipClassName?: string;
  arrowClassName?: string;
}

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
}) => {
  const resolvedDepthKey = resolveDepthKey(depth);
  const safeDepthClass = depthClasses[resolvedDepthKey] || depthClasses['3'];
  const safeVariantConfig = variantClasses[variant] || variantClasses.dark;
  const safeSizeConfig = sizeClasses[size] || sizeClasses.md;

  const bubbleClasses = cn(
    // layout
    'flex items-center',
    // position
    'absolute z-50',
    // position placement offset
    placementClasses[placement] || placementClasses.top,
    // size
    'w-max',
    // border
    'border',
    // variant colors
    safeVariantConfig.bubble,
    // size presets (padding, rounded, gap)
    safeSizeConfig.bubble,
    // shadow & depth
    safeDepthClass,
    // state & transition
    'pointer-events-none transition-all duration-200 ease-in-out',
    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    // custom overrides
    tooltipClassName
  );

  const arrowClasses = cn(
    // position
    'absolute z-10',
    // position placement offset
    arrowPlacementClasses[placement] || arrowPlacementClasses.top,
    // size & transform
    'h-2.5 w-2.5 rotate-45',
    // variant colors
    safeVariantConfig.arrow,
    // custom overrides
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
          className={cn(
            // typography
            'whitespace-normal wrap-break-word text-inherit'
          )}
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
