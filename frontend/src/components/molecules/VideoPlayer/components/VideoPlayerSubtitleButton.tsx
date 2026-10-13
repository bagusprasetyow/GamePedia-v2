import type { FC, ReactElement, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Tooltip } from '@/components/atoms';
import { videoPlayerTooltipClasses } from '../VideoPlayer.styles';
import type { VideoPlayerSubtitleProps } from '../VideoPlayer.types';

/**
 * VideoPlayerSubtitleButton Component - Sub-Molecule Internal VideoPlayer
 *
 * Ikon pengatur trek teks terjemahan / subtitle (Closed Captions) dengan indikator garis biru
 * saat aktif dan toggle langsung, persis seperti kontrol YouTube / Genshin Player.
 */
export const VideoPlayerSubtitleButton: FC<VideoPlayerSubtitleProps> = ({
  tracks,
  currentSubtitle,
  disabledTooltip = false,
  onChange,
  isFullscreen = false,
}): ReactElement | null => {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  const isActive = currentSubtitle !== 'off';

  const handleToggle = () => {
    if (isActive) {
      onChange('off');
    } else {
      const defaultTrack = tracks.find((t) => t.default) || tracks[0];
      const targetLang = defaultTrack ? defaultTrack.srcLang || defaultTrack.label : 'off';
      onChange(targetLang);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const iconClasses = cn(
    // layout
    'flex items-center justify-center',
    // size
    isFullscreen ? 'w-6 h-6' : 'w-4.5 h-4.5',
    // text & color
    isActive ? 'text-white' : 'text-white/80 hover:text-white',
    // interaction
    'cursor-pointer select-none',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded-xs',
    // transition
    'transition-colors duration-150'
  );

  const currentTrack = tracks.find(
    (t) => t.srcLang === currentSubtitle || t.label === currentSubtitle
  );
  const activeLabel = currentTrack ? currentTrack.label : currentSubtitle;
  const tooltipContent = isActive ? `Subtitle: ${activeLabel}` : 'Aktifkan Subtitle (C)';

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <Tooltip
        content={tooltipContent}
        placement="top"
        size="xs"
        showArrow={false}
        closeOnClick={false}
        disabled={disabledTooltip}
        tooltipClassName={videoPlayerTooltipClasses(isFullscreen)}
      >
        <Icon
          icon={isActive ? 'bi:cc-square-fill' : 'bi:cc-square'}
          size={isFullscreen ? 'sm' : 'xs'}
          aria-label={isActive ? 'Nonaktifkan Subtitle' : 'Aktifkan Subtitle'}
          role="button"
          tabIndex={0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={iconClasses}
        />
      </Tooltip>
    </div>
  );
};

