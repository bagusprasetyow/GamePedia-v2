import { useState, useRef, useEffect, type FC, type ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Button, Dot, Text, Tooltip } from '@/components/atoms';
import { videoPlayerTooltipClasses } from '../VideoPlayer.styles';
import type { VideoPlayerQualityProps } from '../VideoPlayer.types';

/**
 * VideoPlayerQualityButton Component - Sub-Molecule Internal VideoPlayer
 *
 * Tombol pengatur tingkat resolusi dan kualitas video (HLS adaptive / multi-bitrate)
 * dengan popover menu pilihan kualitas (misal: Otomatis, 1080p, 720p, 480p, 360p).
 */
export const VideoPlayerQualityButton: FC<VideoPlayerQualityProps> = ({
  qualities,
  currentQuality,
  onChange,
}): ReactElement | null => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!qualities || qualities.length === 0) {
    return null;
  }

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Label resolusi aktif saat ini
  const activeQualityOption = qualities.find(
    (q) => String(q.id) === String(currentQuality)
  );
  const currentLabel = activeQualityOption ? activeQualityOption.label : 'Auto';
  const isAuto = String(currentQuality) === '-1' || currentLabel.toLowerCase() === 'otomatis';

  const triggerButtonClasses = cn(
    // layout
    'gap-1',
    // size
    'h-9 px-2',
    // typography
    'font-poppins tabular-nums text-xs',
    // background
    !isAuto ? 'bg-primary/10' : 'hover:bg-white/10',
    // text
    !isAuto ? 'text-primary' : 'text-white',
    // interaction
    !isAuto ? 'hover:bg-primary/20' : 'hover:text-white hover:bg-white/10',
    // transition
    'transition-colors'
  );

  const popoverClasses = cn(
    // layout
    'flex flex-col gap-1 overflow-y-auto',
    // position
    'absolute bottom-full mb-2 right-0 z-30',
    // size
    'min-w-36 max-h-60',
    // spacing
    'p-1.5',
    // border
    'rounded-xl border border-white/10',
    // background
    'bg-black/90 backdrop-blur-md',
    // shadow & depth
    'shadow-3'
  );

  const menuHeaderClasses = cn(
    // spacing
    'px-2 py-1',
    // border
    'border-b border-white/10',
    // text
    'text-white'
  );

  const getRadioOuterClasses = (isSelected: boolean) =>
    cn(
      // layout
      'relative inline-flex shrink-0 items-center justify-center',
      // size
      'h-3.5 w-3.5',
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

  return (
    <div ref={menuRef} className="relative">
      <Tooltip
        content={`Kualitas: ${currentLabel}`}
        placement="top"
        size="xs"
        showArrow={false}
        disabled={isOpen}
        closeOnClick={false}
        tooltipClassName={videoPlayerTooltipClasses()}
      >
        <Button
          variant="ghost"
          size="sm"
          rounded="full"
          startIcon="lucide:settings"
          aria-label={`Pengaturan Resolusi (${currentLabel})`}
          onClick={toggleOpen}
          className={triggerButtonClasses}
        >
          <Text as="span" weight="semibold" className="text-[11px]">
            {currentLabel}
          </Text>
        </Button>
      </Tooltip>

      {/* Popover Pilihan Tingkat Kualitas Video */}
      {isOpen && (
        <div className={popoverClasses}>
          <Text
            as="div"
            size="xs"
            weight="semibold"
            variant="white"
            className={menuHeaderClasses}
          >
            Kualitas Video
          </Text>

          {/* Daftar Resolusi */}
          {qualities.map((item) => {
            const isSelected = String(currentQuality) === String(item.id);

            const optionButtonClasses = cn(
              // layout
              'group w-full flex items-center justify-between select-none',
              // size
              'h-7 px-2',
              // typography
              'font-poppins tabular-nums text-xs',
              // typography weight & text
              isSelected
                ? 'font-medium !bg-white/10 !text-white'
                : '!bg-transparent !text-white/80 hover:!text-white hover:!bg-white/10'
            );

            return (
              <Button
                key={String(item.id)}
                size="xs"
                variant="ghost"
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                className={optionButtonClasses}
              >
                <div className="flex items-center gap-1.5">
                  <Text
                    as="span"
                    size="xs"
                    variant="white"
                    weight={isSelected ? 'medium' : 'normal'}
                    className={isSelected ? 'text-white' : 'text-white/80'}
                  >
                    {item.label}
                  </Text>
                  {item.height && (
                    <Text
                      as="span"
                      size="xs"
                      variant="white"
                      className={cn('text-[10px] font-sans', isSelected ? 'text-white/90' : 'text-white/60')}
                    >
                      {item.height >= 720 ? 'HD' : 'SD'}
                    </Text>
                  )}
                </div>
                <span className={getRadioOuterClasses(isSelected)}>
                  {isSelected && <Dot size="2xs" variant="white" aria-hidden="true" />}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
