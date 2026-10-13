import type { HTMLAttributes, ReactNode } from 'react';
import type {
  DepthNumeric,
  DepthString,
  DepthNamed,
} from '@/components/atoms/Button/Button.types';

export type { DepthNumeric, DepthString, DepthNamed };

export type VideoPlayerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type VideoPlayerVariant = 'default' | 'card' | 'elevated' | 'ghost';

export type VideoPlayerAspectRatio = '16/9' | '4/3' | '1/1' | '21/9' | 'auto';

export type VideoPlayerRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export type VideoPlayerDepth = DepthNumeric | DepthString | DepthNamed;

export type VideoPlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export type VideoPlayerObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export interface VideoSource {
  /**
   * Alamat URL sumber berkas video.
   */
  src: string;
  /**
   * Tipe MIME video (contoh: 'video/mp4', 'video/webm').
   */
  type?: string;
}

export interface VideoQualityOption {
  /**
   * Identifier tingkat kualitas (-1 untuk auto / otomatis, atau index level 0, 1, 2...).
   */
  id: string | number;
  /**
   * Label tingkat resolusi yang ditampilkan (misal: 'Otomatis', '1080p', '720p', '480p', '360p').
   */
  label: string;
  /**
   * Nilai tinggi piksel vertikal (resolusi, misal: 1080, 720).
   */
  height?: number;
  /**
   * Lebar piksel horizontal opsional (misal: 1920, 1280).
   */
  width?: number;
  /**
   * Laju bit data aliran video dalam bps.
   */
  bitrate?: number;
}

export interface VideoTrackSource {
  /**
   * Alamat URL berkas subtitle/track WebVTT.
   */
  src: string;
  /**
   * Label bahasa yang ditampilkan ke pengguna.
   */
  label: string;
  /**
   * Jenis track (subtitles, captions, descriptions, chapters, metadata).
   * @default 'subtitles'
   */
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  /**
   * Kode bahasa BCP 47 (contoh: 'id', 'en').
   */
  srcLang?: string;
  /**
   * Apakah track ini diaktifkan secara default.
   * @default false
   */
  default?: boolean;
}

export interface VideoPlayerCustomProps {
  /**
   * URL sumber berkas video atau array sumber alternatif multi-format.
   */
  src?: string | VideoSource[];

  /**
   * Daftar track subtitle / caption WebVTT.
   */
  tracks?: VideoTrackSource[];

  /**
   * URL gambar poster/thumbnail video sebelum diputar.
   */
  poster?: string;

  /**
   * Judul video opsional yang ditampilkan di header overlay saat kontrol aktif.
   */
  title?: ReactNode;

  /**
   * Menampilkan header judul di lapisan overlay atas saat kontrol aktif.
   * @default false
   */
  showTitle?: boolean;

  /**
   * Apakah video otomatis diputar saat komponen dimuat.
   * Catatan: Sebagian besar browser mewajibkan muted=true jika autoplay aktif.
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Memutar ulang video secara terus-menerus setelah durasi berakhir.
   * @default false
   */
  loop?: boolean;

  /**
   * Menonaktifkan suara video secara default.
   * @default false
   */
  muted?: boolean;

  /**
   * Volume suara awal (0.0 s/d 1.0).
   * @default 1
   */
  defaultVolume?: number;

  /**
   * Kebijakan pra-muat berkas media video oleh browser.
   * @default 'metadata'
   */
  preload?: 'auto' | 'metadata' | 'none';

  /**
   * Menampilkan bilah kendali antarmuka (control bar).
   * @default true
   */
  controls?: boolean;

  /**
   * Skala rasio aspek tampilan video.
   * @default '16/9'
   */
  aspectRatio?: VideoPlayerAspectRatio;

  /**
   * Mode penskalaan video terhadap ukuran kontainer (CSS object-fit).
   * Gunakan 'cover' agar video mengisi penuh kontainer tanpa garis/gap hitam di samping.
   * @default 'cover'
   */
  objectFit?: VideoPlayerObjectFit;

  /**
   * Skala dimensi preset ukuran pemutar video.
   * @default 'md'
   */
  size?: VideoPlayerSize;

  /**
   * Varian tampilan bingkai pemutar video.
   * @default 'default'
   */
  variant?: VideoPlayerVariant;

  /**
   * Tingkat kedalaman visual taktil Depth System (-3 s/d 3).
   * @default 1
   */
  depth?: VideoPlayerDepth;

  /**
   * Tingkat kebulatan sudut pemutar video.
   * @default 'lg'
   */
  rounded?: VideoPlayerRounded;

  /**
   * Menampilkan tombol kendali kecepatan putar (playback rate).
   * @default true
   */
  showPlaybackRate?: boolean;

  /**
   * Daftar opsi kelipatan kecepatan putar yang tersedia.
   * @default [0.5, 0.75, 1, 1.5, 2]
   */
  playbackRates?: number[];

