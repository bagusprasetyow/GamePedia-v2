import { useState, useRef, useEffect, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Button, Icon, Text } from '@/components/atoms';
import type { VideoPlayerOverlayProps } from '../VideoPlayer.types';
import { useVideoClickHandler } from '../useVideoClickHandler';

/**
 * VideoPlayerOverlay Component - Sub-Molecule Internal VideoPlayer
 *
 * Menampilkan poster latar, tombol putar besar awal di tengah layar, indikator animasi
 * play/pause transient yang muncul sesaat, spinner animasi buffer, judul video pada header overlay,
 * serta kartu pesan galat dengan tombol muat ulang (retry).
 */
export const VideoPlayerOverlay: FC<VideoPlayerOverlayProps> = ({
  isPlaying,
  isBuffering,
  hasStarted,
  isEnded = false,
  poster,
  title,
  showTitle = false,
  isControlsVisible,
  errorMessage,
  onTogglePlay,
  onReplay,
  onToggleFullscreen,
  onRetry,
  isFullscreen = false,
}): ReactElement | null => {
  const [transientState, setTransientState] = useState<{
    type: 'play' | 'pause';
    id: number;
  } | null>(null);

  const prevPlayingRef = useRef<boolean | null>(null);
  const isFirstMountRef = useRef<boolean>(true);
  const overlayTimeoutRef = useRef<number | null>(null);

  // Pantau perubahan status pemutaran untuk menampilkan animasi fade-scale play/pause persis dev/videoPlayer
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevPlayingRef.current = isPlaying;
      return;
    }

    if (isEnded) {
      if (overlayTimeoutRef.current !== null) {
        window.clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = null;
      }
      prevPlayingRef.current = isPlaying;
      return;
    }

    if (prevPlayingRef.current !== isPlaying) {
      prevPlayingRef.current = isPlaying;

      const type: 'play' | 'pause' = isPlaying ? 'play' : 'pause';
      const id = Date.now();

      if (overlayTimeoutRef.current !== null) {
        window.clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = null;
      }

      setTransientState(null);
      requestAnimationFrame(() => {
        setTransientState({ type, id });
        overlayTimeoutRef.current = window.setTimeout(() => {
          setTransientState(null);
          overlayTimeoutRef.current = null;
        }, 800);
      });
    }
  }, [isPlaying, isEnded]);

  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current !== null) {
        window.clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, []);

  const { handleClick: handleOverlayClick, handleDoubleClick: handleOverlayDoubleClick } =
    useVideoClickHandler({
      onSingleClick: onTogglePlay,
      onDoubleClick: onToggleFullscreen ?? onTogglePlay,
    });

  const headerTitleContainerClasses = cn(
    // position
    'absolute top-0 inset-x-0 z-40 pointer-events-none',
    // spacing
    isFullscreen ? 'p-6' : 'p-4',
    // background
    'bg-linear-to-b from-black/80 via-black/40 to-transparent',
    // state
    isControlsVisible ? 'opacity-100' : 'opacity-0',
    // transition
    'transition-opacity duration-300'
  );

  const spinnerSize = isFullscreen ? 100 : 64;
  const spinnerStrokeWidth = isFullscreen ? 8 : 6;
  const spinnerRadius = (spinnerSize - spinnerStrokeWidth) / 2;
  const spinnerCircumference = 2 * Math.PI * spinnerRadius;

  const errorOverlayClasses = cn(
    // layout
    'flex flex-col items-center justify-center text-center',
    // position
    'absolute inset-0 z-30',
    // spacing
    'p-6',
    // background
    'bg-black/80'
  );

  const errorIconWrapperClasses = cn(
    // spacing
    'p-3 mb-3',
    // border
    'rounded-full border border-destructive/40',
    // background
    'bg-destructive/20',
    // text
    'text-destructive'
  );

  const bigPlayOverlayClasses = cn(
    // layout
    'flex items-center justify-center',
    // position
    'absolute inset-0 z-20',
    // interaction
    'cursor-default',
    // background saat ended
    isEnded && 'bg-black/20 hover:bg-black/35 transition-colors backdrop-blur-xs'
  );

  const bigPlayButtonClasses = cn(
    // layout
    'flex items-center justify-center',
    // size
    isFullscreen ? 'w-24 h-24' : 'w-16 h-16',
    // border
    'rounded-full',
    // background
    'bg-primary/90 backdrop-blur-sm hover:bg-primary',
    // text
    'text-primary-foreground',
    // shadow & depth
    'shadow-3',
    // interaction
    'cursor-pointer hover:scale-110 active:scale-95',
    // transition
    'transition-all duration-300'
  );

  const transientIndicatorClasses = cn(
    // layout
    'flex items-center justify-center pointer-events-none',
    // size
    isFullscreen ? 'w-24 h-24' : 'w-16 h-16',
    // border
    'rounded-full',
    // background & shadow
    'bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-3'
  );

  const posterClasses = cn(
    // position
    'absolute inset-0 z-10',
    // background
    'bg-cover bg-center bg-no-repeat',
    // state
    'pointer-events-none'
  );

  const spinnerContainerClasses = cn(
    // layout
    'flex items-center justify-center',
    // position
    'absolute inset-0 z-30',
    // background
    'bg-black/20 backdrop-blur-xs',
    // state
    'pointer-events-none'
  );

  const transientWrapperClasses = cn(
    // layout
    'flex items-center justify-center',
    // position
    'absolute inset-0 z-20',
    // state
    'pointer-events-none',
    // transition / animation
    'animate-fade-scale'
  );

  return (
    <>
      {/* 1. Poster Latar Belakang (jika belum diputar atau video selesai, dan poster tersedia) */}
      {((!hasStarted && !isPlaying) || isEnded) && poster && (
        <div
          className={posterClasses}
          style={{ backgroundImage: `url(${poster})` }}
          aria-hidden="true"
        />
      )}

      {/* 2. Header Judul Overlay (hanya tampil jika showTitle aktif dan title tersedia) */}
      {showTitle && title && (
        <div className={headerTitleContainerClasses}>
          <Text as="div" size={isFullscreen ? 'base' : 'sm'} weight="medium" className="text-white drop-shadow-md truncate">
            {title}
          </Text>
        </div>
      )}

      {/* 3. Spinner Loading / Buffering (Persis dev/videoPlayer) */}
      {isBuffering && !errorMessage && (
        <div className={spinnerContainerClasses}>
          <svg
            className="animate-spin"
            width={spinnerSize}
            height={spinnerSize}
            viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
          >
            <circle
              cx={spinnerSize / 2}
              cy={spinnerSize / 2}
              r={spinnerRadius}
              className="stroke-white/20"
              strokeWidth={spinnerStrokeWidth}
              fill="none"
            />
            <circle
              cx={spinnerSize / 2}
              cy={spinnerSize / 2}
              r={spinnerRadius}
              className="stroke-primary"
              strokeWidth={spinnerStrokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${spinnerCircumference * 0.33} ${spinnerCircumference}`}
            />
          </svg>
        </div>
      )}

      {/* 4. Tampilan Pesan Galat (Error State) */}
      {errorMessage && (
        <div className={errorOverlayClasses}>
          <div className={errorIconWrapperClasses}>
            <Icon icon="lucide:alert-circle" size="xl" />
          </div>
          <Text as="p" size="sm" weight="semibold" className="text-white mb-1">
            Gagal Memuat Video
          </Text>
          <Text as="p" size="xs" variant="muted" className="max-w-xs mb-4">
            {errorMessage}
          </Text>
          {onRetry && (
            <Button
              size="sm"
              variant="secondary"
              startIcon="lucide:refresh-cw"
              onClick={onRetry}
            >
              Coba Lagi
            </Button>
          )}
        </div>
      )}

      {/* 5. Tombol Putar Besar Awal & Tombol Replay saat Selesai */}
      {((!hasStarted && !isPlaying) || isEnded) && !isBuffering && !errorMessage && (
        <div
          className={bigPlayOverlayClasses}
          onClick={isEnded ? (onReplay ?? onTogglePlay) : handleOverlayClick}
          onDoubleClick={isEnded ? undefined : handleOverlayDoubleClick}
          role="button"
          tabIndex={0}
          aria-label={isEnded ? 'Putar Ulang' : 'Putar'}
        >
          <div className={bigPlayButtonClasses}>
            <Icon
              icon={isEnded ? 'lucide:rotate-ccw' : 'lucide:play'}
              size={isFullscreen ? '4xl' : 'xl'}
              className={!isEnded ? (isFullscreen ? 'ml-1.5' : 'ml-1') : ''}
            />
          </div>
        </div>
      )}

      {/* 6. Indikator Animasi Play/Pause Transient (muncul sesaat dengan animate-fade-scale persis dev/videoPlayer) */}
      {transientState && !isEnded && !errorMessage && !isBuffering && (
        <div
          key={transientState.id}
          className={transientWrapperClasses}
        >
          <div className={transientIndicatorClasses}>
            <Icon
              icon={transientState.type === 'play' ? 'lucide:play' : 'lucide:pause'}
              size={isFullscreen ? '4xl' : 'xl'}
              className={transientState.type === 'play' ? (isFullscreen ? 'ml-1.5' : 'ml-1') : ''}
            />
          </div>
        </div>
      )}
    </>
  );
};
