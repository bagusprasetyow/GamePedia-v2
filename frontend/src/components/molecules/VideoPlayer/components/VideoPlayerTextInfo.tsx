import type { FC, ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { VideoPlayerTextInfoProps } from '../VideoPlayer.types';

/**
 * VideoPlayerTextInfo Component - Sub-Molecule Internal VideoPlayer
 *
 * Menampilkan HUD overlay umpan balik teks interaktif di pojok kiri atas player
 * seperti status pemutaran ('Memutar', 'Dijeda'), volume ('Volume: 30%'),
 * serta penelusuran waktu ('Maju 5s [ 01:09 (56.5%) ]').
 */
export const VideoPlayerTextInfo: FC<VideoPlayerTextInfoProps> = ({
  message = '',
  subMessage = '',
  visible = false,
  isFullscreen = false,
}): ReactElement | null => {
  if (!message && !subMessage) {
    return null;
  }

  const textSize = isFullscreen ? 'sm' : 'xs';

  const containerClasses = cn(
    // position
    'absolute z-30 pointer-events-none select-none',
    isFullscreen ? 'top-4 left-4' : 'top-3 left-3',
    // animation & transitions
    'transition-all duration-200 ease-out',
    visible
      ? 'opacity-100 translate-y-0 scale-100'
      : 'opacity-0 -translate-y-1.5 scale-95 pointer-events-none'
  );

  const badgeClasses = cn(
    // layout
    'flex items-center gap-1.5',
    // size & spacing
    isFullscreen ? 'px-3.5 py-2' : 'px-3 py-1.5',
    // border & background
    'rounded-lg bg-black/80 backdrop-blur-md border border-white/15',
    // shadow & depth
    'shadow-2 leading-none'
  );

  return (
    <div className={containerClasses} aria-live="polite" aria-atomic="true">
      <div className={badgeClasses}>
        {message && (
          <Text
            as="span"
            size={textSize}
            weight="medium"
            variant="white"
            className="text-white/90 font-poppins leading-none"
          >
            {message}
          </Text>
        )}

        {subMessage && (
          <Text
            as="span"
            size={textSize}
            weight="bold"
            variant="white"
            className="text-white font-poppins font-bold leading-none"
          >
            {subMessage}
          </Text>
        )}
      </div>
    </div>
  );
};