  /**
   * Menampilkan tombol kendali pemilihan resolusi / kualitas video (jika opsi kualitas tersedia).
   * @default true
   */
  showQuality?: boolean;

  /**
   * Daftar opsi kualitas / resolusi video yang ditentukan secara kustom (jika tidak otomatis dideteksi dari HLS).
   */
  qualities?: VideoQualityOption[];

  /**
   * Tingkat kualitas awal yang dipilih (-1 untuk otomatis).
   * @default -1
   */
  defaultQuality?: string | number;

  /**
   * Callback saat kualitas / resolusi video diganti oleh pengguna.
   */
  onQualityChange?: (qualityId: string | number) => void;

  /**
   * Alamat URL berkas WebVTT thumbnail scrubbing sprite sheet untuk pratinjau hover timeline.
   */
  scrubbingVtt?: string;

  /**
   * Menampilkan tombol kendali teks subtitle / caption (jika tracks tersedia).
   * @default true
   */
  showSubtitles?: boolean;

  /**
   * Bahasa subtitle default awal (misal 'id', 'en', atau 'off').
   * @default 'off'
   */
  defaultSubtitle?: string;

  /**
   * Menampilkan tombol mode Picture-in-Picture (jika didukung peramban).
   * @default false
   */
  showPiP?: boolean;

  /**
   * Menampilkan tombol beralih ke layar penuh (Fullscreen).
   * @default true
   */
  showFullscreen?: boolean;

  /**
   * Menampilkan pengatur volume dan tombol bisu (Mute).
   * @default true
   */
  showVolume?: boolean;

  /**
   * Menampilkan informasi durasi dan waktu putar saat ini.
   * @default true
   */
  showTime?: boolean;

  /**
   * Durasi tenggang waktu (dalam milidetik) sebelum kontrol otomatis disembunyikan saat kursor diam.
   * @default 2500
   */
  autoHideControlsDelay?: number;

  /**
   * Mengaktifkan pintasan keyboard interaktif (Spasi/K: Play/Pause, M: Mute, L: Loop, F/Enter: Fullscreen, C: Subtitle, P/I: PiP, Panah/J: Seek/Volume, 0-9: Persentase, Home/End: Awal/Akhir, </ >: Kecepatan).
   * @default true
   */
  enableKeyboardShortcuts?: boolean;

  /**
   * Mengaktifkan menu klik kanan kustom (Custom Context Menu ala dev/videoPlayer).
   * @default true
   */
  enableContextMenu?: boolean;

  /**
   * ClassName kustom tambahan untuk kontainer pembungkus utama.
   */
  className?: string;

  /**
   * Callback ketika video mulai diputar.
   */
  onPlay?: () => void;

  /**
   * Callback ketika video dijeda (paused).
   */
  onPause?: () => void;

  /**
   * Callback ketika pemutaran video selesai sampai akhir durasi.
   */
  onEnded?: () => void;

  /**
   * Callback ketika posisi waktu pemutaran video berubah.
   */
  onTimeUpdate?: (currentTime: number, duration: number) => void;

  /**
   * Callback ketika volume suara atau status mute berubah.
   */
  onVolumeChange?: (volume: number, isMuted: boolean) => void;

  /**
   * Callback saat peramban sedang memuat (buffering / waiting).
   */
  onWaiting?: () => void;

  /**
   * Callback saat video selesai mencari posisi baru (seeked).
   */
  onSeeked?: (currentTime: number) => void;

  /**
   * Callback saat terjadi kesalahan pemuatan media video.
   */
  onError?: (error: MediaError | null) => void;
}

export interface UseVideoPlayerOptions {
  src?: string | VideoSource[];
  tracks?: VideoTrackSource[];
  defaultSubtitle?: string;
  qualities?: VideoQualityOption[];
  defaultQuality?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  defaultVolume?: number;
  autoHideControlsDelay?: number;
  enableKeyboardShortcuts?: boolean;
  enableContextMenu?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number, isMuted: boolean) => void;
  onWaiting?: () => void;
  onSeeked?: (currentTime: number) => void;
  onError?: (error: MediaError | null) => void;
  onQualityChange?: (qualityId: string | number) => void;
}

export type VideoPlayerProps = VideoPlayerCustomProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof VideoPlayerCustomProps>;

// Props Sub-Komponen
export interface VideoPlayerOverlayProps {
  isPlaying: boolean;
  isBuffering: boolean;
  hasStarted: boolean;
  isEnded?: boolean;
  poster?: string;
  title?: ReactNode;
  showTitle?: boolean;
  isControlsVisible: boolean;
  errorMessage?: string | null;
  onTogglePlay: () => void;
  onReplay?: () => void;
  onToggleFullscreen?: () => void;
  onRetry?: () => void;
  isFullscreen?: boolean;
}

