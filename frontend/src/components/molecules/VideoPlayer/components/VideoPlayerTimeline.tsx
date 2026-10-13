import { useState, useRef, useEffect, type FC, type ReactElement, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { VideoPlayerTimelineProps } from '../VideoPlayer.types';
import { calculateProgress, formatTime, clampValue, parseVttCues, findScrubbingCue, type ScrubbingCue } from '../VideoPlayer.utils';

/**
 * VideoPlayerTimeline Component - Sub-Molecule Internal VideoPlayer
 *
 * Bilah penelusur waktu (timeline scrubber) video dengan indikator kemajuan putar,
 * visualisasi buffer data, dan tooltip pratinjau thumbnail scrubbing sprite WebVTT interaktif.
 */
export const VideoPlayerTimeline: FC<VideoPlayerTimelineProps> = ({
  currentTime,
  duration,
  bufferedPercent,
  scrubbingVtt,
  disablePreview = false,
  onSeek,
  isFullscreen = false,
  isPlaying = false,
}): ReactElement => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const wasPlayingOnDragStartRef = useRef<boolean>(false);
  const lastSeekTimeRef = useRef<number>(currentTime);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cues, setCues] = useState<ScrubbingCue[]>([]);

  // Muat berkas WebVTT scrubbing jika disediakan (dengan AbortController untuk membatalkan stale request)
  useEffect(() => {
    if (!scrubbingVtt) return;

    const controller = new AbortController();

    fetch(scrubbingVtt, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat scrubbing VTT');
        return res.text();
      })
      .then((text) => {
        setCues(parseVttCues(text, scrubbingVtt));
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setCues([]);
      });

    return () => {
      controller.abort();
    };
  }, [scrubbingVtt]);

  const playedPercent = calculateProgress(currentTime, duration);
  const effectiveCues = scrubbingVtt ? cues : [];
  const activeCue = effectiveCues.length > 0 ? findScrubbingCue(effectiveCues, hoverTime) : null;

  // Efek sinkronisasi listener global saat pengguna menyeret (scrubbing) timeline
  useEffect(() => {
    if (!isDragging) return;

    const onGlobalMouseMove = (moveEvent: globalThis.MouseEvent) => {
      if (!trackRef.current || !duration) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clampValue((moveEvent.clientX - rect.left) / rect.width, 0, 1);
      const moveTime = ratio * duration;
      lastSeekTimeRef.current = moveTime;
      // Perbarui posisi frame video saat digeser tanpa memaksa play
      onSeek(moveTime, false);
      if (!disablePreview) {
        setHoverPosition(ratio * 100);
        setHoverTime(moveTime);
      }
    };

    const onGlobalMouseUp = () => {
      setIsDragging(false);
      setHoverPosition(null);
      // Lanjutkan pemutaran HANYA jika sebelum digeser video memang sedang berputar (playing)
      if (wasPlayingOnDragStartRef.current) {
        onSeek(lastSeekTimeRef.current, true);
      }
      wasPlayingOnDragStartRef.current = false;
    };

    window.addEventListener('mousemove', onGlobalMouseMove);
    window.addEventListener('mouseup', onGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', onGlobalMouseMove);
      window.removeEventListener('mouseup', onGlobalMouseUp);
    };
  }, [isDragging, disablePreview, duration, onSeek]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disablePreview) {
      if (hoverPosition !== null) setHoverPosition(null);
      return;
    }
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clampValue((e.clientX - rect.left) / rect.width, 0, 1);
    setHoverPosition(ratio * 100);
    setHoverTime(ratio * duration);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverPosition(null);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || !duration) return;
    setIsDragging(true);
    wasPlayingOnDragStartRef.current = Boolean(isPlaying);

    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clampValue((e.clientX - rect.left) / rect.width, 0, 1);
    const targetTime = ratio * duration;
    lastSeekTimeRef.current = targetTime;

    // Saat mulai menyentuh timeline, perbarui posisi tanpa memicu autoPlay
    onSeek(targetTime, false);
    if (!disablePreview) {
      setHoverPosition(ratio * 100);
      setHoverTime(targetTime);
    }
  };

  const timelineTrackClasses = cn(
    // layout
    'flex items-center select-none group/timeline',
    // position
    'relative',
    // size
    isFullscreen ? 'w-full h-6' : 'w-full h-4',
    // spacing
    isFullscreen ? 'py-1.5' : 'py-1',
    // interaction
    'cursor-pointer'
  );

  const backgroundBarClasses = cn(
    // layout
    isFullscreen ? 'overflow-hidden group-hover/timeline:h-3.5' : 'overflow-hidden group-hover/timeline:h-2.5',
    // position
    'relative',
    // size
    isFullscreen ? 'w-full h-2' : 'w-full h-1.5',
    // border
    'rounded-full',
    // background
    'bg-white/20 backdrop-blur-sm',
    // shadow & depth
    'shadow-n2',
    // transition
    'transition-all duration-200'
  );

  const thumbClasses = cn(
    // position
    'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none',
    // size
    isFullscreen ? 'w-5 h-5' : 'w-3.5 h-3.5',
    // border
    'rounded-full border-2 border-white',
    // background
    'bg-primary',
    // shadow & depth
    'shadow-1',
    // interaction
    'group-hover/timeline:scale-125',
    // transition
    'transition-transform duration-150'
  );

  const tooltipPreviewClasses = cn(
    // layout
    'flex flex-col items-center pointer-events-none',
    // position
    'absolute bottom-full mb-1.5 -translate-x-1/2 z-30'
  );

  const tooltipCardClasses = cn(
    // layout
    'flex flex-col items-center overflow-hidden',
    // border
    'rounded-xl border border-white/20',
    // background
    'bg-black/90 backdrop-blur-md',
    // shadow & depth
    'shadow-3'
  );

  const bufferBarClasses = cn(
    // position
    'absolute inset-y-0 left-0',
    // border
    'rounded-full',
    // background
    'bg-white/30',
    // transition
    'transition-all duration-300'
  );

  const getProgressBarClasses = (dragging: boolean) =>
    cn(
      // position
      'absolute inset-y-0 left-0',
      // border
      'rounded-full',
      // background
      'bg-primary',
      // transition
      !dragging && 'transition-all duration-75'
    );

  const thumbnailFrameClasses = cn(
    // layout
    'overflow-hidden',
    // position
    'relative',
    // size
    isFullscreen ? 'w-64 h-36' : 'w-40 h-22.5',
    // background
    'bg-black'
  );

  const thumbnailTimeWrapperClasses = cn(
    // layout
    'flex items-center justify-center',
    // spacing
    isFullscreen ? 'py-2 px-3' : 'py-1.5 px-2'
  );

  const simpleTimeWrapperClasses = cn(
    // spacing
    isFullscreen ? 'px-3 py-1.5' : 'px-2 py-1'
  );

  return (
    <div
      ref={trackRef}
      className={timelineTrackClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      role="slider"
      aria-label="Penelusur Durasi Video"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration)}`}
      tabIndex={0}
    >
      {/* 1. Track Latar Belakang (Sunken Depth -2) */}
      <div className={backgroundBarClasses}>
        {/* Bilah Buffer yang sudah terunduh */}
        <div
          className={bufferBarClasses}
          style={{ width: `${bufferedPercent}%` }}
        />
        {/* Bilah Progres Pemutaran Utama */}
        <div
          className={getProgressBarClasses(isDragging)}
          style={{ width: `${playedPercent}%` }}
        />
      </div>

      {/* 2. Knop Thumb Taktil */}
      <div
        className={thumbClasses}
        style={{ left: `${playedPercent}%` }}
      />

      {/* 3. Tooltip Pratinjau Waktu & Scrubbing Thumbnail saat Hover */}
      {!disablePreview && hoverPosition !== null && duration > 0 && (
        <div
          className={tooltipPreviewClasses}
          style={{ left: `${clampValue(hoverPosition, 10, 90)}%` }}
        >
          <div className={tooltipCardClasses}>
            {/* Visual Thumbnail Frame Sprite */}
            {activeCue ? (
              <>
                <div className={thumbnailFrameClasses}>
                  <div
                    className="absolute bg-no-repeat"
                    style={{
                      width: `${activeCue.w}px`,
                      height: `${activeCue.h}px`,
                      backgroundImage: `url(${activeCue.imageUrl})`,
                      backgroundPosition: `-${activeCue.x}px -${activeCue.y}px`,
                      transform: `scale(${isFullscreen ? 256 / activeCue.w : 160 / activeCue.w})`,
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
                <div className={thumbnailTimeWrapperClasses}>
                  <Text as="span" variant="white" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" className="font-poppins tabular-nums leading-none">
                    {formatTime(hoverTime)}
                  </Text>
                </div>
              </>
            ) : (
              <div className={simpleTimeWrapperClasses}>
                <Text as="span" variant="white" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" className="font-poppins tabular-nums leading-none">
                  {formatTime(hoverTime)}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
