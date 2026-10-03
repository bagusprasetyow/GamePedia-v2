import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { DotCircleProps } from '../Dot.types';
import {
  sizeClasses,
  variantClasses,
  depthClasses,
  resolveDepthKey,
} from '../Dot.styles';

/**
 * DotCircle Component - Sub-Atom Internal Dot
 *
 * Merender bulatan visual dot dengan dukungan animasi denyut (ping halo & pulse),
 * efek neon ambient glow, border pemisah, dan skala kedalaman Depth System (-3 s/d 3).
 */
export const DotCircle: FC<DotCircleProps> = ({
  size = 'md',
  variant = 'primary',
  depth = 0,
  ping = false,
  pulse = false,
  glow = false,
  bordered = false,
  invisible = false,
  className = '',
}): ReactElement | null => {
  if (invisible) {
    return null;
  }

  const safeSize = sizeClasses[size] ? size : 'md';
  const variantConfig = variantClasses[variant] || variantClasses.primary;
  const depthKey = resolveDepthKey(depth);
  const depthShadow = depthClasses[depthKey] || depthClasses['0'];

  // Class untuk bulatan inti dot (Tailwind Class Composition Standard: Urutan Baku 1-15)
  const coreDotClasses = cn(
    // layout
    'shrink-0',
    // size
    sizeClasses[safeSize],
    // border
    'rounded-full',
    bordered && 'ring-2 ring-background',
    // background
    variantConfig.dot,
    // shadow & depth
    depthShadow,
    glow && variantConfig.glow,
    // interaction
    'select-none',
    // state
    pulse && 'animate-pulse',
    // transition
    'transition-all duration-200',
    className
  );

  if (ping) {
    const pingWrapperClasses = cn(
      // layout
      'inline-flex items-center justify-center shrink-0',
      // position
      'relative',
      // size
      sizeClasses[safeSize]
    );

    const pingWaveClasses = cn(
      // position
      'absolute inset-0',
      // border
      'rounded-full',
      // background
      variantConfig.ping,
      // state & animation
      'animate-ping opacity-75'
    );

    return (
      <span className={pingWrapperClasses}>
        <span className={pingWaveClasses} />
        <span className={cn('relative', coreDotClasses)} />
      </span>
    );
  }

  return <span className={coreDotClasses} />;
};

export default DotCircle;