export interface VideoPlayerControlsProps {
  isVisible: boolean;
  isPlaying: boolean;
  isEnded?: boolean;
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  playbackRates: number[];
  isFullscreen: boolean;
  isPiP: boolean;
  showPlaybackRate: boolean;
  showPiP: boolean;
  showFullscreen: boolean;
  showVolume: boolean;
  showTime: boolean;
  showSubtitles?: boolean;
  tracks?: VideoTrackSource[];
  currentSubtitle?: string;
  showQuality?: boolean;
  qualities?: VideoQualityOption[];
  currentQuality?: string | number;
  isLoop?: boolean;
  onToggleLoop?: () => void;
  scrubbingVtt?: string;
  isSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  settingsSubMenu?: VideoPlayerSettingsSubMenu;
  onSettingsSubMenuChange?: (sub: VideoPlayerSettingsSubMenu) => void;
  onTogglePlay: () => void;
  onSeek: (seconds: number, autoPlay?: boolean, silentTextInfo?: boolean) => void;
  onSkip?: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onSubtitleChange?: (lang: string) => void;
  onQualityChange?: (qualityId: string | number) => void;
}

export type VideoPlayerSettingsSubMenu = 'main' | 'speed' | 'subtitles' | 'quality';

export interface VideoPlayerSettingsProps {
  isLoop: boolean;
  onToggleLoop: () => void;
  playbackRate: number;
  playbackRates: number[];
  onPlaybackRateChange: (rate: number) => void;
  tracks?: VideoTrackSource[];
  currentSubtitle?: string;
  onSubtitleChange?: (lang: string) => void;
  qualities?: VideoQualityOption[];
  currentQuality?: string | number;
  onQualityChange?: (qualityId: string | number) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  activeSubMenu?: VideoPlayerSettingsSubMenu;
  onSubMenuChange?: (sub: VideoPlayerSettingsSubMenu) => void;
  isFullscreen?: boolean;
}

export interface VideoPlayerPlayButtonProps {
  isPlaying: boolean;
  isEnded: boolean;
  disabledTooltip?: boolean;
  onClick: () => void;
  isFullscreen?: boolean;
}

export interface VideoPlayerSkipButtonProps {
  /**
   * Arah lompatan durasi video ('backward' untuk mundur, 'forward' untuk maju).
   */
  direction: 'backward' | 'forward';
  /**
   * Jumlah detik lompatan waktu.
   * @default 5
   */
  seconds?: number;
  /**
   * Apakah gelembung tooltip dinonaktifkan.
   * @default false
   */
  disabledTooltip?: boolean;
  /**
   * Callback aksi klik tombol.
   */
  onClick: () => void;
  isFullscreen?: boolean;
}

export interface VideoPlayerTimelineProps {
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  scrubbingVtt?: string;
  disablePreview?: boolean;
  onSeek: (seconds: number, autoPlay?: boolean, silentTextInfo?: boolean) => void;
  isFullscreen?: boolean;
  isPlaying?: boolean;
}

export interface VideoPlayerTimeDisplayProps {
  currentTime: number;
  duration: number;
  isLoop?: boolean;
  playbackRate?: number;
  isFullscreen?: boolean;
}

export interface VideoPlayerVolumeProps {
  volume: number;
  isMuted: boolean;
  disabledTooltip?: boolean;
  onChange: (volume: number) => void;
  onToggleMute: () => void;
  isFullscreen?: boolean;
}

export interface VideoPlayerPlaybackRateProps {
  playbackRate: number;
  rates: number[];
  onChange: (rate: number) => void;
}

export interface VideoPlayerSubtitleProps {
  tracks: VideoTrackSource[];
  currentSubtitle: string;
  disabledTooltip?: boolean;
  onChange: (lang: string) => void;
  isFullscreen?: boolean;
}

export interface VideoPlayerQualityProps {
  qualities: VideoQualityOption[];
  currentQuality: string | number;
  onChange: (qualityId: string | number) => void;
}

export interface VideoPlayerFullscreenProps {
  isFullscreen: boolean;
  isPiP?: boolean;
  showPiP?: boolean;
  showFullscreen?: boolean;
  disabledTooltip?: boolean;
  onToggleFullscreen: () => void;
  onTogglePiP?: () => void;
}

export interface VideoPlayerSubtitlesProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentSubtitle: string;
  isFullscreen?: boolean;
  isControlsVisible?: boolean;
}

export interface VideoPlayerTextInfoState {
  message: string;
  subMessage: string;
  visible: boolean;
}

export interface VideoPlayerTextInfoProps {
  message?: string;
  subMessage?: string;
  visible?: boolean;
  isFullscreen?: boolean;
}

export interface VideoPlayerContextMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  action?: () => void;
}

export interface VideoPlayerContextMenuGroup {
  title: string;
  items: VideoPlayerContextMenuItem[];
}

export interface VideoPlayerContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  isFullscreen?: boolean;
  isPlaying?: boolean;
  isMuted?: boolean;
  isLoop?: boolean;
  onAction?: (actionId: string, item?: VideoPlayerContextMenuItem) => void;
  onClose?: () => void;
}


