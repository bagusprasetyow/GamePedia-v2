import { useState, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { VideoPlayerControlsProps } from '../VideoPlayer.types';
import { VideoPlayerTimeline } from './VideoPlayerTimeline';
import { VideoPlayerPlayButton } from './VideoPlayerPlayButton';
import { VideoPlayerSkipButton } from './VideoPlayerSkipButton';
import { VideoPlayerVolume } from './VideoPlayerVolume';
import { VideoPlayerTimeDisplay } from './VideoPlayerTimeDisplay';
import { VideoPlayerSubtitleButton } from './VideoPlayerSubtitleButton';
import { VideoPlayerSettingsMenu } from './VideoPlayerSettingsMenu';
import { VideoPlayerFullscreenButton } from './VideoPlayerFullscreenButton';

/**
 * VideoPlayerControls Component - Sub-Molecule Internal VideoPlayer
 *
 * Bilah kendali antarmuka video bagian bawah (Control Bar) dengan transisi auto-hide cerdas.
 */
export const VideoPlayerControls: FC<VideoPlayerControlsProps> = ({
  isVisible,
  isPlaying,
  isEnded: isEndedProp,
  currentTime,
  duration,
  bufferedPercent,
  volume,
  isMuted,
  playbackRate,
  playbackRates,
  isFullscreen,
  isPiP,
  showPiP = false,
  showFullscreen,
  showVolume,
  showTime,
  showSubtitles = true,
  tracks = [],
  currentSubtitle = 'off',
  qualities = [],
  currentQuality = -1,
  isLoop = false,
  onToggleLoop,
  scrubbingVtt,
  isSettingsOpen: controlledIsSettingsOpen,
  onSettingsOpenChange,
  settingsSubMenu,
  onSettingsSubMenuChange,
  onTogglePlay,
  onSeek,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onPlaybackRateChange,
  onToggleFullscreen,
  onTogglePiP,
  onSubtitleChange,
  onQualityChange,
}): ReactElement => {
  const [internalIsSettingsOpen, setInternalIsSettingsOpen] = useState<boolean>(false);
  const isSettingsOpen =
    controlledIsSettingsOpen !== undefined ? controlledIsSettingsOpen : internalIsSettingsOpen;

  const handleSettingsOpenChange = (open: boolean) => {
    if (controlledIsSettingsOpen === undefined) {
      setInternalIsSettingsOpen(open);
    }
    onSettingsOpenChange?.(open);
  };

  const isEnded = isEndedProp ?? (duration > 0 && currentTime >= duration);

  const controlsClasses = cn(
    // layout
    'flex flex-col gap-2 pointer-events-auto',
    // position
    'absolute inset-x-0 bottom-0 z-40',
    // spacing
    isFullscreen ? 'px-6 pb-4' : 'px-3 pb-3',
    // background
    'bg-linear-to-t from-black/55 via-black/30 to-transparent',
    // state
    (isVisible || isSettingsOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none',
    // transition
    'transition-opacity duration-300'
  );

  const actionsBarClasses = cn(
    // layout
    'flex items-center justify-between',
    // position
    'relative',
    // spacing
    isFullscreen ? 'gap-6' : 'gap-4'
  );

  const leftSectionClasses = cn(
    // layout
    'flex items-center',
    // spacing
    isFullscreen ? 'gap-5' : 'gap-4'
  );

  const centerSectionClasses = cn(
    // layout
    'flex items-center',
    // position
    'absolute left-1/2 -translate-x-1/2',
    // spacing
    isFullscreen ? 'gap-5' : 'gap-3'
  );

  const rightSectionClasses = cn(
    // layout
    'flex items-center',
    // spacing
    isFullscreen ? 'gap-4' : 'gap-3'
  );

  const timelineRowClasses = cn(
    // layout
    'flex items-center',
    // size
    'w-full',
    // spacing
    isFullscreen ? 'gap-4' : 'gap-3.5'
  );

  return (
    <div className={controlsClasses}>
      {/* 1. Baris Atas: Ikon Volume & Timeline Scrubber Sejajar */}
      <div className={timelineRowClasses}>
        {showVolume && (
          <VideoPlayerVolume
            volume={volume}
            isMuted={isMuted}
            disabledTooltip={isSettingsOpen}
            onChange={onVolumeChange}
            onToggleMute={onToggleMute}
            isFullscreen={isFullscreen}
          />
        )}

        <div className="flex-1 min-w-0">
          <VideoPlayerTimeline
            currentTime={currentTime}
            duration={duration}
            bufferedPercent={bufferedPercent}
            scrubbingVtt={scrubbingVtt}
            disablePreview={isSettingsOpen}
            onSeek={onSeek}
            isFullscreen={isFullscreen}
            isPlaying={isPlaying}
          />
        </div>
      </div>

      {/* 2. Baris Tombol Aksi Kontrol Bawah */}
      <div className={actionsBarClasses}>
        {/* Sisi Kiri: Durasi Waktu */}
        <div className={leftSectionClasses}>
          {showTime && (
            <VideoPlayerTimeDisplay
              currentTime={currentTime}
              duration={duration}
              isLoop={isLoop}
              playbackRate={playbackRate}
              isFullscreen={isFullscreen}
            />
          )}
        </div>

        {/* Sisi Tengah: [Mundur 5s] [Play/Pause] [Maju 5s] */}
        <div className={centerSectionClasses}>
          <VideoPlayerSkipButton
            direction="backward"
            seconds={5}
            disabledTooltip={isSettingsOpen}
            onClick={() => (onSkip ? onSkip(-5) : onSeek(Math.max(0, currentTime - 5)))}
            isFullscreen={isFullscreen}
          />

          <VideoPlayerPlayButton
            isPlaying={isPlaying}
            isEnded={isEnded}
            disabledTooltip={isSettingsOpen}
            onClick={onTogglePlay}
            isFullscreen={isFullscreen}
          />

          <VideoPlayerSkipButton
            direction="forward"
            seconds={5}
            disabledTooltip={isSettingsOpen}
            onClick={() => (onSkip ? onSkip(5) : onSeek(Math.min(duration, currentTime + 5)))}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Sisi Kanan: Subtitle (CC), Pengaturan (Settings Menu), & Layar Penuh (Fullscreen) */}
        <div className={rightSectionClasses}>
          {showSubtitles && tracks.length > 0 && onSubtitleChange && (
            <VideoPlayerSubtitleButton
              tracks={tracks}
              currentSubtitle={currentSubtitle}
              disabledTooltip={isSettingsOpen}
              onChange={onSubtitleChange}
              isFullscreen={isFullscreen}
            />
          )}

          {/* Menu Pengaturan Terpadu (Loop, Speed, Subtitles, Quality) */}
          <VideoPlayerSettingsMenu
            isLoop={isLoop}
            onToggleLoop={onToggleLoop ?? (() => {})}
            playbackRate={playbackRate}
            playbackRates={playbackRates}
            onPlaybackRateChange={onPlaybackRateChange}
            tracks={tracks}
            currentSubtitle={currentSubtitle}
            onSubtitleChange={onSubtitleChange}
            qualities={qualities}
            currentQuality={currentQuality}
            isOpen={isSettingsOpen}
            onOpenChange={handleSettingsOpenChange}
            activeSubMenu={settingsSubMenu}
            onSubMenuChange={onSettingsSubMenuChange}
            onQualityChange={onQualityChange}
            isFullscreen={isFullscreen}
          />

          <VideoPlayerFullscreenButton
            isFullscreen={isFullscreen}
            isPiP={isPiP}
            showPiP={showPiP}
            showFullscreen={showFullscreen}
            disabledTooltip={isSettingsOpen}
            onToggleFullscreen={onToggleFullscreen}
            onTogglePiP={onTogglePiP}
          />
        </div>
      </div>
    </div>
  );
};
