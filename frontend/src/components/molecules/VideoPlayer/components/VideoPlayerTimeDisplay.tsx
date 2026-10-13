import type { FC, ReactElement } from 'react';
import { Icon, Text } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { VideoPlayerTimeDisplayProps } from '../VideoPlayer.types';
import { formatTime } from '../VideoPlayer.utils';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Variables
// ─────────────────────────────────────────────────────────────

const timeDisplayClasses = cn(
  // layout
  'flex items-center shrink-0 select-none',
  // spacing
  'px-1',
  // typography
  'font-poppins tabular-nums'
);

const badgeGroupClasses = cn(
  // layout
  'flex items-center gap-2',
  // spacing
  'ml-3'
);

const getBadgeClasses = (isFullscreen: boolean) =>
  cn(
    // layout
    'inline-flex items-center justify-center select-none',
    // size
    isFullscreen ? 'h-6 min-w-6' : 'h-5 min-w-5',
    // spacing
    isFullscreen ? 'px-2' : 'px-1.5',
    // border
    'rounded',
    // background
    'bg-primary',
    // text
    'text-white leading-none',
    // shadow & depth
    'shadow-xs'
  );

const getSpeedTextClasses = (isFullscreen: boolean) =>
  cn(
    // typography
    'leading-none font-poppins tracking-tight',
    // text
    'text-white',
    !isFullscreen && 'text-[11px]'
  );

/**
 * VideoPlayerTimeDisplay Component - Sub-Molecule Internal VideoPlayer
 *
 * Menampilkan waktu putar saat ini, total durasi, serta badge indikator
 * Loop dan Kecepatan (Speed) aktif ala dev/videoPlayer.
 */
export const VideoPlayerTimeDisplay: FC<VideoPlayerTimeDisplayProps> = ({
  currentTime,
  duration,
  isLoop = false,
  playbackRate = 1,
  isFullscreen = false,
}): ReactElement => {
  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: Calculations, Helpers & Handlers
  // ─────────────────────────────────────────────────────────────
  const isCustomSpeed = typeof playbackRate === 'number' && Math.abs(playbackRate - 1) >= 0.001;
  const badgeClasses = getBadgeClasses(isFullscreen);
  const speedTextClasses = getSpeedTextClasses(isFullscreen);

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={timeDisplayClasses}>
      {/* 1. Teks Waktu Saat Ini / Total Durasi */}
      <div className="flex items-center gap-1">
        <Text as="span" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" variant="white">
          {formatTime(currentTime)}
        </Text>
        <Text as="span" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" variant="white">
          /
        </Text>
        <Text as="span" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" variant="white">
          {formatTime(duration)}
        </Text>
      </div>

      {/* 2. Badge Status (Loop & Kecepatan) dengan gap lebih lapang dari teks durasi */}
      {(isLoop || isCustomSpeed) && (
        <div className={badgeGroupClasses}>
          {/* Badge Status Loop Aktif (ala dev/videoPlayer LabelLoop) */}
          {isLoop && (
            <span
              className={badgeClasses}
              aria-label="Loop aktif"
              title="Loop aktif"
            >
              <Icon
                icon="lucide:repeat"
                size={isFullscreen ? 'xs' : '2xs'}
                className="text-white shrink-0"
              />
            </span>
          )}

          {/* Badge Status Kecepatan Aktif selain 1x (ala dev/videoPlayer LabelSpeed) */}
          {isCustomSpeed && (
            <span
              className={badgeClasses}
              aria-label={`Kecepatan ${playbackRate}x`}
              title={`Kecepatan ${playbackRate}x`}
            >
              <Text
                as="span"
                size="xs"
                weight={isFullscreen ? 'normal' : 'medium'}
                variant="white"
                className={speedTextClasses}
              >
                {playbackRate}x
              </Text>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
