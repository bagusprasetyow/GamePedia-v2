import { useState, useRef, useEffect, useCallback, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Button, Dot, Icon, SegmentedControl, Switch, Text, Tooltip } from '@/components/atoms';
import { videoPlayerTooltipClasses } from '../VideoPlayer.styles';
import type { VideoPlayerSettingsProps } from '../VideoPlayer.types';

type SettingsSubMenu = 'main' | 'speed' | 'subtitles' | 'quality';

/**
 * VideoPlayerSettingsMenu Component - Sub-Molecule Internal VideoPlayer
 *
 * Menu pengaturan terpadu video modern ala YouTube / Genshin Player dengan:
 * 1. Loop toggle (Switch)
 * 2. Speed playback rate selector
 * 3. Subtitles language selector
 * 4. Quality resolution selector dengan badge HD merah
 */
export const VideoPlayerSettingsMenu: FC<VideoPlayerSettingsProps> = ({
  isLoop,
  onToggleLoop,
  playbackRate,
  playbackRates,
  onPlaybackRateChange,
  tracks = [],
  currentSubtitle = 'off',
  onSubtitleChange,
  qualities = [],
  currentQuality = -1,
  onQualityChange,
  isOpen: controlledIsOpen,
  onOpenChange,
  activeSubMenu: controlledSubMenu,
  onSubMenuChange,
  isFullscreen = false,
}): ReactElement => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const [internalSubMenu, setInternalSubMenu] = useState<SettingsSubMenu>('main');
  const isSubMenuControlled = controlledSubMenu !== undefined;
  const activeSubMenu = isSubMenuControlled ? controlledSubMenu : internalSubMenu;

  const setActiveSubMenu = useCallback(
    (next: SettingsSubMenu) => {
      if (!isSubMenuControlled) {
        setInternalSubMenu(next);
      }
      onSubMenuChange?.(next);
    },
    [isSubMenuControlled, onSubMenuChange]
  );

  const menuRef = useRef<HTMLDivElement | null>(null);

  const setIsOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const nextVal = typeof next === 'function' ? next(isOpen) : next;
      if (!isControlled) {
        setInternalIsOpen(nextVal);
      }
      onOpenChange?.(nextVal);
    },
    [isControlled, isOpen, onOpenChange]
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveSubMenu('main');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, setIsOpen, setActiveSubMenu]);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setActiveSubMenu('main');
      }
      return next;
    });
  };


  // Label resolusi aktif saat ini
  const activeQualityOption = qualities.find(
    (q) => String(q.id) === String(currentQuality)
  );
  const activeQualityLabel = activeQualityOption ? activeQualityOption.label : 'Auto';
  const isCurrentQualityHd =
    (activeQualityOption?.height && activeQualityOption.height >= 720) ||
    activeQualityLabel.toLowerCase().includes('hd') ||
    activeQualityLabel.includes('1080') ||
    activeQualityLabel.includes('720');

  // Label subtitle aktif saat ini
  const activeTrackOption = tracks.find(
    (t) =>
      currentSubtitle === (t.srcLang || t.label) ||
      currentSubtitle.toLowerCase() === t.label.toLowerCase()
  );
  const activeSubtitleLabel =
    currentSubtitle === 'off' ? 'Off' : activeTrackOption ? activeTrackOption.label : currentSubtitle;

  const iconClasses = cn(
    // layout
    'flex items-center justify-center',
    // size
    isFullscreen ? 'w-6 h-6' : 'w-4.5 h-4.5',
    // text & color
    isOpen ? 'text-white' : 'text-white/80 hover:text-white',
    // interaction
    'cursor-pointer select-none',
    // focus
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-black rounded-xs',
    // transition
    'transition-colors duration-150'
  );

  const handleTriggerKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    }
  };

  const popoverContainerClasses = cn(
    // layout
    'flex flex-col gap-0.5 overflow-hidden font-poppins',
    // position
    isFullscreen
      ? 'absolute bottom-full mb-9 -right-11 z-30 w-80 p-1.5'
      : 'absolute bottom-full mb-7 -right-8 z-30 w-60 p-1',
    // border
    'rounded-xl border border-white/15',
    // background
    'bg-black/55 backdrop-blur-xl',
    // shadow & depth
    'shadow-1'
  );

  const menuItemClasses = cn(
    // layout
    'flex items-center justify-between gap-3 w-full select-none',
    // spacing
    isFullscreen ? 'px-3.5 py-2.5' : 'px-2.5 py-1.5',
    // border
    'rounded-lg',
    // background
    'bg-transparent',
    // interaction
    'hover:bg-white/10 cursor-pointer',
    // transition
    'transition-colors duration-150'
  );

  const subMenuHeaderClasses = cn(
    // layout
    'flex items-center gap-2 select-none',
    // spacing
    isFullscreen ? 'px-3 py-2' : 'px-2 py-1.5',
    // border
    'rounded-lg border-b border-white/10',
    // text
    'text-white',
    // interaction
    'cursor-pointer hover:bg-white/10',
    // transition
    'transition-colors'
  );

  const subMenuListClasses = cn(
    // layout
    'flex flex-col gap-0.5 overflow-y-auto py-0.5',
    // size
    isFullscreen ? 'max-h-72' : 'max-h-52'
  );

  const getSubMenuButtonClasses = (isSelected: boolean) =>
    cn(
      // layout
      'group w-full flex items-center justify-between select-none',
      // typography
      'font-poppins',
      // background & text
      isSelected
        ? '!bg-white/10 !text-white font-medium'
        : '!bg-transparent !text-white/80 hover:!text-white hover:!bg-white/10 active:!bg-white/15',
      // transition
      'transition-colors duration-150'
    );

  const getRadioOuterClasses = (isSelected: boolean) =>
    cn(
      // layout
      'relative inline-flex shrink-0 items-center justify-center',
      // size
      isFullscreen ? 'h-4 w-4' : 'h-3.5 w-3.5',
      // border
      'rounded-full border',
      isSelected
        ? 'border-white'
        : 'border-white/40 group-hover:border-white/70',
      // background
      'bg-transparent',
      // transition
      'transition-all duration-150'
    );

  const segmentedControlClasses = cn(
    // border
    'border-white/15',
    // background
    'bg-black/40',
    // text & interaction
    '[&_button]:text-white/70 [&_button:hover]:text-white [&_button[data-state=active]]:text-white'
  );


  const hdBadgeTriggerClasses = cn(
    // layout
    'inline-flex items-center justify-center',
    // position
    'absolute',
    isFullscreen ? '-top-1 -right-2.5' : '-top-0.5 -right-2',
    // size
    isFullscreen ? 'h-3 px-1' : 'h-2.5 px-0.75',
    // typography
    'leading-none tracking-tight',
    isFullscreen ? 'text-[8px]' : 'text-[6.5px]',
    // border
    isFullscreen ? 'rounded-[2.5px]' : 'rounded-xs',
    // background
    'bg-destructive',
    // text
    'text-white',
    // shadow & depth
    'shadow-xs',
    // state
    'pointer-events-none select-none'
  );

  const hdBadgeInlineClasses = cn(
    // layout
    'inline-flex items-center justify-center',
    // position / alignment (lebih ke atas sejajar cap-height teks)
    isFullscreen ? '-translate-y-1.5' : '-translate-y-1',
    // size
    isFullscreen ? 'h-3 px-1' : 'h-2.5 px-0.75',
    // spacing
    'mx-0.5',
    // typography
    'font-sans leading-none',
    isFullscreen ? 'text-[8px]' : 'text-[6.5px]',
    // border
    isFullscreen ? 'rounded-[2.5px]' : 'rounded-xs',
    // background
    'bg-destructive',
    // text
    'text-white',
    // state
    'select-none'
  );

  const renderRadioIndicator = (isSelected: boolean) => (
    <span className={getRadioOuterClasses(isSelected)}>
      {isSelected && (
        <Dot
          size={isFullscreen ? 'xs' : '2xs'}
          variant="white"
          aria-hidden="true"
        />
      )}
    </span>
  );

  return (
    <div ref={menuRef} className="relative flex items-center justify-center shrink-0">
      <Tooltip
        content="Pengaturan"
        placement="top"
        size="xs"
        showArrow={false}
        disabled={isOpen}
        closeOnClick={false}
        tooltipClassName={videoPlayerTooltipClasses(isFullscreen)}
      >
        <div className="relative flex items-center justify-center">
          <Icon
            icon="lucide:settings"
            size={isFullscreen ? 'sm' : 'xs'}
            aria-label="Pengaturan"
            role="button"
            tabIndex={0}
            onClick={toggleOpen}
            onKeyDown={handleTriggerKeyDown}
            className={iconClasses}
          />
          {/* Badge Merah HD di Sudut Kanan Atas (hanya muncul jika resolusi yang sedang aktif adalah HD) */}
          {isCurrentQualityHd && (
            <Text
              as="span"
              size="xs"
              variant="white"
              weight="bold"
              className={hdBadgeTriggerClasses}
            >
              HD
            </Text>
          )}
        </div>
      </Tooltip>

      {/* Popover Menu Pengaturan Terpadu */}
      {isOpen && (
        <div className={popoverContainerClasses}>
          {/* 1. Tampilan MENU UTAMA */}
          {activeSubMenu === 'main' && (
            <div className="flex flex-col gap-0.5">
              {/* Baris 1: Loop */}
              <div
                className={menuItemClasses}
                onClick={onToggleLoop}
              >
                <div className="flex items-center gap-2 text-white">
                  <Icon icon="lucide:repeat" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                  <Text as="span" weight="medium" size={isFullscreen ? 'sm' : 'xs'} className="text-white">
                    Loop
                  </Text>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    size={isFullscreen ? 'sm' : 'xs'}
                    checked={isLoop}
                    onCheckedChange={onToggleLoop}
                    aria-label="Ulangi video (Loop)"
                  />
                </div>
              </div>

              {/* Baris 2: Speed */}
              <div
                className={menuItemClasses}
                onClick={() => setActiveSubMenu('speed')}
              >
                <div className="flex items-center gap-2 text-white shrink-0">
                  <Icon icon="material-symbols:speed" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                  <Text as="span" weight="medium" size={isFullscreen ? 'sm' : 'xs'} className="text-white">
                    Speed
                  </Text>
                </div>
                <div className="flex items-center gap-1 text-white shrink-0">
                  <Text as="span" size={isFullscreen ? 'sm' : 'xs'} className="font-poppins tabular-nums text-white whitespace-nowrap">
                    {playbackRate}x
                  </Text>
                  <Icon icon="lucide:chevron-right" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                </div>
              </div>

              {/* Baris 3: Subtitles */}
              {tracks.length > 0 && onSubtitleChange && (
                <div
                  className={menuItemClasses}
                  onClick={() => setActiveSubMenu('subtitles')}
                >
                  <div className="flex items-center gap-2 text-white shrink-0">
                    <Icon
                      icon={currentSubtitle !== 'off' ? 'bi:cc-square-fill' : 'bi:cc-square'}
                      size={isFullscreen ? 'sm' : 'xs'}
                      className="text-white shrink-0"
                    />
                    <Text as="span" weight="medium" size={isFullscreen ? 'sm' : 'xs'} className="text-white">
                      Subtitles
                    </Text>
                  </div>
                  <div className="flex items-center gap-1 text-white shrink-0">
                    <Text as="span" size={isFullscreen ? 'sm' : 'xs'} className="text-white truncate max-w-28">
                      {activeSubtitleLabel}
                    </Text>
                    <Icon icon="lucide:chevron-right" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                  </div>
                </div>
              )}

              {/* Baris 4: Quality */}
              {qualities.length > 0 && onQualityChange && (
                <div
                  className={menuItemClasses}
                  onClick={() => setActiveSubMenu('quality')}
                >
                  <div className="flex items-center gap-2 text-white shrink-0">
                    <Icon
                      icon={isCurrentQualityHd ? 'material-symbols:hd' : 'material-symbols:tune'}
                      size={isFullscreen ? 'sm' : 'xs'}
                      className="text-white shrink-0"
                    />
                    <Text as="span" weight="medium" size={isFullscreen ? 'sm' : 'xs'} className="text-white">
                      Quality
                    </Text>
                  </div>
                  <div className="flex items-center gap-1 text-white shrink-0">
                    <Text as="span" size={isFullscreen ? 'sm' : 'xs'} className="text-white whitespace-nowrap">
                      {activeQualityLabel}
                    </Text>
                    {isCurrentQualityHd && (
                      <Text
                        as="span"
                        size="xs"
                        variant="white"
                        weight="bold"
                        className={hdBadgeInlineClasses}
                      >
                        HD
                      </Text>
                    )}
                    <Icon icon="lucide:chevron-right" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Sub-Menu: KECEPATAN (Speed) */}
          {activeSubMenu === 'speed' && (
            <div className="flex flex-col gap-0.5">
              <div
                className={subMenuHeaderClasses}
                onClick={() => setActiveSubMenu('main')}
              >
                <Icon icon="lucide:chevron-left" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                <Text as="span" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" variant="white" className="text-white">
                  Kecepatan Pemutaran
                </Text>
              </div>

              <div className={isFullscreen ? 'px-2 py-2.5' : 'px-1 py-1.5'}>
                <SegmentedControl<number>
                  options={playbackRates.map((rate) => ({
                    value: rate,
                    label: String(rate),
                    ariaLabel: `Kecepatan ${rate}x`,
                  }))}
                  value={playbackRate}
                  onChange={(newRate) => {
                    onPlaybackRateChange(newRate);
                  }}
                  size={isFullscreen ? 'sm' : 'xs'}
                  fullWidth
                  color="primary"
                  className={segmentedControlClasses}
                  ariaLabel="Pilih kecepatan pemutaran video"
                />
              </div>
            </div>
          )}

          {/* 3. Sub-Menu: SUBTITLE (Subtitles) */}
          {activeSubMenu === 'subtitles' && onSubtitleChange && (
            <div className="flex flex-col gap-0.5">
              <div
                className={subMenuHeaderClasses}
                onClick={() => setActiveSubMenu('main')}
              >
                <Icon icon="lucide:chevron-left" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                <Text as="span" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" variant="white" className="text-white">
                  Teks Terjemahan (Subtitles)
                </Text>
              </div>

              <div className={subMenuListClasses}>
                {/* Opsi Nonaktifkan */}
                <Button
                  size={isFullscreen ? 'sm' : 'xs'}
                  variant="ghost"
                  onClick={() => {
                    onSubtitleChange('off');
                    setActiveSubMenu('main');
                  }}
                  className={getSubMenuButtonClasses(currentSubtitle === 'off')}
                >
                  <Text
                    as="span"
                    size={isFullscreen ? 'sm' : 'xs'}
                    variant="white"
                    weight={currentSubtitle === 'off' ? 'medium' : 'normal'}
                    className={currentSubtitle === 'off' ? 'text-white' : 'text-white/80'}
                  >
                    Off
                  </Text>
                  {renderRadioIndicator(currentSubtitle === 'off')}
                </Button>

                {tracks.map((track) => {
                  const langCode = track.srcLang || track.label;
                  const isSelected =
                    currentSubtitle === langCode ||
                    currentSubtitle.toLowerCase() === track.label.toLowerCase();

                  return (
                    <Button
                      key={track.src}
                      size={isFullscreen ? 'sm' : 'xs'}
                      variant="ghost"
                      onClick={() => {
                        onSubtitleChange(langCode);
                        setActiveSubMenu('main');
                      }}
                      className={getSubMenuButtonClasses(isSelected)}
                    >
                      <Text
                        as="span"
                        size={isFullscreen ? 'sm' : 'xs'}
                        variant="white"
                        weight={isSelected ? 'medium' : 'normal'}
                        className={isSelected ? 'text-white' : 'text-white/80'}
                      >
                        {track.label}
                      </Text>
                      {renderRadioIndicator(isSelected)}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Sub-Menu: RESOLUSI KUALITAS (Quality) */}
          {activeSubMenu === 'quality' && onQualityChange && (
            <div className="flex flex-col gap-0.5">
              <div
                className={subMenuHeaderClasses}
                onClick={() => setActiveSubMenu('main')}
              >
                <Icon icon="lucide:chevron-left" size={isFullscreen ? 'sm' : 'xs'} className="text-white shrink-0" />
                <Text as="span" size={isFullscreen ? 'sm' : 'xs'} weight="semibold" variant="white" className="text-white">
                  Kualitas Video
                </Text>
              </div>

              <div className={subMenuListClasses}>
                {qualities.map((item) => {
                  const isSelected = String(currentQuality) === String(item.id);
                  const isHd = item.height && item.height >= 720;

                  return (
                    <Button
                      key={String(item.id)}
                      size={isFullscreen ? 'sm' : 'xs'}
                      variant="ghost"
                      onClick={() => {
                        onQualityChange(item.id);
                        setActiveSubMenu('main');
                      }}
                      className={getSubMenuButtonClasses(isSelected)}
                    >
                      <div className="flex items-center gap-1.5">
                        <Text
                          as="span"
                          size={isFullscreen ? 'sm' : 'xs'}
                          variant="white"
                          weight={isSelected ? 'medium' : 'normal'}
                          className={isSelected ? 'text-white' : 'text-white/80'}
                        >
                          {item.label}
                        </Text>
                        {isHd && (
                          <Text
                            as="span"
                            size="xs"
                            variant="white"
                            weight="bold"
                            className={hdBadgeInlineClasses}
                          >
                            HD
                          </Text>
                        )}
                      </div>
                      {renderRadioIndicator(isSelected)}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
