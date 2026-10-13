import { useCallback, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import type { VideoPlayerProps, VideoSource } from './VideoPlayer.types';
import {
  sizeClasses,
  variantClasses,
  aspectRatioClasses,
  objectFitClasses,
  roundedClasses,
  depthClasses,
  resolveDepthKey,
} from './VideoPlayer.styles';
import { useVideoPlayer } from './useVideoPlayer';
import { useVideoClickHandler } from './useVideoClickHandler';
import { useContextMenu } from './useContextMenu';
import { VideoPlayerOverlay } from './components/VideoPlayerOverlay';
import { VideoPlayerControls } from './components/VideoPlayerControls';
import { VideoPlayerSubtitles } from './components/VideoPlayerSubtitles';
import { VideoPlayerTextInfo } from './components/VideoPlayerTextInfo';
import { VideoPlayerContextMenu } from './components/VideoPlayerContextMenu';

// ─────────────────────────────────────────────────────────────
// 1. TAMPILAN: Class Maps & Styling Setup
// (Diekspor secara modular di VideoPlayer.styles.ts)
// ─────────────────────────────────────────────────────────────

/**
 * VideoPlayer Component - Molecule UI
 *
 * Pemutar video modern interaktif berbasis Atomic Design GamePedia dengan kontrol kustom taktil,
 * Depth System (-3 s/d 3), timeline scrubber presisi tinggi, indikator buffer data,
 * dukungan multi-format video, dan pintasan keyboard aksesibel.
 *
 * @param {string | VideoSource[]} [props.src] - URL berkas video tunggal atau daftar format alternatif
 * @param {VideoTrackSource[]} [props.tracks] - Daftar track subtitle WebVTT
 * @param {string} [props.poster] - URL gambar thumbnail poster sebelum diputar
 * @param {ReactNode} [props.title] - Judul video yang tampil pada header overlay
 * @param {boolean} [props.autoPlay=false] - Memutar video secara otomatis saat dimuat
 * @param {boolean} [props.loop=false] - Mengulang pemutaran terus menerus
 * @param {boolean} [props.muted=false] - Menonaktifkan suara
 * @param {number} [props.defaultVolume=1] - Level volume awal (0 - 1)
 * @param {string} [props.preload='metadata'] - Kebijakan pra-muat media browser
 * @param {boolean} [props.controls=true] - Menampilkan bilah kendali kontrol
 * @param {VideoPlayerAspectRatio} [props.aspectRatio='16/9'] - Rasio aspek tampilan
 * @param {VideoPlayerSize} [props.size='md'] - Skala ukuran dimensi kontainer
 * @param {VideoPlayerVariant} [props.variant='default'] - Varian gaya bingkai pemutar
 * @param {VideoPlayerDepth} [props.depth=1] - Tingkat kedalaman taktil Depth System (-3 s/d 3)
 * @param {VideoPlayerRounded} [props.rounded='lg'] - Kelengkungan sudut
 * @param {boolean} [props.showPlaybackRate=true] - Menampilkan pemilih kecepatan putar
 * @param {number[]} [props.playbackRates=[0.5, 0.75, 1, 1.5, 2]] - Daftar kecepatan putar
 * @param {boolean} [props.showPiP=true] - Menampilkan tombol Picture-in-Picture
 * @param {boolean} [props.showFullscreen=true] - Menampilkan tombol Layar Penuh
 * @param {boolean} [props.showVolume=true] - Menampilkan pengatur volume
 * @param {boolean} [props.showTime=true] - Menampilkan durasi waktu
 * @param {number} [props.autoHideControlsDelay=2500] - Waktu sembunyi kontrol saat diam (ms)
 * @param {boolean} [props.enableKeyboardShortcuts=true] - Mengaktifkan pintasan keyboard
 * @param {string} [props.className] - Class kustom tambahan untuk kontainer
 *
 * @returns {ReactElement} Elemen antarmuka pemutar video GamePedia
 */
export const VideoPlayer: FC<VideoPlayerProps> = (props): ReactElement => {
  const {
    src,
    tracks = [],
    poster,
    title,
    showTitle = false,
    autoPlay = false,
    loop = false,
    muted = false,
    defaultVolume = 1,
    preload = 'metadata',
    controls = true,
    aspectRatio = '16/9',
    objectFit = 'cover',
    size = 'md',
    variant = 'default',
    depth,
    rounded = 'lg',
    showPlaybackRate = true,
    playbackRates = [0.5, 0.75, 1, 1.5, 2],
    showQuality = true,
    qualities: customQualities,
    defaultQuality = -1,
    scrubbingVtt,
    showSubtitles = true,
    defaultSubtitle = 'off',
    showPiP = false,
    showFullscreen = true,
    showVolume = true,
    showTime = true,
    autoHideControlsDelay = 2500,
    enableKeyboardShortcuts = true,
    enableContextMenu = true,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onVolumeChange,
    onWaiting,
    onSeeked,
    onError,
    onQualityChange,
    className = '',
    ...restProps
  } = props;

  // ─────────────────────────────────────────────────────────────
  // 2. LOGIKA: State, Handlers & Styling Calculation
  // ─────────────────────────────────────────────────────────────
  const {
    videoRef,
    containerRef,
    isPlaying,
    isBuffering,
    hasStarted,
    isEnded,
    isControlsVisible,
    currentTime,
    duration,
    bufferedPercent,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    currentSubtitle,
    qualities: activeQualities,
    currentQuality,
    isLoop,
    toggleLoop,
    errorMessage,
    togglePlay,
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
    handleMouseMove,
    handleMouseLeave,
    handleRetry,
    textInfo,
  } = useVideoPlayer({
    src,
    tracks,
    defaultSubtitle,
    qualities: customQualities,
    defaultQuality,
    autoPlay,
    loop,
    muted,
    defaultVolume,
    autoHideControlsDelay,
    enableKeyboardShortcuts,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onVolumeChange,
    onWaiting,
    onSeeked,
    onError,
    onQualityChange,
  });

  const safeSize = sizeClasses[size] ? size : 'md';
  const safeVariant = variantClasses[variant] ? variant : 'default';
  const safeAspect = aspectRatioClasses[aspectRatio] ? aspectRatio : '16/9';
  const safeObjectFit = objectFitClasses[objectFit] ? objectFit : 'cover';
  const safeRounded = roundedClasses[rounded] ? rounded : 'lg';
  const resolvedDepthKey = resolveDepthKey(depth, safeVariant);
  const resolvedDepthClass = depthClasses[resolvedDepthKey] || depthClasses['-1'];
  const isSunken = resolvedDepthKey.startsWith('-') || resolvedDepthKey === 'sunken';

  const isControlsActive = isControlsVisible || isBuffering || isSettingsOpen;
  const isCursorHidden = !isControlsActive && isPlaying;

  const contextMenu = useContextMenu(containerRef, enableContextMenu);

  const handleContextMenuAction = useCallback(
    (actionId: string) => {
      switch (actionId) {
        case 'play':
          togglePlay();
          break;
        case 'mute':
          toggleMute();
          break;
        case 'loop':
          toggleLoop();
          break;
        case 'speed':
          setIsSettingsOpen(true);
          setSettingsSubMenu('speed');
          break;
        case 'subtitles':
          setIsSettingsOpen(true);
          setSettingsSubMenu('subtitles');
          break;
        case 'quality':
          setIsSettingsOpen(true);
          setSettingsSubMenu('quality');
          break;
        case 'fullscreen':
          toggleFullscreen();
          break;
        case 'captions':
          toggleSubtitle();
          break;
      }
    },
    [
      togglePlay,
      toggleMute,
      toggleLoop,
      setIsSettingsOpen,
      setSettingsSubMenu,
      toggleFullscreen,
      toggleSubtitle,
    ]
  );

  const containerClasses = cn(
    // layout
    'overflow-hidden select-none outline-none group',
    // position
    'relative',
    // size
    !isFullscreen
      ? [sizeClasses[safeSize], aspectRatioClasses[safeAspect]]
      : 'w-full h-full max-w-none max-h-none',
    // border
    !isFullscreen ? roundedClasses[safeRounded] : 'rounded-none',
    // background & variant
    !isFullscreen ? variantClasses[safeVariant] : 'bg-black border-0',
    // shadow & depth
    !isFullscreen && resolvedDepthClass,
    // interaction
    isCursorHidden && 'cursor-none',
    // focus
    !isFullscreen && 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    // transition
    'transition-shadow duration-200',
    // responsive & pseudo-classes
    'fullscreen:w-full fullscreen:h-full fullscreen:max-w-none fullscreen:rounded-none fullscreen:border-0 fullscreen:bg-black fullscreen:shadow-none',
    className
  );

  const sources: VideoSource[] = typeof src === 'string' ? [{ src }] : Array.isArray(src) ? src : [];

  const { handleClick: handleVideoClick, handleDoubleClick: handleVideoDoubleClick } =
    useVideoClickHandler({
      onSingleClick: togglePlay,
      onDoubleClick: toggleFullscreen,
    });

  const videoClasses = cn(
    // size
    'w-full h-full',
    // background
    'bg-black',
    // interaction
    isCursorHidden ? 'cursor-none' : 'cursor-default',
    objectFitClasses[safeObjectFit]
  );

  const sunkenOverlayClasses = cn(
    // position
    'absolute inset-0 z-10',
    // border
    'rounded-[inherit]',
    // shadow & depth
    resolvedDepthClass,
    // state
    'pointer-events-none'
  );

  // ─────────────────────────────────────────────────────────────
  // 3. RENDER UI
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="region"
      aria-label={typeof title === 'string' ? title : 'Pemutar Video'}
      {...restProps}
    >
      {/* Elemen Video HTML5 Inti */}
      <video
        ref={videoRef}
        className={videoClasses}
        preload={preload}
        poster={poster}
        playsInline
        muted={isMuted}
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
        tabIndex={-1}
      >
        {sources.map((sourceItem) => (
          <source
            key={sourceItem.src}
            src={sourceItem.src}
            type={sourceItem.type}
          />
        ))}
        {tracks.map((trackItem) => (
          <track
            key={trackItem.src}
            src={trackItem.src}
            label={trackItem.label}
            kind={trackItem.kind || 'subtitles'}
            srcLang={trackItem.srcLang}
            default={defaultSubtitle !== 'off' ? trackItem.default : false}
          />
        ))}
      </video>

      {/* Lapisan Efek Kedalaman Cekung (Sunken Inset Shadow Overlay) */}
      {!isFullscreen && isSunken && (
        <div
          className={sunkenOverlayClasses}
          aria-hidden="true"
        />
      )}

      {/* Lapisan Overlay (Poster, Big Play Button, Loading Spinner, Error Alert, Header Title) */}
      <VideoPlayerOverlay
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        hasStarted={hasStarted}
        isEnded={isEnded}
        poster={poster}
        title={title}
        showTitle={showTitle}
        isControlsVisible={isControlsVisible}
        errorMessage={errorMessage}
        onTogglePlay={togglePlay}
        onReplay={replay}
        onToggleFullscreen={toggleFullscreen}
        onRetry={handleRetry}
        isFullscreen={isFullscreen}
      />

      {/* Lapisan Umpan Balik Teks HUD di Pojok Kiri Atas ala dev/videoPlayer (Memutar, Dijeda, Volume, Maju/Mundur, dll.) */}
      <VideoPlayerTextInfo
        message={textInfo.message}
        subMessage={textInfo.subMessage}
        visible={textInfo.visible}
        isFullscreen={isFullscreen}
      />

      {/* Lapisan Teks Subtitle Dinamis ala dev/videoPlayer (WebVTT Cue Sync & Outline) */}
      <VideoPlayerSubtitles
        videoRef={videoRef}
        currentSubtitle={currentSubtitle}
        isFullscreen={isFullscreen}
        isControlsVisible={isControlsActive}
      />

      {/* Menu Klik Kanan Kustom (Custom Context Menu ala dev/videoPlayer) */}
      {enableContextMenu && (
        <VideoPlayerContextMenu
          visible={contextMenu.visible}
          x={contextMenu.coords.x}
          y={contextMenu.coords.y}
          isFullscreen={isFullscreen}
          isPlaying={isPlaying}
          isMuted={isMuted}
          isLoop={isLoop}
          onAction={handleContextMenuAction}
          onClose={contextMenu.hide}
        />
      )}

      {/* Bilah Kendali Kontrol Bawah (Control Bar) */}
      {controls && (
        <VideoPlayerControls
          isVisible={isControlsActive}
          isPlaying={isPlaying}
          isEnded={isEnded}
          currentTime={currentTime}
          duration={duration}
          bufferedPercent={bufferedPercent}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          playbackRates={playbackRates}
          isFullscreen={isFullscreen}
          isPiP={isPiP}
          showPlaybackRate={showPlaybackRate}
          showPiP={showPiP}
          showFullscreen={showFullscreen}
          showVolume={showVolume}
          showTime={showTime}
          showSubtitles={showSubtitles}
          tracks={tracks}
          currentSubtitle={currentSubtitle}
          showQuality={showQuality}
          qualities={activeQualities}
          currentQuality={currentQuality}
          isLoop={isLoop}
          onToggleLoop={toggleLoop}
          scrubbingVtt={scrubbingVtt}
          isSettingsOpen={isSettingsOpen}
          onSettingsOpenChange={setIsSettingsOpen}
          settingsSubMenu={settingsSubMenu}
          onSettingsSubMenuChange={setSettingsSubMenu}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onSkip={skip}
          onVolumeChange={setVolumeLevel}
          onToggleMute={toggleMute}
          onPlaybackRateChange={setPlaybackRateLevel}
          onToggleFullscreen={toggleFullscreen}
          onTogglePiP={togglePiP}
          onSubtitleChange={setSubtitle}
          onQualityChange={setQuality}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
