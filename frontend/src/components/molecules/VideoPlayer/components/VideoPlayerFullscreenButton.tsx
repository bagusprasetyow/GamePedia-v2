import type { FC, ReactElement, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Tooltip } from '@/components/atoms';
import { videoPlayerTooltipClasses } from '../VideoPlayer.styles';
import type { VideoPlayerFullscreenProps } from '../VideoPlayer.types';

/**
 * VideoPlayerFullscreenButton Component - Sub-Molecule Internal VideoPlayer
 *
 * Ikon beralih mode Layar Penuh (Fullscreen) dengan gelembung Tooltip.
 */
export const VideoPlayerFullscreenButton: FC<VideoPlayerFullscreenProps> = ({
  isFullscreen,
  showFullscreen = true,
  disabledTooltip = false,
  onToggleFullscreen,
}): ReactElement | null => {
  if (!showFullscreen) {
    return null;
  }

  const fullscreenLabel = isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)';

  const iconClasses = cn(
    // layout
    'flex items-center justify-center',
    // size
    isFullscreen ? 'w-6 h-6' : 'w-4.5 h-4.5',
    // text & color
    'text-white/80 hover:text-white',
    // interaction
    'cursor-pointer select-none',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded-xs',
    // transition
    'transition-colors duration-150'
  );

  const handleKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleFullscreen?.();
    }
  };

  return (
    <div className="flex items-center justify-center shrink-0">
      {/* Ikon Layar Penuh (Fullscreen) */}
      <Tooltip
        content={fullscreenLabel}
        placement="top-end"
        size="xs"
        showArrow={false}
        closeOnClick={false}
        disabled={disabledTooltip}
        tooltipClassName={videoPlayerTooltipClasses(isFullscreen)}
      >
        <Icon
          icon={isFullscreen ? 'lucide:minimize' : 'lucide:maximize'}
          size={isFullscreen ? 'sm' : 'xs'}
          aria-label={fullscreenLabel}
          role="button"
          tabIndex={0}
          onClick={onToggleFullscreen}
          onKeyDown={handleKeyDown}
          className={iconClasses}
        />
      </Tooltip>
    </div>
  );
};

