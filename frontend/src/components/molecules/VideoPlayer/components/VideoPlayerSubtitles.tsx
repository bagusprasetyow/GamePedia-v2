import { useEffect, useState, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms';
import type { VideoPlayerSubtitlesProps } from '../VideoPlayer.types';

/**
 * VideoPlayerSubtitles Component - Sub-Molecule Internal VideoPlayer
 *
 * Overlay penampil teks subtitle modern ala dev/videoPlayer dengan:
 * 1. Mendengarkan event cuechange dari WebVTT textTrack browser secara dinamis.
 * 2. Teks putih bersih ber-outline (text-shadow) tanpa kotak balok hitam default yang kaku.
 * 3. Animasi transisi naik/turun posisi vertikal yang responsif mengikuti visibilitas kontrol.
 */
export const VideoPlayerSubtitles: FC<VideoPlayerSubtitlesProps> = ({
  videoRef,
  currentSubtitle,
  isFullscreen = false,
  isControlsVisible = false,
}): ReactElement | null => {
  const [cueText, setCueText] = useState<string>('');

  // Sinkronisasi status penundaan visibilitas kontrol tanpa melanggar set-state-in-effect
  const [controlsVisibleDelayed, setControlsVisibleDelayed] = useState<boolean>(isControlsVisible);
  const [prevControlsVisible, setPrevControlsVisible] = useState<boolean>(isControlsVisible);

  if (isControlsVisible !== prevControlsVisible) {
    setPrevControlsVisible(isControlsVisible);
    if (isControlsVisible) {
      setControlsVisibleDelayed(true);
    }
  }

  // Berikan sedikit delay 100ms saat kontrol tersembunyi agar transisi turun mulus
  useEffect(() => {
    if (!isControlsVisible) {
      const timer = setTimeout(() => {
        setControlsVisibleDelayed(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isControlsVisible]);

  // Dengarkan pembaruan cue WebVTT menggunakan addEventListener standar DOM
  useEffect(() => {
    const video = videoRef?.current;
    if (!video || currentSubtitle === 'off') return;

    const handleCueChange = (e: Event) => {
      const track = e.target as TextTrack;
      if (!track) return;
      const activeCue = track.activeCues && (track.activeCues[0] as VTTCue | undefined);
      setCueText(activeCue ? activeCue.text : '');
    };

    const tracks = video.textTracks;
    const attachedTracks: TextTrack[] = [];

    if (tracks) {
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        if (t.language === currentSubtitle || t.label.toLowerCase() === currentSubtitle.toLowerCase()) {
          t.addEventListener('cuechange', handleCueChange);
          attachedTracks.push(t);
        }
      }
    }

    // Baca cue aktif saat inisialisasi secara asinkron
    const initTimer = setTimeout(() => {
      if (!tracks) return;
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        if (t.language === currentSubtitle || t.label.toLowerCase() === currentSubtitle.toLowerCase()) {
          const activeCue = t.activeCues && (t.activeCues[0] as VTTCue | undefined);
          setCueText(activeCue ? activeCue.text : '');
          break;
        }
      }
    }, 0);

    return () => {
      clearTimeout(initTimer);
      attachedTracks.forEach((t) => {
        t.removeEventListener('cuechange', handleCueChange);
      });
    };
  }, [videoRef, currentSubtitle]);

  if (!cueText || currentSubtitle === 'off') return null;

  // Posisi vertikal subtitle: naik saat kontrol tampil, turun saat kontrol tersembunyi
  const bottomClass = controlsVisibleDelayed
    ? isFullscreen
      ? 'bottom-20'
      : 'bottom-16'
    : isFullscreen
    ? 'bottom-8'
    : 'bottom-3';

  const widthClass = isFullscreen ? 'w-[90%] max-w-7xl' : 'w-[88%] max-w-5xl';

  const textOutlineClass = isFullscreen ? 'text-outline-1' : 'text-outline-04';

  const subtitleContainerClasses = cn(
    // layout
    'flex flex-col items-center justify-center text-center select-none pointer-events-none',
    // position
    'absolute left-1/2 -translate-x-1/2 z-20',
    bottomClass,
    // size
    widthClass,
    // spacing
    'px-2',
    // transition
    'transition-all duration-300'
  );

  const subtitleTextClasses = cn(
    'font-semibold text-white tracking-wide leading-relaxed drop-shadow-md',
    isFullscreen ? 'text-2xl sm:text-3xl' : 'text-xs sm:text-sm',
    textOutlineClass
  );

  return (
    <div
      aria-hidden="true"
      className={subtitleContainerClasses}
    >
      <Text
        as="div"
        weight="semibold"
        align="center"
        variant="white"
        className={subtitleTextClasses}
      >
        {cueText}
      </Text>
    </div>
  );
};
