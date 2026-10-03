import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/Icon';
import type { RadioIndicatorProps } from '../Radio.types';
import {
  sizeConfigMap,
  colorStyleMap,
  depthClasses,
  resolveDepthKey,
} from '../Radio.styles';

/**
 * RadioIndicator Component - Sub-Atom Internal Radio
 *
 * Merender elemen visual lingkaran radio dengan dukungan varian dot solid
 * atau checklist centang, skala Depth System (-3 s/d 3), dan palet warna semantik.
 */
export const RadioIndicator: FC<RadioIndicatorProps> = ({
  size = 'md',
  color = 'primary',
  variant = 'solid',
  depth = -1,
  isChecked = false,
  disabled = false,
  onKeyDown,
  className = '',
}): ReactElement => {
  const sizeConfig = sizeConfigMap[size] || sizeConfigMap.md;
  const colorStyle = colorStyleMap[color] || colorStyleMap.primary;
  const depthKey = resolveDepthKey(depth);
  const resolvedDepthClass = depthClasses[depthKey] || depthClasses['-1'];

  const circleClasses = cn(
    // layout
    'inline-flex shrink-0 items-center justify-center',
    // position
    'relative',
    // size
    sizeConfig.circle,
    // border
    'rounded-full',
    // shadow & depth
    resolvedDepthClass,
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    colorStyle.ring,
    // state & colors
    variant === 'solid'
      ? cn(
          'bg-background',
          colorStyle.border,
          'transition-colors duration-150'
        )
      : isChecked
        ? cn(colorStyle.checkBg, colorStyle.checkBorder, colorStyle.checkText)
        : cn(
            'bg-background/80 transition-colors duration-150',
            color === 'error'
              ? colorStyle.border
              : 'border-neutral-500/70 dark:border-neutral-400/60 hover:border-primary text-transparent'
          ),
    // transition
    'transition-all duration-200 ease-out',
    className
  );

  const solidDotClasses = cn(
    // size
    sizeConfig.solidDot,
    // border
    'rounded-full',
    // background
    colorStyle.dot,
    // state & animation
    'scale-100 animate-in zoom-in-50',
    // transition
    'transition-transform duration-200 ease-out'
  );

  return (
    <span
      role="radio"
      aria-checked={isChecked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      className={circleClasses}
    >
      {isChecked ? (
        variant === 'solid' ? (
          <span className={solidDotClasses} />
        ) : (
          <Icon
            icon="mdi:check"
            size={sizeConfig.iconSize}
            className="text-current stroke-current animate-in zoom-in-50 duration-150"
          />
        )
      ) : null}
    </span>
  );
};

export default RadioIndicator;
