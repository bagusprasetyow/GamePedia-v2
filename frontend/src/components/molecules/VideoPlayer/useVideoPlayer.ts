import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import type {
  UseVideoPlayerOptions,
  VideoQualityOption,
  VideoPlayerTextInfoState,
  VideoPlayerSettingsSubMenu,
} from './VideoPlayer.types';
import {
  calculateBufferedPercent,
  clampValue,
  formatTime,
  getStoredVolume,
  setStoredVolume,
} from './VideoPlayer.utils';
import { useTextInfo } from './useTextInfo';

export interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  isBuffering: boolean;
  hasStarted: boolean;
  isEnded: boolean;
  isControlsVisible: boolean;
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  currentSubtitle: string;
  qualities: VideoQualityOption[];
  currentQuality: string | number;
  isLoop: boolean;
  toggleLoop: () => void;
  errorMessage: string | null;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  replay: () => void;
  seek: (seconds: number, autoPlay?: boolean, silentTextInfo?: boolean) => void;
  skip: (seconds: number) => void;
  setVolumeLevel: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRateLevel: (rate: number) => void;
  toggleFullscreen: () => void;
  togglePiP: () => void;
  setSubtitle: (lang: string) => void;
  toggleSubtitle: () => void;
  setQuality: (qualityId: string | number) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  settingsSubMenu: VideoPlayerSettingsSubMenu;
  setSettingsSubMenu: (submenu: VideoPlayerSettingsSubMenu) => void;
  toggleSettings: (submenu?: VideoPlayerSettingsSubMenu) => void;
  closeSettings: () => void;
  handleMouseMove: () => void;
  handleMouseLeave: () => void;
  handleRetry: () => void;
  textInfo: VideoPlayerTextInfoState;
  showTextInfo: (input: string | { message?: string; subMessage?: string }) => void;
}

/**
 * Hook kustom untuk mengelola logika interaktif pemutar video HTML5 dan HLS stream.
 */
