import type { FC, ReactElement, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Tooltip } from '@/components/atoms';
import { videoPlayerTooltipClasses } from '../VideoPlayer.styles';
import type { VideoPlayerSkipButtonProps } from '../VideoPlayer.types';

/**
 * VideoPlayerSkipButton Component - Sub-Molecule Internal VideoPlayer
 *
 * Tombol navigasi taktil lompat mundur / maju 5 detik dengan ikon melingkar
 * dan gelembung Tooltip aksesibel.
 */
export const VideoPlayerSkipButton: FC<VideoPlayerSkipButtonProps> = ({
  direction,
  seconds = 5,
  disabledTooltip = false,
  onClick,
  isFullscreen = false,
}): ReactElement => {
  const isBackward = direction === 'backward';
  const icon = isBackward ? 'material-symbols:replay-5' : 'material-symbols:forward-5';
  const label = isBackward
    ? `Mundur ${seconds}s`
    : `Maju ${seconds}s`;

  const iconClasses = cn(
    // layout
    'flex items-center justify-center',
    // size
    isFullscreen ? 'w-7 h-7' : 'w-5 h-5',
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
      onClick();
    }
  };

  return (
    <div className="flex items-center justify-center shrink-0">
      <Tooltip
        content={label}
        placement="top"
        size="xs"
        showArrow={false}
        closeOnClick={false}
        disabled={disabledTooltip}
        tooltipClassName={videoPlayerTooltipClasses(isFullscreen)}
      >
        <Icon
          icon={icon}
          size={isFullscreen ? 'md' : 'xs'}
          aria-label={label}
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className={iconClasses}
        />
      </Tooltip>
    </div>
  );
};