export const useVideoPlayer = (options: UseVideoPlayerOptions = {}): UseVideoPlayerReturn => {
  const {
    src,
    tracks = [],
    defaultSubtitle = 'off',
    qualities: customQualities,
    defaultQuality = -1,
    autoPlay = false,
    muted = false,
    defaultVolume = 1,
    loop = false,
    autoHideControlsDelay = 2500,
    enableKeyboardShortcuts = true,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onVolumeChange,
    onWaiting,
    onSeeked,
    onError,
    onQualityChange,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideControlsTimerRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => getStoredVolume(defaultVolume));
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (muted) return true;
    return getStoredVolume(defaultVolume) === 0;
  });
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPiP, setIsPiP] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>(defaultSubtitle);
  const [detectedQualities, setDetectedQualities] = useState<VideoQualityOption[]>([]);
  const [activePlayingLevel, setActivePlayingLevel] = useState<number | null>(null);
  const [currentQuality, setCurrentQuality] = useState<string | number>(defaultQuality);
  const [isLoop, setIsLoop] = useState<boolean>(loop);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsSubMenu, setSettingsSubMenu] = useState<VideoPlayerSettingsSubMenu>('main');
  const [reloadToken, setReloadToken] = useState<number>(0);
  const retryCountRef = useRef<number>(0);

  const { textInfo, showTextInfo } = useTextInfo();

  // Simpan callbacks props dalam ref agar event listener DOM tidak perlu re-bind saat callback berubah
  const callbacksRef = useRef({
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onVolumeChange,
    onWaiting,
    onSeeked,
    onError,
    showTextInfo,
  });

  useEffect(() => {
    callbacksRef.current = {
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onVolumeChange,
      onWaiting,
      onSeeked,
      onError,
      showTextInfo,
    };
  });

  // Sinkronisasi perubahan props saat render sesuai panduan modern React (tanpa setState di dalam effect)
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setCurrentTime(0);
    setDuration(0);
    setBufferedPercent(0);
    setIsEnded(false);
    setIsPlaying(false);
    setIsBuffering(false);
    setErrorMessage(null);
    setDetectedQualities([]);
    setActivePlayingLevel(null);
    setCurrentQuality(defaultQuality);
  }

  const [prevLoop, setPrevLoop] = useState(loop);
  if (loop !== prevLoop) {
    setPrevLoop(loop);
    setIsLoop(loop);
  }

  const [prevMuted, setPrevMuted] = useState(muted);
  if (muted !== prevMuted) {
    setPrevMuted(muted);
    setIsMuted(muted);
  }

  // Sinkronisasi imperatif ke elemen video HTML5 saat sumber video berubah
  useEffect(() => {
    retryCountRef.current = 0;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [src]);

  const toggleLoop = useCallback(() => {
    setIsLoop((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.loop = next;
      }
      showTextInfo({
        message: 'Pengulangan',
        subMessage: next ? 'Aktif' : 'Nonaktif',
      });
      return next;
    });
  }, [showTextInfo]);

  const qualities = useMemo(() => {
    const rawQualities =
      customQualities && customQualities.length > 0 ? customQualities : detectedQualities;

    if (rawQualities.length === 0) return [];

    const activeLvlOption =
      activePlayingLevel !== null
        ? rawQualities.find((q) => String(q.id) === String(activePlayingLevel))
        : null;

    return rawQualities.map((q) => {
      if (q.id === -1 || q.id === '-1') {
        if (activeLvlOption) {
          return {
            ...q,
            label: `Auto (${activeLvlOption.label})`,
            height: activeLvlOption.height,
          };
        }
      }
      return q;
    });
  }, [customQualities, detectedQualities, activePlayingLevel]);

  // Jadwalkan auto-hide kontrol (jangan sembunyikan saat sedang buffering/loading atau menu pengaturan terbuka)
  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimerRef.current !== null) {
      window.clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
    setIsControlsVisible(true);
    if (isPlaying && !isBuffering && !isSettingsOpen) {
      hideControlsTimerRef.current = window.setTimeout(() => {
        setIsControlsVisible(false);
      }, autoHideControlsDelay);
    }
  }, [isPlaying, isBuffering, isSettingsOpen, autoHideControlsDelay]);

  // Bersihkan timer auto-hide jika menu pengaturan dibuka
  useEffect(() => {
    if (isSettingsOpen && hideControlsTimerRef.current !== null) {
      window.clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = null;
    }
  }, [isSettingsOpen]);

  // Bersihkan timer auto-hide kontrol saat komponen unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current !== null) {
        window.clearTimeout(hideControlsTimerRef.current);
        hideControlsTimerRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = useCallback(() => {
    scheduleHideControls();
  }, [scheduleHideControls]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying && !isBuffering && !isSettingsOpen) {
      setIsControlsVisible(false);
    }
  }, [isPlaying, isBuffering, isSettingsOpen]);

  // Kontrol pemutaran
  const play = useCallback(() => {
    if (videoRef.current) {
      setErrorMessage(null);
      videoRef.current.play().catch((err: Error) => {
        // Browser autoplay restriction atau error media
        if (err.name !== 'AbortError') {
          setErrorMessage(err.message || 'Gagal memutar video');
        }
      });
      showTextInfo('Memutar');
    }
  }, [showTextInfo]);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      showTextInfo('Dijeda');
    }
  }, [showTextInfo]);

  const replay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsEnded(false);
      play();
    }
  }, [play]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isEnded) {
      replay();
    } else if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isEnded, isPlaying, pause, play, replay]);

  // Navigasi durasi (seek)
  const seek = useCallback(
    (seconds: number, autoPlay: boolean = false, silentTextInfo: boolean = false) => {
      if (!videoRef.current) return;
      const dur = videoRef.current.duration || 0;
      const clamped = clampValue(seconds, 0, dur);
      videoRef.current.currentTime = clamped;
      setCurrentTime(clamped);
      if (clamped < dur - 0.5) {
        setIsEnded(false);
      }
      if (autoPlay && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
      if (!silentTextInfo) {
        const percent = dur > 0 ? (clamped / dur) * 100 : 0;
        showTextInfo(`Menuju [ ${formatTime(clamped)} (${percent.toFixed(1)}%) ]`);
      }
    },
    [showTextInfo]
  );

  // Lompat maju / mundur dengan feedback TextInfo
  const skip = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      const dur = video.duration || 0;
      const newTime = clampValue(video.currentTime + seconds, 0, dur);
      video.currentTime = newTime;
      setCurrentTime(newTime);
      if (newTime < dur - 0.5) {
        setIsEnded(false);
      }
      const percent = dur > 0 ? (newTime / dur) * 100 : 0;
      showTextInfo({
        message: `${seconds > 0 ? 'Maju' : 'Mundur'} ${Math.abs(seconds)}s`,
        subMessage: `[ ${formatTime(newTime)} (${percent.toFixed(1)}%) ]`,
      });
    },
    [showTextInfo]
  );

  // Pengaturan volume
  const setVolumeLevel = useCallback(
    (newVolume: number) => {
      const clamped = clampValue(newVolume, 0, 1);
      setVolume(clamped);
      setStoredVolume(clamped);
      const isNowMuted = clamped === 0;
      if (videoRef.current) {
        videoRef.current.volume = clamped;
        videoRef.current.muted = isNowMuted;
        if (isNowMuted) {
          setIsMuted(true);
          showTextInfo({ message: 'Dibisukan' });
        } else {
          if (isMuted) {
            setIsMuted(false);
          }
          showTextInfo({
            message: 'Volume:',
            subMessage: `${Math.round(clamped * 100)}%`,
          });
        }
      }
      callbacksRef.current.onVolumeChange?.(clamped, isNowMuted);
    },
    [isMuted, showTextInfo]
  );

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      showTextInfo({ message: 'Dibisukan' });
      setStoredVolume(0);
      callbacksRef.current.onVolumeChange?.(0, true);
    } else {
      const safeVolume = volume === 0 ? 0.5 : volume;
      setVolume(safeVolume);
      setStoredVolume(safeVolume);
      videoRef.current.volume = safeVolume;
      videoRef.current.muted = false;
      showTextInfo({
        message: 'Volume:',
        subMessage: `${Math.round(safeVolume * 100)}%`,
      });
      callbacksRef.current.onVolumeChange?.(safeVolume, false);
    }
  }, [isMuted, volume, showTextInfo]);

  // Kecepatan putar
  const setPlaybackRateLevel = useCallback(
    (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        showTextInfo({
          message: 'Kecepatan:',
          subMessage: `${rate}x`,
        });
      }
    },
    [showTextInfo]
  );

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  // Picture in Picture
  const togglePiP = useCallback(() => {
    if (!videoRef.current) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture?.().catch(() => {});
    } else if (videoRef.current.requestPictureInPicture) {
      videoRef.current.requestPictureInPicture().catch(() => {});
    }
  }, []);

  // Pengaturan Subtitle
  const setSubtitle = useCallback(
    (lang: string, silent: boolean = false) => {
      setCurrentSubtitle(lang);
      const video = videoRef.current;
      if (!video || !video.textTracks) return;

      const normalizedLang = lang.trim().toLowerCase();
      let activeLabel = lang.toUpperCase();
      let matched = false;

      for (let i = 0; i < video.textTracks.length; i++) {
        const track = video.textTracks[i];
        const trackLang = (track.language || '').trim().toLowerCase();
        const trackLabel = (track.label || '').trim().toLowerCase();

        if (normalizedLang === 'off') {
          track.mode = 'disabled';
          activeLabel = 'Nonaktif';
          matched = true;
        } else if (
          trackLang === normalizedLang ||
          trackLabel === normalizedLang ||
          (trackLang && normalizedLang.startsWith(trackLang)) ||
          (trackLabel && trackLabel.includes(normalizedLang))
        ) {
          track.mode = 'hidden';
          activeLabel = track.label || track.language || lang;
          matched = true;
        } else {
          track.mode = 'disabled';
        }
      }

      if (!matched && normalizedLang !== 'off') {
        activeLabel = `${lang} (Tidak tersedia)`;
      }

      if (!silent) {
        showTextInfo({
          message: 'Subtitle:',
          subMessage: activeLabel,
        });
      }
    },
    [showTextInfo]
  );

  const toggleSubtitle = useCallback(() => {
    if (currentSubtitle !== 'off') {
      setSubtitle('off');
    } else {
      const defaultTrack = tracks.find((t) => t.default) || tracks[0];
      if (defaultTrack) {
        setSubtitle(defaultTrack.srcLang || defaultTrack.label);
      } else {
        showTextInfo({
          message: 'Subtitle:',
          subMessage: 'Tidak tersedia',
        });
      }
    }
  }, [currentSubtitle, tracks, setSubtitle, showTextInfo]);

  const changeSpeedByStep = useCallback(
    (direction: 'increase' | 'decrease') => {
      const standardRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      const currentIndex = standardRates.findIndex(
        (r) => Math.abs(r - playbackRate) < 0.05
      );
      if (currentIndex === -1) {
        setPlaybackRateLevel(1);
        return;
      }
      const nextIndex =
        direction === 'increase'
          ? Math.min(standardRates.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
      setPlaybackRateLevel(standardRates[nextIndex]);
    },
    [playbackRate, setPlaybackRateLevel]
  );

  const toggleSettings = useCallback(
    (submenu: VideoPlayerSettingsSubMenu = 'main') => {
      setIsSettingsOpen((prev) => {
        const next = !prev;
        if (next) {
          setIsControlsVisible(true);
          if (hideControlsTimerRef.current !== null) {
            window.clearTimeout(hideControlsTimerRef.current);
            hideControlsTimerRef.current = null;
          }
          setSettingsSubMenu(submenu);
          showTextInfo({
            message: 'Pengaturan',
            subMessage: submenu === 'main' ? 'Dibuka (S)' : submenu.toUpperCase(),
          });
        } else {
          showTextInfo({
            message: 'Pengaturan',
            subMessage: 'Ditutup',
          });
          if (isPlaying && !isBuffering) {
            scheduleHideControls();
          }
        }
        return next;
      });
    },
    [isPlaying, isBuffering, scheduleHideControls, showTextInfo]
  );

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
    setSettingsSubMenu('main');
    if (isPlaying && !isBuffering) {
      scheduleHideControls();
    }
  }, [isPlaying, isBuffering, scheduleHideControls]);

  // Pengaturan Resolusi / Kualitas Video
  const setQuality = useCallback(
    (qualityId: string | number) => {
      setCurrentQuality(qualityId);
      if (hlsRef.current) {
        const numericLevel = typeof qualityId === 'string' ? parseInt(qualityId, 10) : qualityId;
        hlsRef.current.currentLevel = numericLevel;
        if (numericLevel !== -1) {
          setActivePlayingLevel(numericLevel);
        }
      }
      onQualityChange?.(qualityId);
      const allQualities =
        customQualities && customQualities.length > 0 ? customQualities : detectedQualities;
      const found = allQualities.find((q) => q.id === qualityId);
      showTextInfo({
        message: 'Kualitas:',
        subMessage: found ? found.label : String(qualityId),
      });
    },
    [customQualities, detectedQualities, onQualityChange, showTextInfo]
  );

  // Coba muat ulang dengan penanganan re-inisialisasi HLS jika instance telah dihancurkan
  const handleRetry = useCallback(() => {
    setErrorMessage(null);
    setIsEnded(false);
    retryCountRef.current = 0;

    const sourceUrl =
      typeof src === 'string'
        ? src
        : Array.isArray(src) && src[0]
        ? src[0].src
        : '';
    const isHls =
      sourceUrl.includes('.m3u8') ||
      (Array.isArray(src) &&
        src.some((s) => s.type?.includes('mpegurl') || s.type?.includes('m3u8')));

    if (isHls && Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.startLoad();
        play();
      } else {
        // Pemicu inisialisasi ulang HLS jika instance telah dihancurkan sebelumnya
        setReloadToken((prev) => prev + 1);
      }
    } else if (videoRef.current) {
      videoRef.current.load();
      play();
    }
  }, [src, play]);

  // Efek Inisialisasi HLS (.m3u8)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sourceUrl =
      typeof src === 'string'
        ? src
        : Array.isArray(src) && src[0]
        ? src[0].src
        : '';
    if (!sourceUrl) return;

    const isHls =
      sourceUrl.includes('.m3u8') ||
      (Array.isArray(src) &&
        src.some((s) => s.type?.includes('mpegurl') || s.type?.includes('m3u8')));

    if (isHls) {
      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          capLevelToPlayerSize: false,
          startLevel: -1,
          abrEwmaDefaultEstimate: 8000000,
          abrBandWidthFactor: 0.95,
          abrBandWidthUpFactor: 0.85,
          testBandwidth: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          retryCountRef.current = 0;
          if (data.levels && data.levels.length > 0) {
            const detectedQualities: VideoQualityOption[] = [
              { id: -1, label: 'Otomatis' },
              ...data.levels.map((lvl, index) => ({
                id: index,
                label: lvl.height ? `${lvl.height}p` : `Level ${index + 1}`,
                height: lvl.height,
                width: lvl.width,
                bitrate: lvl.bitrate,
              })),
            ];
            setDetectedQualities(detectedQualities);
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          if (typeof data.level === 'number' && data.level >= 0) {
            setActivePlayingLevel(data.level);
          }
        });

        hls.on(Hls.Events.FRAG_CHANGED, (_event, data) => {
          if (data?.frag?.level !== undefined && data.frag.level >= 0) {
            setActivePlayingLevel(data.frag.level);
          }
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            const maxRetries = 3;
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (retryCountRef.current < maxRetries) {
                  retryCountRef.current += 1;
                  hls.startLoad();
                } else {
                  hls.destroy();
                  hlsRef.current = null;
                  setErrorMessage('Gagal memuat segmen video (Koneksi jaringan terputus)');
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                if (retryCountRef.current < maxRetries) {
                  retryCountRef.current += 1;
                  hls.recoverMediaError();
                } else {
                  hls.destroy();
                  hlsRef.current = null;
                  setErrorMessage('Gagal memproses media video');
                }
                break;
              default:
                hls.destroy();
                hlsRef.current = null;
                setErrorMessage('Gagal memutar aliran video HLS');
                break;
            }
          }
        });
        hlsRef.current = hls;

        return () => {
          hls.destroy();
          hlsRef.current = null;
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        return () => {
          video.removeAttribute('src');
          video.load();
        };
      }
    } else {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    }
  }, [src, reloadToken]);

  // Terapkan default subtitle & volume tersimpan saat metadata termuat
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setSubtitle(defaultSubtitle || 'off', true);
      try {
        video.volume = volume;
        video.muted = isMuted || volume === 0;
      } catch {
        // Browser safety fallback
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [defaultSubtitle, setSubtitle, volume, isMuted]);

  // Sinkronisasi level volume dan status bisu ke elemen video HTML5 sebelum frame pertama diproses browser
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.volume = volume;
      video.muted = isMuted || volume === 0;
      isInitializedRef.current = true;
    } catch {
      // Browser safety fallback
    }
  }, [volume, isMuted]);

  // Sinkronisasi Fullscreen change dari dokumen
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // Pengaturan naik/turun volume suara melalui scroll roda tetikus saat mode Layar Penuh (fullscreen)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isFullscreen) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const step = 0.05;
      const currentVol = isMuted ? 0 : volume;
      const nextVol = e.deltaY < 0 ? currentVol + step : currentVol - step;
      setVolumeLevel(nextVol);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, isFullscreen, volume, isMuted, setVolumeLevel]);

  // Sinkronisasi PiP change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, []);

  // Event listener media video HTML5
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlayEvent = () => {
      setIsPlaying(true);
      setHasStarted(true);
      setIsBuffering(false);
      setIsEnded(false);
      callbacksRef.current.onPlay?.();
    };

    const onPauseEvent = () => {
      setIsPlaying(false);
      setIsControlsVisible(true);
      callbacksRef.current.onPause?.();
    };

    const onEndedEvent = () => {
      setIsPlaying(false);
      setIsEnded(true);
      setIsControlsVisible(true);
      callbacksRef.current.showTextInfo('Video Selesai');
      callbacksRef.current.onEnded?.();
    };

    const onTimeUpdateEvent = () => {
      setCurrentTime(video.currentTime);
      const buf = calculateBufferedPercent(video.buffered, video.currentTime, video.duration);
      setBufferedPercent(buf);
      callbacksRef.current.onTimeUpdate?.(video.currentTime, video.duration);
    };

    const onDurationChangeEvent = () => {
      setDuration(video.duration || 0);
    };

    const onWaitingEvent = () => {
      setIsBuffering(true);
      setIsControlsVisible(true);
      callbacksRef.current.onWaiting?.();
    };

    const onPlayingEvent = () => {
      setIsBuffering(false);
    };

    const onSeekedEvent = () => {
      setIsBuffering(false);
      callbacksRef.current.onSeeked?.(video.currentTime);
    };

    const onCanPlayEvent = () => {
      setIsBuffering(false);
    };

    const onLoadStartEvent = () => {
      setIsBuffering(true);
    };

    const onErrorEvent = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      setErrorMessage(video.error?.message || 'Gagal memuat berkas video');
      callbacksRef.current.onError?.(video.error);
    };

    video.addEventListener('play', onPlayEvent);
    video.addEventListener('pause', onPauseEvent);
    video.addEventListener('ended', onEndedEvent);
    video.addEventListener('timeupdate', onTimeUpdateEvent);
    video.addEventListener('durationchange', onDurationChangeEvent);
    video.addEventListener('loadedmetadata', onDurationChangeEvent);
    video.addEventListener('waiting', onWaitingEvent);
    video.addEventListener('playing', onPlayingEvent);
    video.addEventListener('canplay', onCanPlayEvent);
    video.addEventListener('loadstart', onLoadStartEvent);
    video.addEventListener('seeked', onSeekedEvent);
    video.addEventListener('error', onErrorEvent);

    return () => {
      video.removeEventListener('play', onPlayEvent);
      video.removeEventListener('pause', onPauseEvent);
      video.removeEventListener('ended', onEndedEvent);
      video.removeEventListener('timeupdate', onTimeUpdateEvent);
      video.removeEventListener('durationchange', onDurationChangeEvent);
      video.removeEventListener('loadedmetadata', onDurationChangeEvent);
      video.removeEventListener('waiting', onWaitingEvent);
      video.removeEventListener('playing', onPlayingEvent);
      video.removeEventListener('canplay', onCanPlayEvent);
      video.removeEventListener('loadstart', onLoadStartEvent);
      video.removeEventListener('seeked', onSeekedEvent);
      video.removeEventListener('error', onErrorEvent);
    };
  }, []);

  // Sinkronisasi status loop ke elemen video DOM
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Sinkronisasi status muted ke elemen video DOM
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Inisialisasi putar otomatis jika ditentukan
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      play();
    }
  }, [autoPlay, play]);

  // Pintasan Keyboard
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Jangan aktifkan jika user sedang mengetik di input, textarea, dll.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Pastikan fokus ada di container atau anak container saat di luar fullscreen
      const container = containerRef.current;
      if (!container) return;
      const hasFocusInside =
        container === document.activeElement || container.contains(document.activeElement);

      if (!hasFocusInside && !isFullscreen) return;

      // Cegah pembajakan tombol: jika fokus sedang di tombol / elemen kontrol interaktif,
      // jangan jalankan pencegahan bawaan untuk Space atau Enter agar aksi klik tombol native tetap terpicu
      const isInteractiveElement =
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'button' ||
          target.getAttribute('role') === 'slider');

      if (isInteractiveElement && (e.key === ' ' || e.key === 'Enter')) {
        return;
      }

      // Reset auto-hide kontrol agar bilah kontrol selalu muncul saat tombol shortcut ditekan
      scheduleHideControls();

      switch (e.key) {
        // 1. Putar / Jeda (Space atau K)
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;

        // 2. Layar Penuh (F atau Enter ala dev/videoPlayer)
        case 'f':
        case 'F':
        case 'Enter':
          e.preventDefault();
          toggleFullscreen();
          break;

        // 3. Bisu / Nyalakan Suara (M)
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;

        // 4. Pengulangan Putar / Loop Toggle (L ala dev/videoPlayer)
        case 'l':
        case 'L':
          e.preventDefault();
          toggleLoop();
          break;

        // 5. Hidupkan / Matikan Subtitle (C ala dev/videoPlayer, Ctrl+C untuk submenu Subtitle)
        case 'c':
        case 'C':
          if ((e.ctrlKey || e.metaKey) && window.getSelection()?.toString()) {
            return;
          }
          e.preventDefault();
          if (e.ctrlKey || e.metaKey || e.altKey) {
            setIsControlsVisible(true);
            setIsSettingsOpen(true);
            setSettingsSubMenu('subtitles');
            showTextInfo({ message: 'Pengaturan:', subMessage: 'Subtitle' });
          } else {
            toggleSubtitle();
          }
          break;

        // 6. Mode Gambar dalam Gambar / Picture-in-Picture (P atau I) & Ctrl+P Kecepatan
        case 'p':
        case 'P':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey || e.altKey) {
            setIsControlsVisible(true);
            setIsSettingsOpen(true);
            setSettingsSubMenu('speed');
            showTextInfo({ message: 'Pengaturan:', subMessage: 'Kecepatan' });
          } else {
            togglePiP();
          }
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          togglePiP();
          break;

        // 6b. Menu Pengaturan Kualitas Resolusi (Ctrl+Q / Alt+Q ala dev)
        case 'q':
        case 'Q':
          if (e.ctrlKey || e.metaKey || e.altKey) {
            e.preventDefault();
            setIsControlsVisible(true);
            setIsSettingsOpen(true);
            setSettingsSubMenu('quality');
            showTextInfo({ message: 'Pengaturan:', subMessage: 'Kualitas' });
          }
          break;

        // 6c. Menu Pengaturan Utama (S untuk Buka/Tutup, Escape untuk Menutup)
        case 's':
        case 'S':
          e.preventDefault();
          toggleSettings('main');
          break;
        case 'Escape':
          if (isSettingsOpen) {
            e.preventDefault();
            closeSettings();
          }
          break;

        // 7. Navigasi Detik (Panah Kiri mundur 5s, J mundur 10s, Panah Kanan maju 5s)
        case 'ArrowLeft':
          e.preventDefault();
          skip(-5);
          break;
        case 'j':
        case 'J':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(5);
          break;

        // 8. Pengaturan Volume Suara (Panah Atas / Bawah bertahap 5%)
        case 'ArrowUp':
          e.preventDefault();
          setVolumeLevel(volume + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolumeLevel(volume - 0.05);
          break;

        // 9. Tombol Angka 0 - 9 untuk Lompat Persentase Durasi (0% s/d 90%)
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          e.preventDefault();
          const percent = parseInt(e.key, 10) / 10;
          const targetTime = (duration || 0) * percent;
          seek(targetTime);
          break;
        }

        // 10. Lompat ke Awal / Akhir Video
        case 'Home':
          e.preventDefault();
          seek(0, false, true);
          showTextInfo({ message: 'Awal Video', subMessage: '00:00' });
          break;
        case 'End':
          e.preventDefault();
          seek(duration || 0, false, true);
          showTextInfo({ message: 'Akhir Video', subMessage: formatTime(duration || 0) });
          break;

        // 11. Penyesuaian Kecepatan Putar (< / > atau , / .)
        case '<':
        case ',':
          if (e.shiftKey || e.key === '<') {
            e.preventDefault();
            changeSpeedByStep('decrease');
          }
          break;
        case '>':
        case '.':
          if (e.shiftKey || e.key === '>') {
            e.preventDefault();
            changeSpeedByStep('increase');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enableKeyboardShortcuts,
    isFullscreen,
    togglePlay,
    toggleFullscreen,
    toggleMute,
    toggleLoop,
    toggleSubtitle,
    togglePiP,
    toggleSettings,
    closeSettings,
    isSettingsOpen,
    skip,
    seek,
    setVolumeLevel,
    volume,
    duration,
    changeSpeedByStep,
    showTextInfo,
    scheduleHideControls,
  ]);

  return {
    videoRef,
    containerRef,
    isPlaying,
    isBuffering,
    hasStarted,
    isEnded,
    isControlsVisible: isControlsVisible || isSettingsOpen,
    currentTime,
    duration,
    bufferedPercent,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    currentSubtitle,
    qualities,
    currentQuality,
    isLoop,
    toggleLoop,
    errorMessage,
    togglePlay,
    play,
    pause,
    replay,
    seek,
    skip,
    setVolumeLevel,
    toggleMute,
    setPlaybackRateLevel,
    toggleFullscreen,
    togglePiP,
    setSubtitle,
    toggleSubtitle,
    setQuality,
    isSettingsOpen,
    setIsSettingsOpen,
    settingsSubMenu,
    setSettingsSubMenu,
    toggleSettings,
    closeSettings,
    handleMouseMove,
    handleMouseLeave,
    handleRetry,
    textInfo,
    showTextInfo,
  };
};
